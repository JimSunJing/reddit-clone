import React, { useState } from "react";
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { AiFillCloseCircle } from "react-icons/ai";
import { Alert, AlertIcon, AlertTitle, Flex, Icon } from "@chakra-ui/react";
import { type } from "os";
import TabItem from "./TabItem";
import TextInputs from "./PostForm/TextInputs";
import ImageUpload from "./PostForm/ImageUpload";
import { Post } from "@/atoms/postsatom";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "@/firebase/clientApp";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import useSelectFile from "@/hooks/useSelectFile";

const formTabs: TabItemType[] = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Video",
    icon: IoImageOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
  {
    title: "Poll",
    icon: BiPoll,
  },
  {
    title: "Talk",
    icon: BsMic,
  },
];

export type TabItemType = {
  title: string;
  icon: typeof Icon.arguments;
};

type Props = {
  user: User;
  communityImageURL?: string;
};

export default function NewPostForm({ user, communityImageURL }: Props) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });
  const [loading, setLoading] = useState(false);
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const [error, setError] = useState("");

  const handleCreatePost = async () => {
    setError("");
    const { communityId } = router.query;
    // create new post object
    const newPost: Post = {
      communityId: communityId as string,
      communityImageURL: communityImageURL || "",
      creatorId: user.uid,
      creatorDisplayName: user.email!.split("@")[0],
      title: textInputs.title,
      body: textInputs.body,
      numberOfComment: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
    };

    // store post in db
    setLoading(true);
    try {
      // store post
      const newPostRef = await addDoc(collection(firestore, "posts"), newPost);

      if (selectedFile) {
        // upload image
        const imageRef = ref(storage, `posts/${newPostRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);

        // put image url in post
        await updateDoc(newPostRef, {
          imageURL: downloadURL,
        });
        console.log("image Download URL:", downloadURL);
      }

      // return to community
      router.back();
    } catch (error: any) {
      console.log("handleCreatePost error", error);
      setError(error);
    }
    setLoading(false);
  };

  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.preventDefault();
    setTextInputs((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((item) => (
          <TabItem
            item={item}
            onTabClick={setSelectedTab}
            selected={selectedTab === item.title}
            key={item.title}
          />
        ))}
      </Flex>
      <Flex m="20px 0px">
        {selectedTab === "Post" && (
          <TextInputs
            textInputs={textInputs}
            onChange={onTextChange}
            loading={loading}
            handleCreatePost={handleCreatePost}
          />
        )}
        {selectedTab === "Images & Video" && (
          <ImageUpload
            selectedFile={selectedFile}
            onSelectImage={onSelectFile}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
          />
        )}
      </Flex>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Creating Post Error!</AlertTitle>
        </Alert>
      )}
    </Flex>
  );
}

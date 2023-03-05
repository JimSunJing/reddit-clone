import { Community } from "@/atoms/communitiesAtom";
import { Post } from "@/atoms/postsatom";
import { auth, firestore } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import { Flex, Stack } from "@chakra-ui/react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import PostItem from "./PostItem";

type Props = {
  communityData: Community;
};

export default function Posts({ communityData }: Props) {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState();
  const {
    postStateValue,
    setPostStateValue,
    onDeletePost,
    onSelectPost,
    onVote,
  } = usePosts();

  const getPosts = async () => {
    try {
      const postsQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      );

      const postsDocs = await getDocs(postsQuery);
      const posts = postsDocs.docs.map((post) => ({
        id: post.id,
        ...post.data(),
      }));

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));

      console.log("posts:", posts);
    } catch (error: any) {
      console.log("getPosts error", error.message);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);
  return (
    <Stack>
      {postStateValue.posts.map((post) => (
        <PostItem
          post={post}
          key={post.id}
          userIsCreator={user?.uid === post.creatorId}
          userVoteValue={undefined}
          onVote={onVote}
          onDeletePost={onDeletePost}
          onSelectPost={onSelectPost}
        />
      ))}
    </Stack>
  );
}

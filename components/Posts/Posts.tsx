import { Community } from "@/atoms/communitiesAtom";
import { firestore } from "@/firebase/clientApp";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";

type Props = {
  communityData: Community;
};

export default function Posts({ communityData }: Props) {
  const [loading, setLoading] = useState();

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

      console.log("posts:", posts);
    } catch (error: any) {
      console.log("getPosts error", error.message);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);
  return <div>Posts</div>;
}

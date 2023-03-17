import { Post } from "@/atoms/postsatom";
import About from "@/components/Community/About";
import PageContent from "@/components/Layout/PageContent";
import PostItem from "@/components/Posts/PostItem";
import { auth, firestore } from "@/firebase/clientApp";
import useCommunityData from "@/hooks/useCommunityHook";
import usePosts from "@/hooks/usePosts";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function PostPage() {
  const [user] = useAuthState(auth);
  const { postStateValue, setPostStateValue, onVote, onDeletePost } =
    usePosts();
  const { communityStateValue } = useCommunityData();
  const router = useRouter();

  const fetchPost = async (postId: string) => {
    try {
      const postRef = doc(firestore, "posts", postId);
      const postDoc = await getDoc(postRef);
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }));
    } catch (error) {
      console.log("fetchPost error:", error);
    }
  };

  useEffect(() => {
    const { pid } = router.query;

    if (pid && !postStateValue.selectedPost) {
      fetchPost(pid as string);
    }
  }, [router.query, postStateValue.selectedPost]);

  return (
    <PageContent>
      <>
        {postStateValue.selectedPost && (
          <PostItem
            post={postStateValue.selectedPost}
            onVote={onVote}
            onDeletePost={onDeletePost}
            userVoteValue={
              postStateValue.postVotes.find(
                (item) => item.postId === postStateValue.selectedPost?.id
              )?.voteValue
            }
            userIsCreator={user?.uid === postStateValue.selectedPost.creatorId}
          />
        )}
        {/* Comments */}
      </>
      <>
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}
      </>
    </PageContent>
  );
}

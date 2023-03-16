import { authModalState } from "@/atoms/AuthModalAtom";
import { Post, PostStateAtom, PostVote } from "@/atoms/postsatom";
import { auth, firestore, storage } from "@/firebase/clientApp";
import {
  collection,
  deleteDoc,
  doc,
  increment,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";

export default function usePosts() {
  const [user] = useAuthState(auth);
  const [postStateValue, setPostStateValue] = useRecoilState(PostStateAtom);
  const setAuthModalState = useSetRecoilState(authModalState);

  const onVote = async (post: Post, vote: number, communityId: string) => {
    // if user havn't login, show auth modal
    if (!user) {
      setAuthModalState((prev) => ({
        ...prev,
        open: true,
      }));
      return;
    }

    try {
      // backup for update
      const { voteStatus } = post;
      const existingVote = postStateValue.postVotes.find(
        (p) => p.postId === post.id
      );

      const batch = writeBatch(firestore);
      // for recoil state
      let updatedPost: Post;
      let updatedPosts: Post[];
      let updatedPostVotes = [...postStateValue.postVotes];
      let voteChange: number; // for post doc

      if (!existingVote) {
        // vote add 1 or -1
        // create new postVote
        const postVoteRef = doc(
          collection(firestore, `users/${user?.uid}/postVotes`)
        );

        const newPostVote: PostVote = {
          id: postVoteRef.id,
          communityId: communityId,
          postId: post.id!,
          voteValue: vote,
        };

        batch.set(postVoteRef, newPostVote);

        updatedPostVotes = [...updatedPostVotes, newPostVote];

        voteChange = vote;
      } else {
        const postVoteRef = doc(
          firestore,
          `users`,
          `${user?.uid}/postVotes/${existingVote.id}`
        );

        if (vote === existingVote.voteValue) {
          // cancle vote -1 / +1
          // delete postVote

          batch.delete(postVoteRef);

          updatedPostVotes = updatedPostVotes.filter(
            (pv) => pv.id !== existingVote.id
          );

          voteChange = -vote;
        } else {
          // change vote to opporsite +2 / -2
          batch.update(postVoteRef, {
            voteValue: vote,
          });

          voteChange = vote * 2;

          updatedPostVotes = updatedPostVotes.map((pv) => {
            if (pv.id === existingVote.id) {
              return {
                ...pv,
                voteValue: vote,
              };
            } else {
              return pv;
            }
          });
        }
      }

      const postRef = doc(firestore, `posts`, post.id!);

      batch.update(postRef, {
        voteStatus: voteStatus + voteChange,
      });

      await batch.commit();

      updatedPost = {
        ...post,
        voteStatus: voteStatus + voteChange,
      };

      updatedPosts = postStateValue.posts.map((post) => {
        if (post.id === updatedPost.id) {
          return updatedPost;
        } else return post;
      });

      setPostStateValue((prev) => ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatedPostVotes,
      }));
    } catch (error) {
      console.log("onVote error:", error);
    }
  };

  const onSelectPost = () => {};

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }

      const postRef = doc(firestore, `posts`, post.id!);
      await deleteDoc(postRef);

      // update post atom
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((p) => p.id !== post.id),
      }));

      return true;
    } catch (error) {
      console.log("Error delete post:", error);
      return false;
    }
  };

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  };
}

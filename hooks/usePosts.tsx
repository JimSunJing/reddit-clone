import { PostStateAtom } from "@/atoms/postsatom";
import React from "react";
import { useRecoilState } from "recoil";

export default function usePosts() {
  const [postStateValue, setPostStateValue] = useRecoilState(PostStateAtom);

  const onVote = async () => {};

  const onSelectPost = () => {};

  const onDeletePost = async () => {};

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  };
}

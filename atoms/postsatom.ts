import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export interface Post {
  id?: string;
  communityId: string;
  creatorId: string;
  creatorDisplayName: string;
  title: string;
  body: string;
  numberOfComment: number;
  voteStatus: number;
  imageURL?: string;
  communityImageURL?: string;
  createdAt: Timestamp;
}

interface PostState {
  selectedPost: Post | null;
  posts: Post[];
  // postVote
}

const defaultPostState: PostState = {
  selectedPost: null,
  posts: [],
};

export const PostStateAtom = atom<PostState>({
  key: "postState",
  default: defaultPostState,
});

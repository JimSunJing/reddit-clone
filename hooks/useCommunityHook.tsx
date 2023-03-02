import {
  Community,
  CommunitySnippet,
  CommunityStateAtom,
} from "@/atoms/communitiesAtom";
import { auth, firestore } from "@/firebase/clientApp";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";

export default function useCommunityData() {
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(CommunityStateAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) return;
    getUserSnippets();
  }, [user]);

  const getUserSnippets = async () => {
    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/commnitySnippets`)
      );
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
      }));
    } catch (error) {
      console.log("getUserSnippets error", error);
    }
  };

  const joinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    // if havn't login
    // pop out auth modal

    if (isJoined) {
      // leave community
      leaveCommunity(communityData.id);
      return;
    } else {
      // join community
      joinCommunity(communityData);
    }
  };

  const joinCommunity = (community: Community) => {};

  const leaveCommunity = (communityId: string) => {};

  return { communityStateValue, joinOrLeaveCommunity };
}

import { authModalState } from "@/atoms/AuthModalAtom";
import {
  Community,
  CommunitySnippet,
  CommunityStateAtom,
} from "@/atoms/communitiesAtom";
import { auth, firestore } from "@/firebase/clientApp";
import {
  collection,
  doc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";

export default function useCommunityData() {
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(CommunityStateAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [user] = useAuthState(auth);

  const setAuthModalState = useSetRecoilState(authModalState);

  useEffect(() => {
    if (!user) return;
    getUserSnippets();
  }, [user]);

  const getUserSnippets = async () => {
    setLoading(true);
    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
      }));
    } catch (error) {
      console.log("getUserSnippets error", error);
    }
    setLoading(false);
  };

  const joinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    // if havn't login
    // pop out auth modal
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    if (isJoined) {
      // leave community
      leaveCommunity(communityData.id);
      return;
    } else {
      // join community
      joinCommunity(communityData);
    }
  };

  const joinCommunity = async (communityData: Community) => {
    setLoading(true);
    try {
      // batch write: a serial write action that fail at same time
      const batch = writeBatch(firestore);

      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || "",
      };

      // add user snippet
      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        newSnippet
      );

      // increment number of member
      batch.update(doc(firestore, "communities", communityData.id), {
        numberOfMembers: increment(1),
      });

      await batch.commit();

      // update community atom
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (error: any) {
      console.log("joinCommunity error", error);
      setError(error.message);
    }
    setLoading(false);
  };

  const leaveCommunity = async (communityId: string) => {
    setLoading(true);
    try {
      const batch = writeBatch(firestore);

      // delete snippet
      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
      );

      // update number of member
      batch.update(doc(firestore, "communities", communityId), {
        numberOfMembers: increment(-1),
      });

      await batch.commit();

      // update community state
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.communityId !== communityId
        ),
      }));
    } catch (error: any) {
      console.log("leaveCommunity error", error);
      setError(error.message);
    }
    setLoading(false);
  };

  return { communityStateValue, joinOrLeaveCommunity, loading };
}

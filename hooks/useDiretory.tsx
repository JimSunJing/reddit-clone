import { CommunityStateAtom } from "@/atoms/communitiesAtom";
import {
  DiretoryMenuItem,
  diretoryMenuStateAtom,
} from "@/atoms/diretoryMenuAtom";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FaReddit } from "react-icons/fa";
import { useRecoilState, useRecoilValue } from "recoil";

export default function useDiretory() {
  const [diretoryMenuState, setDiretoryMenuState] = useRecoilState(
    diretoryMenuStateAtom
  );
  const router = useRouter();
  const CommunityStateValue = useRecoilValue(CommunityStateAtom);

  const onSelectMenuItem = (menuItem: DiretoryMenuItem) => {
    setDiretoryMenuState((prev) => ({
      ...prev,
      selectedMenuItem: menuItem,
    }));
    router.push(menuItem.link);
    if (diretoryMenuState.isOpen) toggleMenuOpen();
  };

  const toggleMenuOpen = () => {
    setDiretoryMenuState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
    }));
  };

  // for initial update
  useEffect(() => {
    const { currentCommunity } = CommunityStateValue;
    if (currentCommunity) {
      setDiretoryMenuState((prev) => ({
        ...prev,
        selectedMenuItem: {
          displayText: `r/${currentCommunity.id}`,
          link: `/r/${currentCommunity.id}`,
          icon: FaReddit,
          iconColor: "blue.500",
          imageURL: currentCommunity.imageURL,
        },
      }));
    }
  }, [CommunityStateValue.currentCommunity]);

  return {
    diretoryMenuState,
    setDiretoryMenuState,
    toggleMenuOpen,
    onSelectMenuItem,
  };
}

import { IconType } from "react-icons/lib";
import { TiHome } from "react-icons/ti";
import { atom } from "recoil";

export type DiretoryMenuItem = {
  displayText: string;
  icon: IconType;
  link: string;
  iconColor: string;
  imageURL?: string;
};

interface DiretoryMenuState {
  isOpen: boolean;
  selectedMenuItem: DiretoryMenuItem;
}

export const defaultMenuItem: DiretoryMenuItem = {
  displayText: "Home",
  link: "/",
  icon: TiHome,
  iconColor: "black",
};

export const defaultMenuState: DiretoryMenuState = {
  isOpen: false,
  selectedMenuItem: defaultMenuItem,
};

export const diretoryMenuStateAtom = atom<DiretoryMenuState>({
  key: "diretoryMenuState",
  default: defaultMenuState,
});

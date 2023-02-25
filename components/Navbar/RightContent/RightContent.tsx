import { auth } from "@/firebase/clientApp";
import { Button, Flex } from "@chakra-ui/react";
import { signOut, User } from "firebase/auth";
import React from "react";
import AuthModal from "../../Modal/auth/AuthModal";
import AuthButton from "./AuthButton";
import Icons from "./Icons";
import UserMenu from "./UserMenu";

type Props = {
  user?: User | null;
};

export default function RightContent({ user }: Props) {
  return (
    <Flex justify="right">
      <AuthModal />
      <Flex justify="center" align="center">
        {user ? <Icons /> : <AuthButton />}
      </Flex>
      <UserMenu user={user} />
    </Flex>
  );
}

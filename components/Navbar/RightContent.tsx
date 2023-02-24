import { auth } from "@/firebase/clientApp";
import { Button, Flex } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import React from "react";
import AuthModal from "../Modal/auth/AuthModal";
import AuthButton from "./AuthButton";

type Props = {
  user: any;
};

export default function RightContent({ user }: Props) {
  return (
    <>
      <AuthModal />
      <Flex justify="center" align="center">
        {user ? (
          <Button onClick={() => signOut(auth)}>Logout</Button>
        ) : (
          <AuthButton />
        )}
      </Flex>
    </>
  );
}

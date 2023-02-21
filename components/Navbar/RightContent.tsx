import { Flex } from "@chakra-ui/react";
import React from "react";
import AuthButton from "./AuthButton";

type Props = {
  // user: any
};

export default function RightContent({}: Props) {
  return (
    <>
      {/* <AuthModal /> */}
      <Flex justify="center" align="center">
        <AuthButton />
      </Flex>
    </>
  );
}

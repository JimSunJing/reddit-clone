import { Flex } from "@chakra-ui/react";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function PageContent({ children }: Props) {
  return (
    <Flex justify="center" padding="16px 0px">
      <Flex width="95%" maxWidth="860px" justify="center">
        {/* Left */}
        <Flex
          width={{ base: "100%", md: "65%" }}
          mr={{ base: 0, md: 6 }}
          direction="column"
        >
          {children && children[0 as keyof typeof children]}
        </Flex>
        {/* Right */}
        <Flex
          display={{ base: "none", md: "flex" }}
          flexGrow={1}
          direction="column"
        >
          {children && children[1 as keyof typeof children]}
        </Flex>
      </Flex>
    </Flex>
  );
}

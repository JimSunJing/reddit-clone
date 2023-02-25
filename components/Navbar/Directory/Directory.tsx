import { ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, Icon, Menu, MenuButton, MenuList, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";

import { authModalState } from "@/atoms/AuthModalAtom";
import { useSetRecoilState } from "recoil";

import { TiHome } from "react-icons/ti";
import CreateCommunity from "./CreatCommunity";

type UserMenuProps = {
  user?: User | null;
};

export default function Directory({ user }: UserMenuProps) {
  const setAuthModalState = useSetRecoilState(authModalState);

  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        padding="0px 6px"
        borderRadius={4}
        _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
      >
        <Flex
          align="center"
          justify="space-between"
          maxWidth={{ base: "auto", lg: "200px" }}
        >
          <Flex align="center">
            <Icon as={TiHome} fontSize={24} mr={{ base: 1, lg: 2 }} />
            <Text
              display={{ base: "none", lg: "unset" }}
              fontWeight={600}
              fontSize="10pt"
            >
              Home
            </Text>
          </Flex>
          <Icon as={ChevronDownIcon} />
        </Flex>
      </MenuButton>
      <MenuList>
        <CreateCommunity />
      </MenuList>
    </Menu>
  );
}

import { CommunityStateAtom } from "@/atoms/communitiesAtom";
import CreateCommunityModal from "@/components/Modal/CreateCommunity/CreateCommunityModal";
import { Box, Divider, Flex, Icon, MenuItem, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaReddit } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import { useRecoilValue } from "recoil";
import MenuListItem from "./MenuListItem";

// type Props = {};

export default function CreateCommunity() {
  const [open, setOpen] = useState(false);
  const mySnippets = useRecoilValue(CommunityStateAtom).mySnippets;
  return (
    <>
      <CreateCommunityModal open={open} setClose={() => setOpen(false)} />
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MODERATING
        </Text>
        <MenuItem
          _hover={{ bg: "gray.100" }}
          fontSize="10pt"
          width="100%"
          onClick={() => setOpen(true)}
        >
          <Flex align="center">
            <Icon as={GrAdd} fontSize={20} mr={2} />
            Create Community
          </Flex>
        </MenuItem>
        {mySnippets
          .filter((snippet) => snippet.isModerator)
          .map((snippet) => (
            <MenuListItem
              key={snippet.communityId}
              displayText={snippet.communityId}
              link={`/r/${snippet.communityId}`}
              icon={FaReddit}
              iconColor="blue.500"
              imageURL={snippet.imageURL}
            />
          ))}
        <Divider />
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MY COMMUNITIES
        </Text>
        {mySnippets.map((snippet) => (
          <MenuListItem
            key={snippet.communityId}
            displayText={snippet.communityId}
            link={`/r/${snippet.communityId}`}
            icon={FaReddit}
            iconColor="blue.500"
            imageURL={snippet.imageURL}
          />
        ))}
        <Divider />
      </Box>
    </>
  );
}

import CreateCommunityModal from "@/components/Modal/CreateCommunity/CreateCommunityModal";
import { Flex, Icon, MenuItem } from "@chakra-ui/react";
import React, { useState } from "react";
import { GrAdd } from "react-icons/gr";

// type Props = {};

export default function CreateCommunity() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <CreateCommunityModal open={open} setClose={() => setOpen(false)} />
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
    </>
  );
}

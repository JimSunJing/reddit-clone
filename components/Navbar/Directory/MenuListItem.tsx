import useDiretory from "@/hooks/useDiretory";
import { Flex, Icon, MenuItem, Image } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons/lib";

type Props = {
  displayText: string;
  link: string;
  icon: IconType;
  iconColor: string;
  imageURL?: string;
};

export default function MenuListItem({
  displayText,
  link,
  icon,
  iconColor,
  imageURL,
}: Props) {
  const { onSelectMenuItem } = useDiretory();
  return (
    <MenuItem
      width="100%"
      fontSize="10pt"
      _hover={{ bg: "gray.100" }}
      onClick={() =>
        onSelectMenuItem({
          displayText,
          link,
          icon,
          iconColor,
          imageURL,
        })
      }
    >
      P
      <Flex align="center">
        {imageURL ? (
          <Image src={imageURL} borderRadius="full" boxSize="18px" mr={2} />
        ) : (
          <Icon as={icon} fontSize={20} mr={2} color={iconColor} />
        )}
        {displayText}
      </Flex>
    </MenuItem>
  );
}

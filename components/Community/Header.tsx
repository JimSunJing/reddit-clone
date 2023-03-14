import { Community } from "@/atoms/communitiesAtom";
import useCommunityData from "@/hooks/useCommunityHook";
import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import React from "react";
import { FaReddit } from "react-icons/fa";

type HeaderProps = {
  communityData: Community;
};

export default function Header({ communityData }: HeaderProps) {
  const { communityStateValue, joinOrLeaveCommunity, loading } =
    useCommunityData();
  console.log("communityStateAtom", communityStateValue);
  const isJoined = !!communityStateValue.mySnippets.find(
    (item) => item.communityId === communityData.id
  ); // get from user snippet

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bg="blue.500" />
      <Flex justify="center" bg="white" flexGrow={1}>
        <Flex width="95%" maxWidth="860px">
          {communityData.imageURL ? (
            <Image />
          ) : (
            <Icon
              as={FaReddit}
              fontSize={64}
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
              borderRadius="50%"
            />
          )}
          <Flex padding="10px 16px">
            <Flex direction="column" mr={6}>
              <Text fontWeight={800} fontSize="16pt">
                {communityData.id}
              </Text>
              <Text fontWeight={600} color="gray.400" fontSize="10pt">
                r/{communityData.id}
              </Text>
            </Flex>
            <Button
              pl={6}
              pr={6}
              height="30px"
              variant={isJoined ? "outline" : "solid"}
              onClick={() => joinOrLeaveCommunity(communityData, isJoined)}
              isLoading={loading}
            >
              {isJoined ? "Joined" : "Join"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

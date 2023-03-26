import { auth, firestore } from "@/firebase/clientApp";
import useDiretory from "@/hooks/useDiretory";
import {
  Box,
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Checkbox,
  Flex,
  Icon,
} from "@chakra-ui/react";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsFillPersonFill, BsFillEyeFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";

type Props = {
  open: boolean;
  handleClose: () => void;
};

export default function CreateCommunityModal({ open, handleClose }: Props) {
  const [user, userError] = useAuthState(auth);
  const router = useRouter();
  const [communityName, setCommunityName] = useState("");
  const [charsRemain, setCharsRemain] = useState(21);
  const [communityType, setCommunityType] = useState("public");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { toggleMenuOpen } = useDiretory();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // limit chars of name
    if (event.target.value.length > 21) return;

    setCommunityName(event.target.value);
    // update characters remain
    setCharsRemain(21 - event.target.value.length);
  };

  const communityTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommunityType(event.target.name);
  };

  const handleCreateCommunity = async () => {
    if (error) setError("");
    // check for name length and special characters
    const regex = /[^a-zA-Z0-9_]/g;
    if (regex.test(communityName) || communityName.length < 3) {
      setError(
        "Community name must be between 3-21 charcters, and can only contain letters, numbers and underscore"
      );
      return;
    }

    setLoading(true);

    try {
      // use firestore to create communities database

      // check if community is unique
      const communityRef = doc(firestore, "communities", communityName);

      await runTransaction(firestore, async (transaction) => {
        const communityDoc = await transaction.get(communityRef);
        if (communityDoc.exists()) {
          throw new Error(
            `Sorry, r/${communityName} already exist, use another one`
          );
        }

        // create community
        transaction.set(communityRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: communityType,
        });

        // create communitySnippets for user
        transaction.set(
          doc(firestore, `users/${user?.uid}/communitySnippets`, communityName),
          {
            communityId: communityName,
            isModerator: true,
          }
        );
      });

      handleClose();
      toggleMenuOpen();
      router.push(`r/${communityName}`);
    } catch (error: any) {
      console.log("handleCreateCommunity error", error);
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <>
      <Modal isOpen={open} onClose={handleClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a community</ModalHeader>
          <ModalCloseButton />
          <Box pl={4} pr={4}>
            <Divider />
            <ModalBody display="flex" flexDirection="column" padding="10px 0px">
              <Text fontWeight={700}>Name</Text>
              <Text fontSize="9pt" color="gray.500">
                Community names including capitalization cannot be changed
              </Text>
              <Text
                position="relative"
                color="gray.400"
                width="20px"
                top="28px"
                left="10px"
              >
                r/
              </Text>
              <Input
                pl="22px"
                position="relative"
                size="sm"
                value={communityName}
                onChange={handleChange}
              />
              <Text
                color={charsRemain === 0 ? "red" : "gray.400"}
                fontSize="9pt"
              >
                {charsRemain} Characters remaining
              </Text>

              <Text color="red" fontSize="9pt" pt={1}>
                {error}
              </Text>

              <Box mt={4} mb={4}>
                <Text fontWeight={700}>Community Type</Text>
                <Stack>
                  <Checkbox
                    name="public"
                    isChecked={communityType === "public"}
                    onChange={communityTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={BsFillPersonFill} color="gray.500" mr={1} />
                      <Text mr={1} fontSize="10pt">
                        Public
                      </Text>
                      <Text fontSize="8pt" color="gray.400" mt={1}>
                        Anyone can view, post, and comment to this community
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="restricted"
                    isChecked={communityType === "restricted"}
                    onChange={communityTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={BsFillEyeFill} color="gray.500" mr={1} />
                      <Text mr={1} fontSize="10pt">
                        Restricted
                      </Text>
                      <Text fontSize="8pt" color="gray.400" mt={1}>
                        Anyone can view this community, but only approved users
                        can post
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="private"
                    isChecked={communityType === "private"}
                    onChange={communityTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={HiLockClosed} color="gray.500" mr={1} />
                      <Text mr={1} fontSize="10pt">
                        Private
                      </Text>
                      <Text fontSize="8pt" color="gray.400" mt={1}>
                        Only approved users can view and submit to this
                        community
                      </Text>
                    </Flex>
                  </Checkbox>
                </Stack>
              </Box>
            </ModalBody>
          </Box>

          <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
            <Button
              height="30px"
              variant="outline"
              mr={3}
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              height="30px"
              onClick={handleCreateCommunity}
              isLoading={loading}
            >
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

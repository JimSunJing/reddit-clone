import { Button, Flex, Input, Stack, Textarea } from "@chakra-ui/react";
import React from "react";

type Props = {
  textInputs: {
    title: string;
    body: string;
  };
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleCreatePost: () => void;
  loading: boolean;
};

export default function TextInputs({
  textInputs,
  onChange,
  handleCreatePost,
  loading,
}: Props) {
  return (
    <Stack p={3} width="100%">
      <Input
        name="title"
        value={textInputs.title}
        onChange={onChange}
        fontSize="10pt"
        placeholder="Title"
        borderRadius={4}
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          borderColor: "black",
          bg: "white",
          border: "1px solid",
        }}
      />
      <Textarea
        name="body"
        value={textInputs.body}
        onChange={onChange}
        height="100px"
        fontSize="10pt"
        placeholder="Text(optional)"
        borderRadius={4}
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          borderColor: "black",
          bg: "white",
          border: "1px solid",
        }}
      />
      <Flex justify="flex-end">
        <Button
          height="34px"
          padding="0px 30px"
          onClick={handleCreatePost}
          isLoading={loading}
          disabled={!textInputs.title}
        >
          Post
        </Button>
      </Flex>
    </Stack>
  );
}

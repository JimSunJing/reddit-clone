import { Button, Flex, Image, Input, Stack } from "@chakra-ui/react";
import React, { useRef } from "react";

type Props = {
  selectedFile?: string;
  onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedFile: (value: string) => void;
  setSelectedTab: (value: string) => void;
};

export default function ImageUpload({
  selectedFile,
  onSelectImage,
  setSelectedFile,
  setSelectedTab,
}: Props) {
  const selectFileRef = useRef<HTMLInputElement>(null);
  return (
    <Flex direction="column" width="100%" justify="center" align="center">
      {selectedFile ? (
        <>
          <Image src={selectedFile} maxHeight="400px" maxWidth="400px" />
          <Stack direction="row" mt={4}>
            <Button height="28px" onClick={() => setSelectedTab("Post")}>
              Return to Post
            </Button>
            <Button
              height="28px"
              variant="outline"
              onClick={() => setSelectedFile("")}
            >
              Remove
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <Flex
            justify="center"
            align="center"
            width="100%"
            border="2px dash"
            borderRadius={4}
            borderColor="gray.200"
            p={20}
          >
            <Button
              height="28px"
              variant="outline"
              onClick={() => selectFileRef.current?.click()}
            >
              Upload
            </Button>

            <Input
              type="file"
              ref={selectFileRef}
              hidden
              onChange={onSelectImage}
            />
          </Flex>
        </>
      )}
    </Flex>
  );
}

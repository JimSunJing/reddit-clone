import React, { useState } from "react";

export default function useSelectFile() {
  const [selectedFile, setSelectedFile] = useState<string>();

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();

    if (event.target.files?.[0]) {
      fileReader.readAsDataURL(event.target.files[0]);
    }

    fileReader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        // only for selecting one pic
        setSelectedFile(readerEvent.target.result as string);
      }
    };
  };

  return { selectedFile, setSelectedFile, onSelectFile };
}

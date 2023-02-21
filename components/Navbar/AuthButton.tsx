import { Button } from "@chakra-ui/react";
import React from "react";

export default function AuthButton() {
  return (
    <>
      <Button
        variant="outline"
        height="28px"
        width={{ base: "70px", md: "110px" }}
        display={{ base: "none", sm: "flex" }}
        mr={2}
      >
        Login
      </Button>
      <Button
        height="28px"
        width={{ base: "70px", md: "110px" }}
        display={{ base: "none", sm: "flex" }}
        mr={2}
      >
        Logout
      </Button>
    </>
  );
}

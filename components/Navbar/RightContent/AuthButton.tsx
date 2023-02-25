import { authModalState } from "@/atoms/AuthModalAtom";
import { Button } from "@chakra-ui/react";
import React from "react";
import { useSetRecoilState } from "recoil";

export default function AuthButton() {
  const setAuthModalState = useSetRecoilState(authModalState);
  return (
    <>
      <Button
        variant="outline"
        height="28px"
        width={{ base: "70px", md: "110px" }}
        display={{ base: "none", sm: "flex" }}
        mr={2}
        onClick={() => setAuthModalState({ open: true, view: "login" })}
      >
        Login
      </Button>
      <Button
        height="28px"
        width={{ base: "70px", md: "110px" }}
        display={{ base: "none", sm: "flex" }}
        mr={2}
        onClick={() => setAuthModalState({ open: true, view: "signup" })}
      >
        SignUp
      </Button>
    </>
  );
}

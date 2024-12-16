//client\src\hooks\useDialogState.ts
import { useState } from "react";

const useDialogState = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return {
    isOpen,
    setIsOpen
  };
};

export default useDialogState;

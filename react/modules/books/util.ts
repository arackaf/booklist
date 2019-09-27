import { useState } from "react";

export const useCodeSplitModal = (initialOpenData = false): any => {
  const [openState, setModalState] = useState(initialOpenData);
  return [openState, (val = true) => setModalState(val), () => setModalState(false)];
};
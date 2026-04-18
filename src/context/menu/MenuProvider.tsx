"use client";

import { ReactNode, useState } from "react";
import MenuContext from "./MenuContext";

const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MenuContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </MenuContext.Provider>
  );
};

export default MenuProvider;

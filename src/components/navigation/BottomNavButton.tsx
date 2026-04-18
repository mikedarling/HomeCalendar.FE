'use client';

import { FC } from "react";
import { useMenu } from "@/context/menu/MenuContext";
import Hamburger from "../media/Hambuger";

const BottomNavButton: FC = () => {
  const { setIsOpen } = useMenu();

  return (
    <button
      onClick={() => setIsOpen(true)}
      aria-label="Open Menu"
      className="fixed bottom-6 left-6 z-40 bg-sky-600 hover:bg-sky-700 text-white p-3 rounded-full shadow-lg transition flex items-center justify-center"
    >
      <Hamburger />
    </button>
  );
};

export default BottomNavButton;

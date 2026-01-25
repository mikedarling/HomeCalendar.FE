'use client';

import StyleMap from "@/models/data/theme/StyleMap";
import Hamburger from "../media/Hambuger";
import Button from "../navigation/Button";
import { FC, PropsWithChildren, ReactNode } from "react";

const Header : FC<PropsWithChildren<{ header: ReactNode }>> = ({ header }) => {
    const hamburgerStyles: StyleMap[] = [
    {
      key: "p",
      styles: [
        {name: "default", value: "2"}
      ]
    },
    { key: "bg",
      styles: [
        {name: "default", value: "bg-sky-600" },
        {name: "hover", value: "hover:bg-sky-700" }
      ]
    }
  ];

  return (
      <header className="sticky top-0 z-50 bg-sky-600 text-white shadow-md">
        <div className="flex items-center justify-between px-6 py-4 text-center">
          <Button onClick={() => { console.log("Menu opened") }} ariaLabel="Open Menu" classNames={hamburgerStyles}>
            <Hamburger />
          </Button>
          <h1 className="font-serif text-2xl md:text-3xl font-medium tracking-tight text-primary-foreground drop-shadow-sm">
            {header}
          </h1>
          <div className="w-10" />
        </div>
      </header>
  )
}

export default Header;
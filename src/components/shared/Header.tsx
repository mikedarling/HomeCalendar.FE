'use client';

import { FC, PropsWithChildren, ReactNode } from "react";

const Header : FC<PropsWithChildren<{ header: ReactNode }>> = ({ header }) => {
  return (
      <header className="sticky top-0 z-50 bg-sky-600 text-white shadow-md">
        <div className="flex items-center justify-center px-6 py-4 text-center">
          <h1 className="font-serif text-2xl md:text-3xl font-medium tracking-tight text-primary-foreground drop-shadow-sm">
            {header}
          </h1>
        </div>
      </header>
  )
}

export default Header;
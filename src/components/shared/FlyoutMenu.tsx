"use client";

import React, { FC, PropsWithChildren, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/oauth/AuthContext";
import AuthButton from "@/components/oauth/AuthButton";
import { useMenu } from "@/context/menu/MenuContext";

const FlyoutMenu: FC<PropsWithChildren> = ({ children }) => {
  const { isOpen, setIsOpen } = useMenu();
  const pathname = usePathname();

  const { loggedIn, logout } = useAuth();

  const links = [
    { href: "/", label: "Calendar" },
    { href: "/chores", label: "Chores" },
    { href: "/preferences", label: "Preferences" }
  ];

  // Close menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <>
      {/* Flyout menu */}
      <div
        className="fixed top-0 flex flex-col bg-gray-700 h-screen p-4 w-[260px] z-[2100]"
        style={{
          left: isOpen ? 0 : -260,
          boxShadow: isOpen ? "2px 0 12px rgba(0,0,0,0.12)" : undefined,
          transition: "left 0.3s cubic-bezier(.4,0,.2,1)"
        }}
      >
        <div className="flex py-2 justify-end">
          <button aria-label="Close menu" onClick={() => setIsOpen(false)} className="bg-none border-none text-2xl text-white cursor-pointer">&times;</button>
        </div>  
        <div className="pt-2 pb-4 border-b border-gray-500">
          { !loggedIn
              ? (
                <AuthButton />
              ) : (
                <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition">Logout</button>
              )
          }
        </div>
        <div className="flex-grow">
            {children}
        </div>
        <nav className="flex flex-col flex-grow justify-end gap-3 py-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-white hover:text-sky-300 font-medium py-2">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      {/* Overlay */}
      { isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed top-0 left-0 w-screen h-screen bg-gray-800 z-[2005]"
          style={{ background: "rgba(0,0,0,0.18)" }}
        ></div>
      )}
    </>
  );
};

export default FlyoutMenu;
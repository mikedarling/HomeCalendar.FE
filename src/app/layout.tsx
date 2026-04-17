import { Metadata } from "next";
import { ReactNode } from "react";

import "./globals.css";
import AuthProvider from "@/context/oauth/AuthProvider";
import MenuProvider from "@/context/menu/MenuProvider";
import ScreensaverOverlay from "../components/shared/ScreensaverOverlay";
import FlyoutMenu from "@/components/shared/FlyoutMenu";
import BottomNavButton from "@/components/navigation/BottomNavButton";
import CalendarProvider from "@/context/calendar/CalendarProvider";
import ChoresProvider from "@/context/chores/ChoresProvider";
import Header from "@/components/shared/Header";

export const metadata: Metadata = {
  title: "Home Calendar",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/ico.svg",
  }
};

export default function RootLayout({ children, header, flyout  }: { children: ReactNode, header: ReactNode, flyout: ReactNode }) {
  return (
    <html lang="en">
      <body className={"antialiased"}>
        <AuthProvider>
          <MenuProvider>
            <ChoresProvider>
              <CalendarProvider>
                <Header header={header} />
                <main>
                  {children}
                  <ScreensaverOverlay />
                </main>
                <FlyoutMenu>{flyout}</FlyoutMenu>
                <BottomNavButton />
              </CalendarProvider>
            </ChoresProvider>
          </MenuProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

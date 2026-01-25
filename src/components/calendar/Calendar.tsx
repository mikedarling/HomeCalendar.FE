"use client";

import React, { useState, FC } from "react";
import CalendarMonth from "@/components/calendar/Month";
import CalendarWeek from "@/components/calendar/Week";
import AuthProvider from "@/context/oauth/AuthProivder";
import CalendarProvider from "@/context/calendar/CalendarProvider";

const Calendar: FC = () => {
  const [view, setView] = useState<"month" | "week">("week");

  return (
    <AuthProvider>
      <CalendarProvider>
        {view === "month" ? (
          <CalendarMonth />
        ) : (
          <CalendarWeek />
        )}
      </CalendarProvider>
  </AuthProvider>
  );
};

export default Calendar;
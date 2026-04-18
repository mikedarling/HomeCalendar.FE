"use client";

import React, { FC } from "react";
import Month from "@/components/calendar/Month";
import Week from "@/components/calendar/Week";
import AuthProvider from "@/context/oauth/AuthProvider";
import CalendarProvider from "@/context/calendar/CalendarProvider";
import { useCalendar } from "@/context/calendar/CalendarContext";

const CalendarContent: FC = () => {
  const calendarContext = useCalendar();

  return calendarContext.viewMode === "month" ? (
    <Month />
  ) : (
    <Week />
  );
};

const Calendar: FC = () => {
  return (
    <AuthProvider>
      <CalendarProvider>
        <CalendarContent />
      </CalendarProvider>
    </AuthProvider>
  );
};

export default Calendar;
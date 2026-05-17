import { FC, useEffect, useState, useMemo } from "react";

import { useCalendar } from "@/context/calendar/CalendarContext";


import EventBox from "@/components/calendar/EventBox";
import ControlBar from "@/components/calendar/ControlBar";

import dateUtils from "@/utils/dateUtils";
import themeUtils from "@/utils/themeUtils";


const Week: FC = () => {
  const { selectedCalendars, viewedDate, setViewedDate } = useCalendar();

  // Only show 8:00 am (8) through 8:00 pm (20)
  const START_HOUR = 8;
  const END_HOUR = 20;
  const FIVE_MINUTE_BLOCKS = (END_HOUR - START_HOUR) * (60/5) + 1; // inclusive of 8:00pm

  function getStartOfWeek(date: Date) {
    const day = date.getDay(); // 0 (Sun) - 6 (Sat)
    const diff = date.getDate() - day;
    return new Date(date.getFullYear(), date.getMonth(), diff);
  }

  // Helper to format time in 12-hour format with am/pm
  function formatTime(hour: number, minute: number) {
    let displayHour = hour % 12;
    if (displayHour === 0) {
      displayHour = 12;
    }
    return `${displayHour}:${minute.toString().padStart(2, "0")}`;
  }

  const [events, setEvents] = useState<any[]>([]);
  const startOfWeek = useMemo(() => getStartOfWeek(viewedDate), [viewedDate]);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  // Create five-minute slots from 8:00 am to 8:00 pm
  const timeSlots = Array.from({ length: FIVE_MINUTE_BLOCKS }, (_, i) => {
    const hour = START_HOUR + Math.floor(i / 12);
    const minute = (i % 12) * 5;
    return { hour, minute, label: formatTime(hour, minute) };
  });

  // Fetch events for the displayed week and selected calendars
  useEffect(() => {
    if (!selectedCalendars || selectedCalendars.length === 0) {
      setEvents([]);
      return;
    }
    const start = new Date(startOfWeek);
    const end = new Date(startOfWeek);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    const params = new URLSearchParams({
      calendarIds: selectedCalendars.join(","),
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
    });
    const fetchEvents = async () => {
      const res = await fetch(`/api/calendar/events?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      } else {
        setEvents([]);
      }
    };
    fetchEvents();
  }, [selectedCalendars, startOfWeek]);

  // Helper to get events for a given day
  function getEventsForDay(day: Date) {
    return events.filter((event) => {
      const startDate = new Date(event.start.dateTime || event.start.date);
      return (
        startDate.getFullYear() === day.getFullYear() &&
        startDate.getMonth() === day.getMonth() &&
        startDate.getDate() === day.getDate()
      );
    });
  }

  const weekdayHeader = (date: Date) => {
    return (
      <>
        <div>{date.toLocaleDateString(undefined, { weekday: "short" })}</div>
        <div>{date.toLocaleDateString(undefined, { day: "numeric" })}</div>
      </>
    )
  }

  return (
    <>
      <ControlBar />
      <div className="flex ml-[70px] mb-0">
        {days.map((date, dateIdx) => (
          <div key={dateIdx} className={ themeUtils.WEEKDAY_HEADER + " flex-1 border-r border-white" } >
            {weekdayHeader(date)}
          </div>
        ))}
      </div>
      {/* All-day event band */}
      <div className="flex border-x border-t border-gray-300">
        <div className="w-[70px] flex-shrink-0 border-r border-gray-200 bg-gray-50 h-18" />
        {days.map((date, dateIdx) => {
          const allDayEvents = events.filter(e => {
            if (!!e.start?.dateTime || !e.start?.date) return false;
            const start = new Date(e.start.date);
            const end = new Date(e.end.date); // exclusive per Google API
            const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            return start <= day && day < end;
          });
          return (
            <div
              key={dateIdx}
              className={"h-18 flex-1 relative overflow-hidden" + (dateIdx < 6 ? " border-r border-gray-200" : "")}
            >
              {allDayEvents.map((event) => (
                <EventBox
                  key={event.id}
                  event={event}
                  style={{ height: "72px" }}
                  classes={["absolute", "inset-x-0", "top-0"]}
                  overlappingEvents={allDayEvents.length > 1 ? allDayEvents : null}
                  hideTime
                />
              ))}
            </div>
          );
        })}
      </div>
      {/* Time grid and day columns */}
      <div className="flex border border-gray-300 min-h-[600px]">
        {/* Time column */}
        <div className="w-[70px] border-r border-gray-200 bg-gray-50 flex flex-col">
          {timeSlots
            .filter(slot => slot.minute === 0 || slot.minute === 30)
            .map((slot, slotIdx) => (
              <div data-hour={slot.hour} data-minute={slot.minute}
                key={slotIdx}
                className="h-9 text-sm text-gray-500 flex items-center justify-center text-center pr-0 border-b border-gray-200"
              >
                {slot.label}
              </div>
            ))}
        </div>
        {/* Days columns */}
        {days.map((date, dateIdx) => {
          const events = getEventsForDay(date);
          // For each slot, find events that start in this slot
          return (
            <div
              key={dateIdx}
              className={
                "flex-1 flex flex-col relative " +
                (dateIdx < 6 ? "border-r border-gray-200" : "")
              }
            >
              {timeSlots.map((slot, slotIdx) => {
                // Find timed events (exclude all-day) that start in this slot
                const slotEvents = events.filter((event) => {
                  if (!event.start?.dateTime) return false;
                  const start = new Date(event.start.dateTime);
                  return (
                    start.getHours() === slot.hour &&
                    start.getMinutes() === slot.minute
                  );
                });
                return (
                  <div
                    key={slotIdx}
                    className={
                      "h-1.5 cursor-pointer relative overflow-visible" + ((slotIdx + 1) % 6 === 0 ? " border-b border-gray-200" : "")
                    }
                    onClick={() => {
                      const slotDate = new Date(date);
                      slotDate.setHours(slot.hour, slot.minute, 0, 0);
                      setViewedDate(slotDate);
                    }}
                  >
                    {slotEvents.map((event) => {
                      // Calculate how many slots this event should span (precise, including partial slots)
                      const eventDuration = dateUtils.getEventDuration(event);
                      const height = (eventDuration / 5) * 6; // 6px per 5-minute slot
                      const evStyle = {
                        height: `${height}px`
                      };
                      const evClasses = ["absolute", "z-10", "mt-[2px]"];
                      const overlaps = dateUtils.getOverlappingEvents(event, events);
                      return (
                        <EventBox
                          key={event.id}
                          event={event}
                          style={evStyle}
                          classes={evClasses}
                          overlappingEvents={overlaps}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Week;
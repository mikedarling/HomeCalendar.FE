import { FC, useEffect, useState } from 'react';

import MonthIcon from '@/components/media/MonthIcon';
import WeekIcon from '@/components/media/WeekIcon';
import LeftChevron from '@/components/media/LeftChevron';
import RightChevron from '@/components/media/RightChevron';
import Button from '@/components/navigation/Button';

import { useCalendar } from '@/context/calendar/CalendarContext';
import dateUtils from '@/utils/dateUtils';

const ControlBar: FC = () => {
  const calendarContext = useCalendar();

  const [controlBarTitle, setControlBarTitle] = useState("");

  const startOfWeek = dateUtils.getStartOfWeek(calendarContext.selectedDate);

  useEffect(() => {
    if (calendarContext.viewMode == "week") {
      setControlBarTitle(`Week of ${startOfWeek.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`);
    } else {
      setControlBarTitle(calendarContext.selectedDate.toLocaleDateString(undefined, { month: "long", year: "numeric" }));
    }
  }, [calendarContext.selectedDate, calendarContext.viewMode, startOfWeek]);
  
  // Handlers for Prev/Next week
  const handlePrevWeek = () => {
    const prev = new Date(calendarContext.viewedDate);
    prev.setDate(prev.getDate() - 7);
    calendarContext.setViewedDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(startOfWeek);
    next.setDate(next.getDate() + 7);
    calendarContext.setViewedDate(next);
  };



  return (
    <div className="flex items-center justify-between px-6 py-2">
      <div className="flex items-center gap-2">
        <Button onClick={() => calendarContext.setViewMode("month")} customClasses={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer size-9 h-9 w-9 shadow-xs ${calendarContext.viewMode === "month" ? "border bg-background hover:text-accent-foreground border-primary/30 text-primary hover:bg-primary/10" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
          <WeekIcon height={16} width={16} />
          <span className="sr-only">Month view</span>
        </Button>
        <Button onClick={() => calendarContext.setViewMode("week")} customClasses={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer size-9 h-9 w-9 shadow-xs ${calendarContext.viewMode === "week" ? "border bg-background hover:text-accent-foreground border-primary/30 text-primary hover:bg-primary/10" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
          <MonthIcon height={16} width={16} />
          <span className="sr-only">Week view</span>
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button onClick={handlePrevWeek} customClasses="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer hover:text-accent-foreground size-9 h-9 w-9 rounded-full text-accent hover:bg-accent/10">
          <LeftChevron />
          <span className="sr-only">Previous week</span>
        </Button>
        <span className="text-base font-semibold text-primary min-w-[180px] text-center">{controlBarTitle}</span>
        <Button onClick={handleNextWeek} customClasses="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer hover:text-accent-foreground size-9 h-9 w-9 rounded-full text-accent hover:bg-accent/10">
          <RightChevron />
          <span className="sr-only">Next week</span>
        </Button>
      </div>
      <div className="w-[88px]"></div>
    </div>
  )
};

export default ControlBar;
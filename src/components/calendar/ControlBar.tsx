import { FC, useState } from 'react';
import MonthIcon from '../media/MonthIcon';
import Button from '../navigation/Button';
import StyleMap from '@/models/data/theme/StyleMap';
import WeekIcon from '../media/WeekIcon';
import LeftChevron from '../media/LeftChevron';
import RightChevron from '../media/RightChevron';

const Calendar: FC = () => {
  const [view, setView] = useState<"month" | "week">("week");

  const viewButtonClasses: StyleMap[] = [
    { key: "p",
      styles: [ {name: "default", value: "1"}]
    },
    { key: "w",
      styles: [ {name: "default", value: "12"}]
    },
  
  ];

  return (
    <div className="flex items-center justify-between px-6 py-2">
      <div className="flex items-center gap-2">
        <button data-slot="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer border bg-background shadow-xs hover:text-accent-foreground size-9 h-9 w-9 border-primary/30 text-primary hover:bg-primary/10">
          <MonthIcon height={16} width={16} />
          <span className="sr-only">Month view</span>
        </button>
        <button data-slot="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer text-primary-foreground shadow-xs size-9 h-9 w-9 bg-primary hover:bg-primary/90">
          <WeekIcon height={16} width={16} />
          <span className="sr-only">Week view</span>
        </button>
      </div>
      <div className="flex items-center gap-4">
        <button data-slot="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer hover:text-accent-foreground size-9 h-9 w-9 rounded-full text-accent hover:bg-accent/10">
          <LeftChevron />
          <span className="sr-only">Previous week</span>
        </button>
        <span className="text-base font-semibold text-primary min-w-[180px] text-center">Week of Jan 18, 2026</span>
        <button data-slot="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer hover:text-accent-foreground size-9 h-9 w-9 rounded-full text-accent hover:bg-accent/10">
          <RightChevron />
          <span className="sr-only">Next week</span>
        </button>
      </div>
      <div className="w-[88px]"></div>
    </div>
  )
};    

/* <div className="flex items-center gap-4">
  <button data-slot="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer hover:text-accent-foreground size-9 h-9 w-9 rounded-full text-accent hover:bg-accent/10">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left h-5 w-5">
      <path d="m15 18-6-6 6-6"></path>
    </svg>
    <span class="sr-only">Previous week</span>
  </button>
  <span class="text-base font-semibold text-primary min-w-[180px] text-center">Week of <!-- -->Jan 18, 2026</span>
  <button data-slot="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer hover:text-accent-foreground size-9 h-9 w-9 rounded-full text-accent hover:bg-accent/10">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right h-5 w-5">
      <path d="m9 18 6-6-6-6"></path>
    </svg>
    <span class="sr-only">Next week</span>
  </button>
</div>
<div class="w-[88px]"></div>
</div> */

export default Calendar;
export default interface CalendarContextType {
  selectedCalendars: string[];
  setSelectedCalendars: (ids: string[]) => void;
  
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  
  viewMode: "month" | "week";
  setViewMode: (mode: "month" | "week") => void;
  
  viewedDate: Date;
  setViewedDate: (date: Date) => void;

  
}
import IconProps from "@/models/props/component/media/IconProps";

const WeekIcon = ({ height, width }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days h-4 w-4">
      <path d="M8 2v4"></path>
      <path d="M16 2v4"></path>
      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
      <path d="M3 10h18"></path>
      <path d="M8 14h.01"></path>
      <path d="M12 14h.01"></path>
      <path d="M16 14h.01"></path>
      <path d="M8 18h.01"></path>
      <path d="M12 18h.01"></path>
      <path d="M16 18h.01"></path>
    </svg>
  );
  // return (
  //   <svg
  //     width={width}
  //     height={height}
  //     viewBox="0 0 24 24"
  //     fill="none"
  //     xmlns="http://www.w3.org/2000/svg"
  //     role="img"
  //     aria-label="Calendar with number 7"
  //   >
  //     {/* <!-- Calendar outline --> */}
  //     <rect x="3" y="4" width="18" height="18" rx="1" stroke="currentColor" strokeWidth="2" />
  //       {/* <!-- Binding rings --> */}
  //       <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  //       {/* <!-- Header separator --> */}
  //       <path d="M3 9h18" stroke="currentColor" strokeWidth="2" />
  //       {/* <!-- Day number --> */}
  //       <text
  //         x="12"
  //         y="15.5"
  //         textAnchor="middle"
  //         dominantBaseline="middle"
  //         fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
  //         fontSize="11"
  //         fontWeight="700"
  //         fill="currentColor"
  //       >7</text>
  //   </svg> 
  // )
}

export default WeekIcon;
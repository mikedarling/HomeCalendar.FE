interface ControlBarProps {
  startOfWeek: Date;
  setViewCallback: (mode: "month" | "week") => void;
}

export default ControlBarProps;
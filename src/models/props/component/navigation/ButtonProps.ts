import StyleMap from "@/models/data/theme/StyleMap";

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  classNames?: StyleMap[];
  customClasses?: string;
}

export default ButtonProps;
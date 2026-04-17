'use client';

import { FC, PropsWithChildren } from "react";
import ButtonProps from "@/models/props/component/navigation/ButtonProps";
import themeUtils from "@/utils/themeUtils";

const Button: FC<PropsWithChildren<ButtonProps>> = ({ children, onClick, classNames, ariaLabel, disabled, customClasses }) => {
  const buttonClasses = customClasses || themeUtils.compileButtonStyles(classNames || [], []);

  return (
    !ariaLabel
    ? (
        <button onClick={onClick} className={buttonClasses}  disabled={disabled}>
          {children}
        </button>
    )
    : (
        <button onClick={onClick} className={buttonClasses} aria-label={ariaLabel} disabled={disabled}>
          {children}
        </button>
    )
  );
};

export default Button;

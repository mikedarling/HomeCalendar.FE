"use client";

import React, { FC } from "react";

interface OnScreenKeyboardProps {
  onInput: (text: string) => void;
  language?: "en";
}

const OnScreenKeyboard: FC<OnScreenKeyboardProps> = ({ onInput, language = "en" }) => {
  const [shift, setShift] = React.useState(false);
  const [capsLock, setCapsLock] = React.useState(false);

  const rows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  const handleKeyPress = (char: string) => {
    const finalChar = shift || capsLock ? char.toUpperCase() : char.toLowerCase();
    onInput(finalChar);
    if (shift) setShift(false);
  };

  const handleSpace = () => {
    onInput(" ");
    if (shift) setShift(false);
  };

  const handleBackspace = () => {
    onInput("\b");
    if (shift) setShift(false);
  };

  const handleCapsLock = () => {
    setCapsLock(!capsLock);
  };

  const handleShift = () => {
    setShift(!shift);
  };

  return (
    <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
      {/* Row 1: Numbers */}
      <div className="flex gap-1.5 mb-1.5">
        {rows[0].map((key) => (
          <button
            key={key}
            onClick={() => handleKeyPress(key)}
            className="flex-1 min-h-[40px] bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded transition active:bg-gray-500"
          >
            {key}
          </button>
        ))}
        <button
          onClick={handleBackspace}
          className="px-3 min-h-[40px] bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition active:bg-red-500"
        >
          ⌫
        </button>
      </div>

      {/* Row 2: QWERTY */}
      <div className="flex gap-1.5 mb-1.5">
        {rows[1].map((key) => (
          <button
            key={key}
            onClick={() => handleKeyPress(key)}
            className={`flex-1 min-h-[40px] text-white text-sm font-medium rounded transition active:bg-blue-500 ${
              capsLock || shift ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {capsLock || shift ? key.toUpperCase() : key.toLowerCase()}
          </button>
        ))}
      </div>

      {/* Row 3: ASDF */}
      <div className="flex gap-1.5 mb-1.5">
        {rows[2].map((key) => (
          <button
            key={key}
            onClick={() => handleKeyPress(key)}
            className={`flex-1 min-h-[40px] text-white text-sm font-medium rounded transition active:bg-blue-500 ${
              capsLock || shift ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {capsLock || shift ? key.toUpperCase() : key.toLowerCase()}
          </button>
        ))}
      </div>

      {/* Row 4: ZXCV + Space */}
      <div className="flex gap-1.5">
        <button
          onClick={handleCapsLock}
          className={`px-2 min-h-[40px] text-white text-sm font-medium rounded transition active:bg-yellow-500 ${
            capsLock ? "bg-yellow-600 hover:bg-yellow-700" : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          ⇧
        </button>
        {rows[3].map((key) => (
          <button
            key={key}
            onClick={() => handleKeyPress(key)}
            className={`flex-1 min-h-[40px] text-white text-sm font-medium rounded transition active:bg-blue-500 ${
              capsLock || shift ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {capsLock || shift ? key.toUpperCase() : key.toLowerCase()}
          </button>
        ))}
        <button
          onClick={handleShift}
          className={`px-2 min-h-[40px] text-white text-sm font-medium rounded transition active:bg-yellow-500 ${
            shift ? "bg-yellow-600 hover:bg-yellow-700" : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Shift
        </button>
      </div>

      {/* Space bar */}
      <div className="flex gap-1.5 mt-1.5">
        <button
          onClick={handleSpace}
          className="flex-1 min-h-[40px] bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded transition active:bg-gray-500"
        >
          Space
        </button>
      </div>
    </div>
  );
};

export default OnScreenKeyboard;

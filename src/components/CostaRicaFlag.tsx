import React from "react";

interface Props {
  width?: number;
  height?: number;
  className?: string;
}

export default function CostaRicaFlag({ width = 20, height = 12, className = "" }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 5 3"
      aria-label="Costa Rica"
      role="img"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <rect width="5" height="3" fill="#002B7F" />
      <rect y="0.5" width="5" height="2" fill="#FFFFFF" />
      <rect y="1" width="5" height="1" fill="#CE1126" />
    </svg>
  );
}

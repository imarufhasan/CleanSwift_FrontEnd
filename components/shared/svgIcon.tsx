import React from "react";
import { SvgProps } from "react-native-svg"; // Import types from react-native-svg

interface SvgIconProps {
  SvgComponent: React.FC<SvgProps>; // The passed SVG component
  width?: number; // Optional width for resizing
  height?: number; // Optional height for resizing
}

const SvgIcon: React.FC<SvgIconProps> = ({
  SvgComponent,
  width = 100,
  height = 100,
}) => {
  return <SvgComponent width={width} height={height} />;
};

export default SvgIcon;

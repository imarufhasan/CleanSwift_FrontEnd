import React from "react";
import { SvgProps } from "react-native-svg";

interface SvgIconProps {
  SvgComponent: React.FC<SvgProps>;
  width?: number; 
  height?: number;
}

const SvgIcon: React.FC<SvgIconProps> = ({
  SvgComponent,
  width = 80,
  height = 80,
}) => {
  return <SvgComponent width={width} height={height} />;
};

export default SvgIcon;

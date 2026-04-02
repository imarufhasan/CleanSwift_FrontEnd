import { View, Text } from "react-native";
import React from "react";
import { GeneralText } from "../../../components/shared/GeneralText";
import SvgIcon from "../../../components/shared/svgIcon";
import DeriverLicenseIcon from "../../../assets/images/auth/DriverLicense.svg";
import UniversalFilePicker from "../../../components/shared/UniversalFilePicker";
import BaseContainer from "../../../components/shared/BaseContainer";
const DriverLicense = () => {
  return (
    <BaseContainer backgroundColor="#E6F6FF" padding={0} margin={0}>
      <View className="flex-1 items-center ">
        <SvgIcon SvgComponent={DeriverLicenseIcon} />
      </View>
      <GeneralText
        title="Driver's License"
        description="Upload a clear photo of your driver's license"
      />
      <UniversalFilePicker />
    </BaseContainer>
  );
};

export default DriverLicense;

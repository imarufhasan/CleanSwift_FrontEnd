import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { COUNTRY_CODES } from "../../constants/PhoneNumberDatabase";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
interface InputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  country?: string;
  setCountry?: (country: string) => void;
  setCountryCode?: (countryCode: string) => void;
  setCountryName?: (countryName: string) => void;
}

export const MobileNumberInput: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  country,
  setCountry,
  onChangeText,
  setCountryCode,
  setCountryName,
}) => {
  const [selectedCode, setSelectedCode] = useState(COUNTRY_CODES[227]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    if (!country) return;

    console.log("already add country: ", country);
    
    const match = COUNTRY_CODES.find((c) => c.iso === country);
    if (match) {
      setSelectedCode(match);
      setCountryCode?.(match.code);
    }
  }, [country]);

  const filteredCountries = COUNTRY_CODES.filter(
    (item) =>
      item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.includes(searchQuery),
  );

  const handleSelectCode = (item: (typeof COUNTRY_CODES)[0]) => {
    console.log("item countryyyyyyyyy : ", item);
    
    setCountry?.(item.iso);
    setSelectedCode(item);
    setModalVisible(false);
    setSearchQuery("");
    setCountryCode?.(item.code);
    setCountryName?.(item.country);
  };

  return (
    <View className="mb-5 w-full h-[55px] ">
      <View className="flex-1">
        <Text className="text-[#1a1c1e] text-base font-bold mb-1 ml-1">
          {label}
        </Text>
        <View
          style={{
            backgroundColor: "#eaf8ff",
            borderColor: "#a2dfff",
          }}
          className="border rounded-xl px-4 py-2 flex-row items-center"
        >
          {/* Country Code Selector */}
          <TouchableOpacity
            // onPress={() => {
            //   console.log("country code");
            //   setModalVisible(true);
            // }}
            className="flex-row items-center mr-2 pr-2 border-r border-[#a2dfff]"
          >
            <Text className="text-lg mr-1">{selectedCode?.flag}</Text>
            <Text className="text-[#1a1c1e] text-base font-medium">
              {selectedCode?.code}
            </Text>
            <Feather name="chevron-down" size={22} color={"gray"} />
          </TouchableOpacity>

          {/* Phone Number Input */}
          <TextInput
            placeholder={placeholder}
            placeholderTextColor="#7d848d"
            value={value}
            onChangeText={onChangeText}
            keyboardType="phone-pad"
            autoCapitalize="none"
            className="text-[#1a1c1e] text-base flex-1 w-full"
            selectionColor={"#1a1c1e"}
          />
        </View>
      </View>

      {/* Country Code Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl h-[80%]">
            <View className="p-4 border-b border-[#e5e7eb]">
              <Text className="text-[#1a1c1e] text-lg font-bold text-center mb-3">
                Select Country Code
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSearchQuery("");
                }}
                className="absolute right-4 top-4"
              >
                <Text className="text-[#7d848d] text-2xl">×</Text>
              </TouchableOpacity>

              <TextInput
                placeholder="Search country..."
                placeholderTextColor="#7d848d"
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="bg-[#f3f4f6] rounded-xl px-4 py-3 text-[#1a1c1e] text-base"
              />
            </View>

            <FlatList
              data={filteredCountries}
              keyExtractor={(item, index) => `${item.code}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectCode(item)}
                  className={`p-4 border-b border-[#f3f4f6] flex-row items-center ${
                    selectedCode?.code === item?.code ? "bg-[#eaf8ff]" : ""
                  }`}
                >
                  <Text className="text-2xl mr-3">{item.flag}</Text>
                  <View className="flex-1">
                    <Text className="text-[#1a1c1e] text-base font-medium">
                      {item.country}
                    </Text>
                  </View>
                  <Text className="text-[#7d848d] text-base">{item.code}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View className="p-8 items-center">
                  <Text className="text-[#7d848d] text-base">
                    No countries found
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

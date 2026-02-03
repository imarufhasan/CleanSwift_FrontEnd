import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { COUNTRY_CODES } from "@/constants/PhoneNumberDatabase";
interface InputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

export const MobileNumberInput: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
}) => {
  const [selectedCode, setSelectedCode] = useState(COUNTRY_CODES[17]); // Bangladesh default
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries = COUNTRY_CODES.filter(
    (item) =>
      item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.includes(searchQuery),
  );

  const handleSelectCode = (item: (typeof COUNTRY_CODES)[0]) => {
    setSelectedCode(item);
    setModalVisible(false);
    setSearchQuery("");
  };

  return (
    <View className="mb-5 w-full">
      <Text className="text-[#1a1c1e] text-base font-bold mb-2 ml-1">
        {label}
      </Text>
      <View className="bg-[#eaf8ff] border border-[#a2dfff] rounded-xl px-4 py-4 flex-row items-center">
        {/* Country Code Selector */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="flex-row items-center mr-2 pr-2 border-r border-[#a2dfff]"
        >
          <Text className="text-base mr-1">{selectedCode.flag}</Text>
          <Text className="text-[#1a1c1e] text-base font-medium">
            {selectedCode.code}
          </Text>
          <Text className="text-[#7d848d] text-xs ml-1">▼</Text>
        </TouchableOpacity>

        {/* Phone Number Input */}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#7d848d"
          value={value}
          onChangeText={onChangeText}
          keyboardType="phone-pad"
          autoCapitalize="none"
          className="text-[#1a1c1e] text-base flex-1"
        />
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

              {/* Search Input */}
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
                    selectedCode.code === item.code ? "bg-[#eaf8ff]" : ""
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

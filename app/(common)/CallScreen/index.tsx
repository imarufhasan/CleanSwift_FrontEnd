import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/color";

export default function CallScreen() {
  const router = useRouter();
  const [micOff, setMicOff] = useState(true);
  const [soundOff, setSoundOff] = useState(true);
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <TouchableOpacity onPress={() => router.back()} className="px-5 py-3">
        <AntDesign name="arrow-left" size={24} color="black" />
      </TouchableOpacity>

      <View className="flex-1 items-center justify-center">

        <View className="mb-2">
            <Text className="text-[20px] font-semibold text-gray-800 mb-1">0.54</Text>
        </View>
        <View
          style={{ borderColor: Colors.primary }}
          className="w-[160px] h-[160px] p-1 mb-4 bg-white border-[5px] rounded-full items-center"
        >
          <Image
            source={require("../../../assets/images/profile.png")}
            className="w-full h-full  rounded-full"
          />
        </View>
        <Text
          style={{ color: Colors.primary }}
          className="text-xl font-semibold"
        >
          Michael Johnson
        </Text>

        {/* mute and speaker icon */}
        <View className="flex-row gap-[40px] items-center justify-center mt-[100px] space-x-20">
          <TouchableOpacity
            onPress={() => setMicOff(!micOff)}
            className="items-center"
          >
            <Feather
              name={micOff ? "mic-off" : "mic"}
              size={28}
              color={Colors.primary}
            />
            <Text className="text-sm text-gray-600 mt-1">Mute</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSoundOff(!soundOff)} className="items-center">
            <Entypo name={soundOff ? "sound-mute" : "sound"} size={28} color={Colors.primary} />
            <Text className="text-sm text-gray-600 mt-1">Speaker</Text>
          </TouchableOpacity>
        </View>

        {/* end call */}
        <TouchableOpacity className="bg-red-500 rounded-full p-4 mt-10">
          <AntDesign name="phone" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

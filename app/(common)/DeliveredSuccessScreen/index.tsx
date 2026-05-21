import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import Colors from "@/constants/color";
import { useLocalSearchParams, router } from "expo-router";
import ShowMessage from "@/constants/toast";
import { useConfirmPaymentMutation } from "@/src/services/paymentApi";
import {
  useAttachCardMutation,
  useGetSavedCardsQuery,
} from "@/src/services/cardApi";
import { formatOrderNumber } from "@/src/utils/orderNumber";
import { STRIPE_PUBLISHABLE_KEY } from "@/src/constants/api";
import { useCreateRatingMutation } from "@/src/services/orderApi";

export default function DeliveredSuccessScreen() {
  const { name, image, orderId, driverId, service, bags, bagPrice, tip } =
    useLocalSearchParams<{
      name?: string;
      image?: string;
      orderId?: string;
      driverId?: string;
      service?: string;
      bags?: string;
      bagPrice?: string;
      tip?: string;
    }>();

  const [tipValue, setTipValue] = useState(tip ?? "");
  const [tipValueCustom, setTipValueCustom] = useState("");
  const [confirmPaymentModal, setConfirmPaymentModal] = useState(false);
  const [paymentMethodModal, setPaymentMethodModal] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [cardInputMessage, setCardInputMessage] = useState(
    "Enter card number, expiry date, and CVC.",
  );
  const [rating, setRating] = useState(0);
  const [submittedRating, setSubmittedRating] = useState(0);
  const { createPaymentMethod } = useStripe();
  const [createRating, { isLoading: isCreateRatingLoading }] =
    useCreateRatingMutation();
  const [confirmPayment, { isLoading }] = useConfirmPaymentMutation();
  const [attachCard, { isLoading: isSavingCard }] = useAttachCardMutation();
  const { data: cardsRes } = useGetSavedCardsQuery();

  const bagsCount = Number(bags ?? 0);
  const perBag = Number(bagPrice ?? 0);
  const tipAmount = Number(tipValue || tipValueCustom || tip || 0);
  const total = bagsCount * perBag + tipAmount;
  const defaultCard =
    cardsRes?.data?.find((card) => card.isDefault) ?? cardsRes?.data?.[0];
  const defaultCardLabel =
    defaultCard && defaultCard.brand && defaultCard.last4
      ? `${defaultCard.brand.toUpperCase()} ${String.fromCharCode(8226)}${String.fromCharCode(8226)}${String.fromCharCode(8226)}${String.fromCharCode(8226)} ${defaultCard.last4}`
      : "Add a card";

  const openPaymentMethodModal = () => {
    if (!STRIPE_PUBLISHABLE_KEY) {
      ShowMessage.error("Stripe publishable key is missing");
      return;
    }

    setPaymentMethodModal(true);
  };

  const getCardInputMessage = (details: any) => {
    if (!details) return "Enter card number, expiry date, and CVC.";
    if (details.complete) return "Card is ready to save.";
    if (details.validNumber !== "Valid") return "Enter a valid card number.";
    if (details.validExpiryDate !== "Valid")
      return "Enter a valid future expiry date.";
    if (details.validCVC !== "Valid") return "Enter the card CVC.";

    return "Complete the remaining card details.";
  };

  const normalizeExpiryYear = (year?: number) => {
    if (!year) return undefined;

    return year < 100 ? 2000 + year : year;
  };

  const handleSavePaymentMethod = async () => {
    if (!cardComplete) {
      console.log(
        "getCardInputMessage(cardDetails): ",
        getCardInputMessage(cardDetails),
      );
      ShowMessage.error(getCardInputMessage(cardDetails));
      return;
    }

    try {
      const { paymentMethod, error } = await createPaymentMethod({
        paymentMethodType: "Card",
      });

      if (error || !paymentMethod?.id) {
        console.log("error?.message: ", error?.message);

        ShowMessage.error(error?.message ?? "Failed to create payment method");
        return;
      }

      await attachCard({
        paymentMethodId: paymentMethod.id,
        brand: cardDetails?.brand,
        last4: cardDetails?.last4,
        expMonth: cardDetails?.expiryMonth,
        expYear: normalizeExpiryYear(cardDetails?.expiryYear),
        isDefault: true,
      }).unwrap();

      setPaymentMethodModal(false);
      setCardComplete(false);
      setCardDetails(null);
      setCardInputMessage("Enter card number, expiry date, and CVC.");
      ShowMessage.show("Payment method updated");
    } catch (error: any) {
      console.log(
        "erroe 2",
        error && error.data && error.data.message && error.data.message,
      );

      ShowMessage.error(
        error && error.data && error.data.message
          ? error.data.message
          : "Failed to save payment method",
      );
    }
  };

  const handleCompletePayment = async () => {
    console.log("click complete payment");
    if (!orderId) {
      ShowMessage.error("Order not found");
      return;
    }

    try {
      // 1. If already paid → show modal only
      if (isPaymentComplete) {
        setConfirmPaymentModal(true);
        return;
      }

      // 2. Validate rating
      if (!rating || rating === 0) {
        ShowMessage.error("Please give a rating before payment");
        return;
      }

      // 3. STEP 1: Confirm Payment
      const paymentRes = await confirmPayment({
        orderId: String(orderId),
        tipAmount,
      }).unwrap();

      console.log("payment res:", paymentRes);
      if (paymentRes?.success) {
        setIsPaymentComplete(true);
        console.log("paymentRes 1: ", paymentRes);

        // 4. STEP 2: Create Rating AFTER payment success
        const ratingRes = await createRating({
          orderId: String(orderId),
          driverId: String(driverId), // adjust if your API differs
          rating,
          feedback: "", // optional (you can add input later)
        }).unwrap();
        if (ratingRes?.success) {
          setSubmittedRating(rating);
          console.log("ratingRes 1:", ratingRes);
          ShowMessage.success("Payment & rating submitted successfully");
          setConfirmPaymentModal(true);
        } else {
          console.log("ratingRes 12:", ratingRes);
          ShowMessage.success("Payment & rating submitted fail");
          setConfirmPaymentModal(false);
        }
      } else {
        setIsPaymentComplete(false);
        console.log("paymentRes 2: ", paymentRes);
        ShowMessage.success("success: " + paymentRes?.message);
      }
    } catch (error: unknown) {
      const err = error as any;
      if (
        err?.status === "FETCH_ERROR" ||
        err?.message === "Network request failed"
      ) {
        ShowMessage.error(
          "Server is not reachable. Please check your internet or try again later.",
        );
        return;
      }
      if (err?.status === "PARSING_ERROR") {
        ShowMessage.error("Server response error. Please try again.");
        return;
      }
      ShowMessage.error(
        err?.data?.message ||
          "An error occurred while updating. Please try again.",
      );
      return false;
    }
  };

  const handleCompletePayment2 = async () => {
    if (isPaymentComplete) {
      setConfirmPaymentModal(true);
      return;
    }

    if (!orderId) {
      ShowMessage.error("Order not found");
      return;
    }

    try {
      const res = await confirmPayment({
        orderId: String(orderId),
        tipAmount,
      }).unwrap();
      console.log("payment res data: ", res);
      ShowMessage.success(res?.message);
      setIsPaymentComplete(true);
      setConfirmPaymentModal(true);
    } catch (error: any) {
      console.log(
        "error 3: ",
        error && error.data && error.data.message
          ? error.data.message
          : "Failed to complete payment",
      );

      ShowMessage.error(
        error && error.data && error.data.message
          ? error.data.message
          : "Failed to complete payment",
      );
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Content */}
      <ScrollView className="flex-1 bg-white">
        {/* Header */}
        <View
          style={{ backgroundColor: Colors.primary }}
          className="pt-14 pb-[50px] items-center relative"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-5 top-14 bg-white p-2 rounded-full"
          >
            <Ionicons name="arrow-back" size={22} color="#000" />
          </TouchableOpacity>

          <View className="bg-white p-4 rounded-full mb-4">
            <Ionicons
              name="checkmark-circle-outline"
              size={32}
              color={Colors.primary}
            />
          </View>

          <Text className="text-white text-xl font-semibold">
            Delivered Successfully!
          </Text>
          <Text className="text-white/80 mt-1">
            Order #{formatOrderNumber(orderId)}
          </Text>
        </View>

        <View className="rounded-xl mt-5 mb-6 px-5">
          {/* Delivery Person */}
          <View className="bg-white rounded-2xl border shadow-sm border-gray-100 p-4 -mt-12 z-10 flex-row items-center">
            <Image
              source={
                image
                  ? { uri: String(image) }
                  : require("@/assets/images/profile.png")
              }
              className="w-14 h-14 rounded-full mr-4"
            />

            <View className="flex-1">
              <Text className="text-gray-500 text-xs mb-1">Delivered by</Text>
              <Text className="text-black font-semibold text-[20px]">
                {name ?? "Driver"}
              </Text>

              <View className="flex-row items-center mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <AntDesign key={i} name="star" size={14} color="#FACC15" />
                ))}
                <Text className="text-gray-400 text-xs ml-2">
                  4.9 (234 trips)
                </Text>
              </View>
            </View>
          </View>

          {/* Rating */}
          <View className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 mt-4 items-center">
            <Text className="text-black font-semibold mb-3">
              How was your experience?
            </Text>

            {/* <View className="flex-row mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Feather
                  key={i}
                  name="star"
                  size={32}
                  color="#FACC15"
                  className="mx-1"
                />
              ))}
            </View> */}
            <View className="flex-row mb-2">
              {[1, 2, 3, 4, 5].map((i) => {
                const isSelected = i <= rating;

                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setRating(i)}
                    activeOpacity={0.7}
                  >
                    <FontAwesome
                      name={isSelected ? "star" : "star-o"}
                      size={32}
                      color="#FACC15"
                      style={{ marginHorizontal: 4 }}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text className="text-gray-400 text-sm">Tap to rate</Text>
          </View>

          {/* Tip */}
          <View className="mb-6">
            <View className="flex-row">
              <Ionicons
                name="gift-outline"
                size={18}
                color="blue"
                className="mr-2"
              />
              <Text className="font-semibold text-black mb-1">
                Add a Tip (Optional)
              </Text>
            </View>
            <Text className="text-gray-400 text-sm mb-3">
              Show your appreciation for great service
            </Text>

            <View className="flex-row justify-between mb-3">
              {/* {data.tipOptions.map((tip) => (
                <TouchableOpacity
                  key={tip.id}
                  onPress={() => setTipValue(tip.value.toString())}
                  className="border border-gray-200 px-5 py-3 rounded-xl"
                >
                  <Text className="font-semibold">{tip.label}</Text>
                </TouchableOpacity>
              ))} */}

              {[2, 3, 5, 10].map((value) => {
                const isSelected = tipValue === value.toString();

                return (
                  <TouchableOpacity
                    key={value}
                    onPress={() => {
                      setTipValue(value.toString());
                      setTipValueCustom("");
                    }}
                    className={`px-5 py-3 rounded-xl border ${
                      isSelected
                        ? "bg-blue-500 border-blue-500"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <Text
                      className={`font-semibold ${isSelected ? "text-white" : "text-black"}`}
                    >
                      ${value}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View className="mb-4 border border-gray-200 rounded-xl p-4">
              <Text className="text-gray-400 text-sm mb-1">
                Custom Tip Amount
              </Text>

              <View className="border flex-row justify-start items-center border-gray-200 rounded-xl px-4 py-3">
                <Text className="text-gray-600 text-lg">$</Text>
                <TextInput
                  value={tipValueCustom}
                  onChangeText={(text) => setTipValueCustom(text)}
                  placeholder="0.00"
                  keyboardType="numeric"
                  className="text-black"
                />
              </View>
            </View>
          </View>

          {/* Payment Summary */}
          <View className="mb-6">
            <Text className="font-semibold text-black mb-3">
              Payment Summary
            </Text>

            {[
              ["Service", service ?? "-"],
              ["Bags", `${bagsCount || 0} bag`],
              ["Tip", `$${tipAmount}`],
              ["Pickup Time", "ASAP"],
            ].map(([label, value]) => (
              <View key={label} className="flex-row justify-between mb-2">
                <Text className="text-gray-500">{label}</Text>
                <Text className="text-black">{value}</Text>
              </View>
            ))}

            <View className="flex-row justify-between mt-3">
              <Text className="font-bold text-black">Total</Text>
              <Text className="font-bold text-[#0A8CFF]">
                ${total.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Payment Method */}
          <TouchableOpacity
            onPress={openPaymentMethodModal}
            activeOpacity={0.8}
            className="flex-row items-center justify-between bg-gray-50 p-4 rounded-xl mb-8"
          >
            <View className="flex-row items-center">
              <View
                style={{ backgroundColor: Colors.primary }}
                className="rounded-full p-2"
              >
                <Ionicons name="card" size={22} color="#fff" />
              </View>
              <View className="ml-3">
                <Text className="text-gray-500 text-sm mb-1">
                  Payment Method
                </Text>
                <Text className="text-black">{defaultCardLabel}</Text>
              </View>
            </View>
            <Text className="text-[#0A8CFF] font-semibold">Change</Text>
          </TouchableOpacity>

          {/* Button */}
          <TouchableOpacity
            onPress={handleCompletePayment}
            disabled={isLoading || isPaymentComplete || isCreateRatingLoading}
            className="py-4 rounded-2xl mb-[50px] flex-row items-center justify-center"
            style={{
              backgroundColor: isPaymentComplete ? "#16A34A" : "#0A8CFF",
            }}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={22}
              color="#fff"
              className="mx-2"
            />
            <Text className="text-white text-center font-bold text-lg">
              {isPaymentComplete
                ? `Payment Confirmed $${total.toFixed(2)}`
                : isLoading || isCreateRatingLoading
                  ? "Processing..."
                  : `Complete Payment $${total.toFixed(2)}`}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Confirm Payment Modal */}
      {confirmPaymentModal && (
        <Modal
          transparent
          visible={confirmPaymentModal}
          animationType="fade"
          onRequestClose={() => setConfirmPaymentModal(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white rounded-2xl py-6 px-4 w-[90%] items-center justify-center">
              <View className="justify-center items-center bg-blue-100 w-[70px] h-[70px] p-4 rounded-full">
                <Ionicons
                  name="checkmark-circle-outline"
                  size={38}
                  color={Colors.primary}
                  className="mx-auto"
                />
              </View>
              <Text className="text-[24px] font-bold text-center mb-4 mt-4">
                Thank You!
              </Text>
              <Text className="text-gray-500 text-center mb-6">
                Your payment of ${total.toFixed(2)} has been completed
                successfully!
              </Text>

              <View className="bg-gray-50 w-full rounded-xl shadow-sm mb-6 items-center">
                <Text className="text-gray-500 text-center mb-1">
                  Your feedback helps us serve you better.
                </Text>
                <View className="flex-row mt-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FontAwesome
                      key={i}
                      name={i <= (submittedRating || rating) ? "star" : "star-o"}
                      size={30}
                      color="#FACC15"
                      className="mr-2"
                    />
                  ))}
                </View>
                <Text className="text-gray-400 text-sm mb-4 mt-1">
                  You rated {name ?? "Driver"} {submittedRating || rating} star
                  {(submittedRating || rating) === 1 ? "" : "s"}
                </Text>
              </View>

              <View className="flex-row items-center mb-4 border bg-blue-100 border-blue-500 rounded-xl px-4 py-3 w-full justify-center">
                <Text className="text-[#0A8CFF] font-semibold">
                  Download Invoice
                </Text>
                <Ionicons
                  name="download-outline"
                  size={18}
                  color={Colors.primary}
                  className="ml-2"
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  setConfirmPaymentModal(false);
                  router.replace("/(customer)/(tabs)/home");
                }}
                style={{ backgroundColor: Colors.primary }}
                className="w-full py-3 rounded-2xl mb-4 flex-row items-center justify-center"
              >
                <Text className="text-white text-center font-bold text-lg">
                  Back to Home
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <Modal
        transparent
        visible={paymentMethodModal}
        animationType="slide"
        onRequestClose={() => setPaymentMethodModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl px-5 pt-5 pb-8">
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-xl font-bold text-black">
                Payment Method
              </Text>
              <TouchableOpacity
                onPress={() => setPaymentMethodModal(false)}
                className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
              >
                <Ionicons name="close" size={20} color="#111827" />
              </TouchableOpacity>
            </View>

            <View className="bg-gray-50 rounded-2xl p-4 mb-4">
              <Text className="text-gray-500 text-sm mb-3">Card Details</Text>
              <CardField
                postalCodeEnabled={false}
                autofocus
                placeholders={{
                  number: "4242 4242 4242 4242",
                  expiration: "MM/YY",
                  cvc: "CVC",
                }}
                cardStyle={{
                  backgroundColor: "#FFFFFF",
                  textColor: "#111827",
                  borderColor: "#E5E7EB",
                  borderWidth: 1,
                  borderRadius: 12,
                  fontSize: 16,
                }}
                style={{ height: 52 }}
                onCardChange={(details) => {
                  setCardDetails(details);
                  setCardComplete(Boolean(details.complete));
                  setCardInputMessage(getCardInputMessage(details));
                }}
              />
              <Text
                className={`mt-3 text-sm ${cardComplete ? "text-green-600" : "text-gray-500"}`}
              >
                {cardInputMessage}
              </Text>
              <Text className="mt-1 text-xs text-gray-400">
                Test card: 4242 4242 4242 4242, any future expiry, any 3-digit
                CVC.
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleSavePaymentMethod}
              disabled={isSavingCard}
              style={{
                backgroundColor:
                  cardComplete && !isSavingCard ? Colors.primary : "#93C5FD",
              }}
              className="py-4 rounded-2xl flex-row items-center justify-center"
            >
              {isSavingCard ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons
                    name="card-outline"
                    size={21}
                    color="#fff"
                    className="mr-2"
                  />
                  <Text className="text-white text-center font-bold text-lg">
                    Save Card
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

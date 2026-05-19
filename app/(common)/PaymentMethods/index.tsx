import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import { router } from "expo-router";
import Colors from "@/constants/color";
import ShowMessage from "@/constants/toast";
import { STRIPE_PUBLISHABLE_KEY } from "@/src/constants/api";
import {
  SavedCard,
  useAttachCardMutation,
  useDeleteCardMutation,
  useGetSavedCardsQuery,
  useSetDefaultCardMutation,
} from "@/src/services/cardApi";

const normalizeExpiryYear = (year?: number) => {
  if (!year) return undefined;
  return year < 100 ? 2000 + year : year;
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

const formatCardLabel = (card: SavedCard) => {
  const brand = card.brand ? card.brand.toUpperCase() : "CARD";
  return `${brand} ${String.fromCharCode(8226)}${String.fromCharCode(8226)}${String.fromCharCode(8226)}${String.fromCharCode(8226)} ${card.last4 ?? "----"}`;
};

const getApiErrorMessage = (error: any, fallback: string) =>
  error?.data?.message || error?.message || fallback;

export default function PaymentMethodsScreen() {
  const { createPaymentMethod } = useStripe();
  const { data: cardsRes, isFetching, refetch } = useGetSavedCardsQuery();
  const [attachCard, { isLoading: isSavingCard }] = useAttachCardMutation();
  const [setDefaultCard, { isLoading: isSettingDefault }] =
    useSetDefaultCardMutation();
  const [deleteCard, { isLoading: isDeletingCard }] = useDeleteCardMutation();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [cardInputMessage, setCardInputMessage] = useState(
    "Enter card number, expiry date, and CVC.",
  );

  const cards = useMemo(() => cardsRes?.data ?? [], [cardsRes?.data]);
  const isBusy = isSavingCard || isSettingDefault || isDeletingCard;

  const openAddModal = () => {
    if (!STRIPE_PUBLISHABLE_KEY) {
      ShowMessage.error("Stripe publishable key is missing");
      return;
    }

    setAddModalVisible(true);
  };

  const resetCardInput = () => {
    setCardComplete(false);
    setCardDetails(null);
    setCardInputMessage("Enter card number, expiry date, and CVC.");
  };

  const handleAddCard = async () => {
    if (!cardComplete) {
      ShowMessage.error(getCardInputMessage(cardDetails));
      return;
    }

    try {
      const { paymentMethod, error } = await createPaymentMethod({
        paymentMethodType: "Card",
      });

      if (error || !paymentMethod?.id) {
        ShowMessage.error(error?.message ?? "Failed to create payment method");
        return;
      }

      await attachCard({
        paymentMethodId: paymentMethod.id,
        brand: cardDetails?.brand,
        last4: cardDetails?.last4,
        expMonth: cardDetails?.expiryMonth,
        expYear: normalizeExpiryYear(cardDetails?.expiryYear),
        isDefault: cards.length === 0,
      }).unwrap();

      resetCardInput();
      setAddModalVisible(false);
      ShowMessage.show("Payment method added");
    } catch (error: any) {
      ShowMessage.error(getApiErrorMessage(error, "Failed to save card"));
    }
  };

  const handleSetDefault = async (card: SavedCard) => {
    if (card.isDefault) return;

    try {
      await setDefaultCard(card._id).unwrap();
      ShowMessage.show("Default card updated");
    } catch (error: any) {
      ShowMessage.error(
        getApiErrorMessage(error, "Failed to update default card"),
      );
    }
  };

  const handleDeleteCard = (card: SavedCard) => {
    Alert.alert(
      "Delete payment method?",
      `${formatCardLabel(card)} will be removed from your account.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCard(card._id).unwrap();
              ShowMessage.show("Payment method deleted");
            } catch (error: any) {
              ShowMessage.error(
                getApiErrorMessage(error, "Failed to delete card"),
              );
            }
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 bg-[#F6F9FF]">
      <View
        style={{ backgroundColor: Colors.primary }}
        className="pt-14 pb-6 px-5 rounded-b-[28px]"
      >
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View className="ml-3 flex-1">
            <Text className="text-white text-[22px] font-bold">
              Payment Methods
            </Text>
            <Text className="text-white/80 text-sm">
              Manage saved cards for faster checkout
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-6"
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      >
        {isFetching && cards.length === 0 ? (
          <View className="items-center py-10">
            <ActivityIndicator color={Colors.primary} />
            <Text className="mt-3 text-gray-500">Loading cards...</Text>
          </View>
        ) : cards.length === 0 ? (
          <View className="bg-white rounded-2xl p-6 items-center border border-blue-100">
            <View className="w-16 h-16 rounded-full bg-blue-50 items-center justify-center">
              <Ionicons name="card-outline" size={32} color={Colors.primary} />
            </View>
            <Text className="mt-4 text-lg font-bold text-gray-900">
              No cards saved
            </Text>
            <Text className="mt-2 text-center text-gray-500">
              Add a card once and use it when completing delivery payments.
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {cards.map((card) => (
              <View
                key={card._id}
                className="bg-white rounded-2xl p-4 border border-blue-100"
              >
                <View className="flex-row items-center">
                  <View className="w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center">
                    <Ionicons name="card" size={24} color={Colors.primary} />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="font-bold text-gray-900">
                      {formatCardLabel(card)}
                    </Text>
                    <Text className="mt-1 text-gray-500 text-sm">
                      Expires {String(card.expMonth ?? "--").padStart(2, "0")}/
                      {card.expYear ?? "----"}
                    </Text>
                  </View>
                  {card.isDefault && (
                    <View className="rounded-full bg-green-100 px-3 py-1">
                      <Text className="text-green-700 text-xs font-semibold">
                        Default
                      </Text>
                    </View>
                  )}
                </View>

                <View className="flex-row gap-3 mt-4">
                  <TouchableOpacity
                    onPress={() => handleSetDefault(card)}
                    disabled={card.isDefault || isBusy}
                    className={`flex-1 rounded-xl py-3 items-center ${
                      card.isDefault ? "bg-gray-100" : "bg-blue-50"
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        card.isDefault ? "text-gray-400" : "text-blue-600"
                      }`}
                    >
                      Set Default
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteCard(card)}
                    disabled={isBusy}
                    className="flex-1 rounded-xl py-3 items-center bg-red-50"
                  >
                    <Text className="text-red-500 font-semibold">Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={openAddModal}
          disabled={isBusy}
          style={{ backgroundColor: Colors.primary }}
          className="mt-6 mb-10 rounded-2xl py-4 flex-row items-center justify-center"
        >
          {isBusy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="add-circle-outline" size={22} color="#fff" />
              <Text className="ml-2 text-white text-[16px] font-bold">
                Add New Card
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-[28px] p-5">
              <View className="flex-row items-center justify-between mb-5">
                <View>
                  <Text className="text-[22px] font-bold text-gray-900">
                    Add Card
                  </Text>
                  <Text className="text-gray-500 mt-1">
                    Use Stripe test card 4242 4242 4242 4242.
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setAddModalVisible(false);
                    resetCardInput();
                  }}
                  className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                >
                  <Ionicons name="close" size={22} color="#111827" />
                </TouchableOpacity>
              </View>

              <View className="border border-blue-100 rounded-2xl p-3 bg-white">
                <CardField
                  postalCodeEnabled={false}
                  placeholders={{ number: "4242 4242 4242 4242" }}
                  cardStyle={{
                    backgroundColor: "#FFFFFF",
                    textColor: "#111827",
                    placeholderColor: "#9CA3AF",
                  }}
                  style={{ width: "100%", height: 52 }}
                  onCardChange={(details) => {
                    setCardDetails(details);
                    setCardComplete(Boolean(details?.complete));
                    setCardInputMessage(getCardInputMessage(details));
                  }}
                />
              </View>

              <Text
                className={`mt-3 text-sm ${
                  cardComplete ? "text-green-600" : "text-gray-500"
                }`}
              >
                {cardInputMessage}
              </Text>

              <TouchableOpacity
                onPress={handleAddCard}
                disabled={!cardComplete || isSavingCard}
                style={{
                  backgroundColor:
                    cardComplete && !isSavingCard ? Colors.primary : "#93C5FD",
                }}
                className="mt-6 rounded-2xl py-4 flex-row items-center justify-center"
              >
                {isSavingCard ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="card-outline" size={22} color="#fff" />
                    <Text className="text-white font-bold text-[16px] ml-2">
                      Save Card
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

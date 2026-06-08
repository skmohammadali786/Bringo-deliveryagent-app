import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";
import { fadeInDown, fadeInDownDelay } from "@/constants/animations";

export default function PickupConfirmScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders, updateOrderStatus } = useOrderStore();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [validationModal, setValidationModal] = useState(false);
  const refs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];

  const activeOrder = orders.find((o) => o.status === "at_shop");

  const handleOtpChange = (val: string, idx: number) => {
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 3) refs[idx + 1].current?.focus();
    if (!val && idx > 0) refs[idx - 1].current?.focus();
  };

  const fullOtp = otp.join("");

  const handleConfirm = async () => {
    if (fullOtp.length !== 4) {
      setValidationModal(true);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    if (activeOrder) updateOrderStatus(activeOrder.id, "picked_up");
    setLoading(false);
    router.push("/pickup/proof" as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ConfirmModal
        visible={validationModal}
        onClose={() => setValidationModal(false)}
        title="Enter OTP"
        body="Please enter the 4-digit OTP from the shop to confirm pickup."
        confirmText="OK"
        onConfirm={() => setValidationModal(false)}
        variant="warning"
        icon="hash"
      />
      <ScreenHeader title="Confirm Pickup" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 16 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Info */}
        {activeOrder && (
          <Animated.View entering={fadeInDown(0)}>
            <Card style={styles.orderCard}>
              <View style={[styles.shopIcon, { backgroundColor: colors.primaryLight }]}>
                <Feather name="shopping-bag" size={24} color={colors.primary} />
              </View>
              <View style={styles.orderInfo}>
                <Text style={[styles.shopName, { color: colors.foreground }]}>{activeOrder.shop.name}</Text>
                <Text style={[styles.orderNum, { color: colors.mutedForeground }]}>
                  {activeOrder.orderNumber} · {activeOrder.items.length} items
                </Text>
              </View>
            </Card>
          </Animated.View>
        )}

        {/* OTP Input */}
        <Animated.View entering={fadeInDownDelay(80)}>
          <Card style={styles.otpCard}>
            <Text style={[styles.otpTitle, { color: colors.foreground }]}>Enter Shop OTP</Text>
            <Text style={[styles.otpSub, { color: colors.mutedForeground }]}>
              Get the 4-digit OTP from the shop to confirm pickup
            </Text>
            <View style={styles.otpRow}>
              {otp.map((val, idx) => (
                <TextInput
                  key={idx}
                  ref={refs[idx]}
                  value={val}
                  onChangeText={(v) => handleOtpChange(v.slice(-1), idx)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={[
                    styles.otpBox,
                    {
                      backgroundColor: val ? colors.primaryLight : colors.muted,
                      borderColor: val ? colors.primary : colors.border,
                      color: colors.foreground,
                    },
                  ]}
                />
              ))}
            </View>
          </Card>
        </Animated.View>

        {/* Items Checklist */}
        {activeOrder && (
          <Animated.View entering={fadeInDownDelay(160)}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Items to Collect</Text>
            <Card padding={0}>
              {activeOrder.items.map((item, i) => (
                <View
                  key={item.id}
                  style={[styles.itemRow, { borderBottomColor: colors.border, borderBottomWidth: i < activeOrder.items.length - 1 ? 1 : 0 }]}
                >
                  <View style={[styles.itemCheck, { backgroundColor: colors.successLight }]}>
                    <Feather name="check" size={14} color={colors.success} />
                  </View>
                  <Text style={[styles.itemName, { color: colors.foreground }]}>{item.name}</Text>
                  <Text style={[styles.itemQty, { color: colors.mutedForeground }]}>×{item.quantity}</Text>
                </View>
              ))}
            </Card>
          </Animated.View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <Button
          title="Confirm Pickup"
          onPress={handleConfirm}
          loading={loading}
          disabled={fullOtp.length < 4}
          size="xl"
          icon={<Feather name="check-circle" size={18} color="#FFF" />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  orderCard: { flexDirection: "row", alignItems: "center", gap: 14 },
  shopIcon: { width: 56, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  orderInfo: { flex: 1, gap: 4 },
  shopName: { fontSize: 16, fontFamily: "Inter_700Bold" },
  orderNum: { fontSize: 13, fontFamily: "Inter_400Regular" },
  otpCard: { alignItems: "center", gap: 16 },
  otpTitle: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  otpSub: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
  otpRow: { flexDirection: "row", gap: 14 },
  otpBox: {
    width: 60,
    height: 68,
    borderRadius: 16,
    borderWidth: 2,
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  itemCheck: { width: 28, height: 28, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  itemName: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  itemQty: { fontSize: 14, fontFamily: "Inter_700Bold" },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});

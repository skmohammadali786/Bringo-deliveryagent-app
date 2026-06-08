import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";

export default function PickupConfirmScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders, activeOrderId, updateOrderStatus } = useOrderStore();
  const order = orders.find((o) => o.id === activeOrderId) ?? orders[1];
  const [otp, setOtp] = useState(Array(4).fill(""));
  const [error, setError] = useState("");
  const inputRef = useRef<TextInput>(null);
  const filledCount = otp.filter(Boolean).length;

  const verify = () => {
    const code = otp.join("");
    if (code !== order?.pickupOtp) {
      setError("Incorrect OTP. Please try again.");
      return;
    }
    updateOrderStatus(order.id, "picked_up");
    router.push("/pickup/proof" as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Confirm Pickup" showBack />
      <View style={[styles.content, { paddingTop: Platform.OS === "web" ? 40 : 40 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Enter Pickup OTP</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          Ask the shop owner for the 4-digit OTP to confirm pickup
        </Text>
        <Pressable onPress={() => inputRef.current?.focus()} style={styles.otpRow}>
          {otp.map((digit, i) => (
            <View key={i} style={[styles.otpBox, { backgroundColor: digit ? colors.primaryLight : colors.card, borderColor: i === filledCount && !digit ? colors.primary : digit ? colors.primary : colors.border, borderRadius: colors.radiusSm }]}>
              <Text style={[styles.otpDigit, { color: colors.foreground }]}>{digit}</Text>
            </View>
          ))}
        </Pressable>
        <TextInput ref={inputRef} value={otp.join("")} onChangeText={(t) => { const d = t.replace(/\D/g, "").slice(0, 4).split(""); const n = Array(4).fill(""); d.forEach((c, i) => (n[i] = c)); setOtp(n); setError(""); }} keyboardType="number-pad" maxLength={4} style={{ position: "absolute", opacity: 0 }} autoFocus />
        {error ? <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text> : null}
      </View>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <Button title="Verify & Confirm Pickup" onPress={verify} disabled={filledCount !== 4} size="xl" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, gap: 24, alignItems: "center" },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.8, textAlign: "center" },
  sub: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 24 },
  otpRow: { flexDirection: "row", gap: 14, justifyContent: "center" },
  otpBox: { width: 64, height: 72, alignItems: "center", justifyContent: "center", borderWidth: 1.5 },
  otpDigit: { fontSize: 28, fontFamily: "Inter_700Bold" },
  error: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
  footer: { paddingHorizontal: 24 },
});

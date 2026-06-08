import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";

export default function DeliveryOtpScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders, updateOrderStatus } = useOrderStore();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputs = useRef<(TextInput | null)[]>([]);

  const activeOrder = orders.find((o) => o.status === "delivering");

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    setError("");
    if (text && index < 3) inputs.current[index + 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 4) {
      setError("Please enter the 4-digit OTP");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    if (activeOrder) {
      updateOrderStatus(activeOrder.id, "delivered");
    }
    setLoading(false);
    router.replace("/delivery/success" as any);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScreenHeader title="Verify OTP" showBack />
      <View
        style={[
          styles.content,
          { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 20 },
        ]}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(50).duration(500)} style={styles.header}>
          <View style={[styles.headerIcon, { backgroundColor: colors.primaryLight }]}>
            <Text style={styles.headerEmoji}>🔐</Text>
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Enter Delivery OTP
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Ask the customer for the 4-digit OTP to confirm delivery
          </Text>
        </Animated.View>

        {/* Customer Card */}
        {activeOrder && (
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <Card style={styles.customerCard}>
              <View style={styles.customerRow}>
                <View style={[styles.customerAvatar, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.avatarInitial, { color: colors.primary }]}>
                    {activeOrder.customer.name.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.customerLabel, { color: colors.mutedForeground }]}>DELIVERING TO</Text>
                  <Text style={[styles.customerName, { color: colors.foreground }]}>
                    {activeOrder.customer.name}
                  </Text>
                  <Text style={[styles.customerAddr, { color: colors.mutedForeground }]} numberOfLines={1}>
                    {activeOrder.customer.address}
                  </Text>
                </View>
              </View>
            </Card>
          </Animated.View>
        )}

        {/* OTP Input */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)} style={styles.otpSection}>
          <Text style={[styles.otpLabel, { color: colors.foreground }]}>4-Digit OTP</Text>
          <View style={styles.otpRow}>
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={(ref) => { inputs.current[i] = ref; }}
                value={digit}
                onChangeText={(text) => handleChange(text, i)}
                keyboardType="number-pad"
                maxLength={1}
                style={[
                  styles.otpInput,
                  {
                    backgroundColor: colors.card,
                    borderColor: digit ? colors.primary : error ? colors.destructive : colors.border,
                    color: colors.foreground,
                    borderWidth: digit ? 2 : 1,
                  },
                ]}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Backspace" && !digit && i > 0) {
                    inputs.current[i - 1]?.focus();
                  }
                }}
              />
            ))}
          </View>
          {error ? (
            <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
          ) : null}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.actions}>
          <Button
            title="Confirm Delivery"
            onPress={handleVerify}
            loading={loading}
            disabled={otp.join("").length !== 4}
            size="xl"
          />
          <Button
            title="Customer not available? Report issue"
            onPress={() => {
              Alert.alert(
                "Delivery Issue",
                "What would you like to do?",
                [
                  { text: "Try again later", onPress: () => router.push("/delivery/reschedule" as any) },
                  { text: "Mark as failed", style: "destructive", onPress: () => router.push("/delivery/failed" as any) },
                  { text: "Cancel", style: "cancel" },
                ]
              );
            }}
            variant="ghost"
            size="md"
          />
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 24,
  },
  header: { alignItems: "center", gap: 12 },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerEmoji: { fontSize: 36 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.8, textAlign: "center" },
  subtitle: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
  customerCard: { gap: 0 },
  customerRow: { flexDirection: "row", gap: 14, alignItems: "center" },
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: { fontSize: 22, fontFamily: "Inter_700Bold" },
  customerLabel: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.6, marginBottom: 2 },
  customerName: { fontSize: 16, fontFamily: "Inter_700Bold" },
  customerAddr: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  otpSection: { gap: 16 },
  otpLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  otpRow: { flexDirection: "row", gap: 14, justifyContent: "center" },
  otpInput: {
    width: 64,
    height: 72,
    borderRadius: 16,
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  errorText: { fontSize: 13, fontFamily: "Inter_500Medium", textAlign: "center" },
  actions: { gap: 12, marginTop: "auto" },
});

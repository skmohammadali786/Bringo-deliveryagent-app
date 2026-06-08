import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/store/authStore";

export default function LoginScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setPhoneNumber = useAuthStore((s) => s.setPhoneNumber);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    setLoading(true);
    setPhoneNumber(phone);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    router.push("/(auth)/otp");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScreenHeader title="" showBack />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Enter your{"\n"}mobile number
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            We'll send a 6-digit OTP to verify your identity
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.form}>
          <Input
            label="Mobile Number"
            value={phone}
            onChangeText={(t) => {
              setPhone(t.replace(/\D/g, "").slice(0, 10));
              setError("");
            }}
            keyboardType="phone-pad"
            placeholder="Enter 10-digit number"
            error={error}
            icon={
              <View style={styles.countryCode}>
                <Text style={[styles.ccText, { color: colors.foreground }]}>🇮🇳 +91</Text>
              </View>
            }
            maxLength={10}
          />

          <View style={[styles.infoBox, { backgroundColor: colors.primaryLight, borderRadius: colors.radiusSm }]}>
            <Feather name="info" size={14} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.primary }]}>
              OTP will be sent to your registered mobile number
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.footer}>
          <Button
            title="Send OTP"
            onPress={handleSendOtp}
            loading={loading}
            disabled={phone.length !== 10}
            size="xl"
          />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: 24, gap: 32 },
  header: { gap: 8, marginTop: 8 },
  title: {
    fontSize: 34,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1.2,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
  },
  form: { gap: 16 },
  countryCode: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12 },
  ccText: { fontSize: 15, fontFamily: "Inter_500Medium" },
  infoBox: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12 },
  infoText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 20 },
  footer: { marginTop: "auto", gap: 12 },
});

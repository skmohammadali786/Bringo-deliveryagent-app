import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/store/authStore";
import { fadeInDownDelay } from "@/constants/animations";

const OTP_LENGTH = 6;

export default function OtpScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { phoneNumber, setAuthenticated } = useAuthStore();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const t = setInterval(() => setTimer((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setError("Please enter the complete OTP");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setAuthenticated(true);
    router.replace("/(auth)/permissions");
  };

  const handleOtpChange = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
    const newOtp = Array(OTP_LENGTH).fill("");
    digits.forEach((d, i) => (newOtp[i] = d));
    setOtp(newOtp);
    setError("");
  };

  const filledCount = otp.filter(Boolean).length;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScreenHeader title="" showBack />
      <View
        style={[
          styles.content,
          { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 },
        ]}
      >
        <Animated.View entering={fadeInDownDelay(100)} style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Verify OTP</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            6-digit code sent to{"\n"}
            <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>
              +91 {phoneNumber}
            </Text>
          </Text>
        </Animated.View>

        <Animated.View entering={fadeInDownDelay(200)} style={styles.otpContainer}>
          <Pressable onPress={() => inputRef.current?.focus()} style={styles.otpRow}>
            {otp.map((digit, i) => (
              <View
                key={i}
                style={[
                  styles.otpBox,
                  {
                    backgroundColor: digit ? colors.primaryLight : colors.card,
                    borderColor: i === filledCount && !digit ? colors.primary : digit ? colors.primary : colors.border,
                    borderWidth: i === filledCount && !digit ? 2 : 1.5,
                    borderRadius: colors.radiusSm,
                  },
                ]}
              >
                <Text style={[styles.otpDigit, { color: colors.foreground }]}>
                  {digit || ""}
                </Text>
              </View>
            ))}
          </Pressable>
          <TextInput
            ref={inputRef}
            value={otp.join("")}
            onChangeText={handleOtpChange}
            keyboardType="number-pad"
            maxLength={OTP_LENGTH}
            style={{ position: "absolute", opacity: 0, height: 1 }}
            autoFocus
          />
          {error ? (
            <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>
          ) : null}
        </Animated.View>

        <Animated.View entering={fadeInDownDelay(300)} style={styles.resend}>
          {timer > 0 ? (
            <Text style={[styles.timerText, { color: colors.mutedForeground }]}>
              Resend OTP in{" "}
              <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>
                {timer}s
              </Text>
            </Text>
          ) : (
            <Pressable
              onPress={() => {
                setTimer(30);
                setOtp(Array(OTP_LENGTH).fill(""));
              }}
            >
              <Text style={[styles.resendBtn, { color: colors.primary }]}>Resend OTP</Text>
            </Pressable>
          )}
        </Animated.View>

        <View style={styles.footer}>
          <Button
            title="Verify & Continue"
            onPress={handleVerify}
            loading={loading}
            disabled={filledCount !== OTP_LENGTH}
            size="xl"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 24, gap: 32 },
  header: { gap: 8, marginTop: 8 },
  title: { fontSize: 34, fontFamily: "Inter_700Bold", letterSpacing: -1.2 },
  subtitle: { fontSize: 16, fontFamily: "Inter_400Regular", lineHeight: 26 },
  otpContainer: { gap: 16 },
  otpRow: { flexDirection: "row", gap: 10, justifyContent: "center" },
  otpBox: {
    width: 48,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  otpDigit: { fontSize: 24, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  error: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
  resend: { alignItems: "center" },
  timerText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  resendBtn: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  footer: { marginTop: "auto" },
});

import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { fadeInDownDelay } from "@/constants/animations";

export default function BankDetailsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({ accountNum: "", confirmNum: "", ifsc: "", bankName: "", holderName: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.accountNum) e.accountNum = "Account number required";
    if (form.accountNum !== form.confirmNum) e.confirmNum = "Account numbers don't match";
    if (!form.ifsc || form.ifsc.length !== 11) e.ifsc = "Enter valid 11-character IFSC code";
    if (!form.holderName) e.holderName = "Account holder name required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScreenHeader title="Bank Details" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 20 : 0 }]} keyboardShouldPersistTaps="handled">
        <Animated.View entering={fadeInDownDelay(100)} style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Bank Account</Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>Your earnings will be transferred to this account</Text>
        </Animated.View>
        <Animated.View entering={fadeInDownDelay(200)} style={[styles.secureBox, { backgroundColor: colors.successLight, borderRadius: colors.radiusSm }]}>
          <Feather name="lock" size={14} color={colors.success} />
          <Text style={[styles.secureText, { color: colors.success }]}>256-bit encrypted & secure</Text>
        </Animated.View>
        <Animated.View entering={fadeInDownDelay(250)} style={styles.form}>
          <Input label="Account Number" placeholder="Enter account number" value={form.accountNum} onChangeText={(t) => setForm((f) => ({ ...f, accountNum: t.replace(/\D/g, "") }))} keyboardType="number-pad" error={errors.accountNum} secureTextEntry />
          <Input label="Confirm Account Number" placeholder="Re-enter account number" value={form.confirmNum} onChangeText={(t) => setForm((f) => ({ ...f, confirmNum: t.replace(/\D/g, "") }))} keyboardType="number-pad" error={errors.confirmNum} />
          <Input label="IFSC Code" placeholder="SBIN0001234" value={form.ifsc} onChangeText={(t) => setForm((f) => ({ ...f, ifsc: t.toUpperCase().slice(0, 11) }))} autoCapitalize="characters" error={errors.ifsc} hint="11-character code on your cheque book" />
          <Input label="Bank Name" placeholder="State Bank of India" value={form.bankName} onChangeText={(t) => setForm((f) => ({ ...f, bankName: t }))} autoCapitalize="words" />
          <Input label="Account Holder Name" placeholder="As per bank records" value={form.holderName} onChangeText={(t) => setForm((f) => ({ ...f, holderName: t }))} autoCapitalize="words" error={errors.holderName} />
        </Animated.View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.background }]}>
        <Button title="Continue" onPress={() => { if (validate()) router.push("/(onboarding)/upi-details"); }} size="xl" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, gap: 20 },
  header: { gap: 6 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.6, marginTop: 8 },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  secureBox: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12 },
  secureText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  form: { gap: 16 },
  footer: { paddingHorizontal: 24, paddingTop: 12 },
});

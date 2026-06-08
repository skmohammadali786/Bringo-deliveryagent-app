import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { StepIndicator } from "@/components/common/StepIndicator";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/store/authStore";
import { fadeInDownDelay } from "@/constants/animations";

export default function PersonalInfoScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setAgent = useAuthStore((s) => s.setAgent);
  const [form, setForm] = useState({ name: "", email: "", dob: "", city: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter valid email";
    if (!form.dob) e.dob = "Date of birth is required";
    if (!form.city.trim()) e.city = "City is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    setAgent({ name: form.name, email: form.email });
    router.push("/(onboarding)/profile-photo");
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScreenHeader title="Personal Info" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 20 : 0 }]} keyboardShouldPersistTaps="handled">
        <Animated.View entering={fadeInDownDelay(100)}>
          <StepIndicator current={1} total={4} label="Step 1 of 4 — Personal Information" />
        </Animated.View>
        <Animated.View entering={fadeInDownDelay(150)} style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Tell us about you</Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>This information will be used to verify your identity</Text>
        </Animated.View>
        <Animated.View entering={fadeInDownDelay(250)} style={styles.form}>
          <Input label="Full Name (as per Aadhaar)" placeholder="Enter your full name" value={form.name} onChangeText={(t) => setForm((f) => ({ ...f, name: t }))} error={errors.name} autoCapitalize="words" />
          <Input label="Email Address (optional)" placeholder="your@email.com" value={form.email} onChangeText={(t) => setForm((f) => ({ ...f, email: t }))} error={errors.email} keyboardType="email-address" autoCapitalize="none" />
          <Input label="Date of Birth" placeholder="DD/MM/YYYY" value={form.dob} onChangeText={(t) => setForm((f) => ({ ...f, dob: t }))} error={errors.dob} keyboardType="numeric" />
          <Input label="City" placeholder="Your city" value={form.city} onChangeText={(t) => setForm((f) => ({ ...f, city: t }))} error={errors.city} autoCapitalize="words" />
        </Animated.View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.background }]}>
        <Button title="Continue" onPress={handleNext} size="xl" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, gap: 24 },
  header: { gap: 6 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.8 },
  sub: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 22 },
  form: { gap: 16 },
  footer: { paddingHorizontal: 24, paddingTop: 12 },
});

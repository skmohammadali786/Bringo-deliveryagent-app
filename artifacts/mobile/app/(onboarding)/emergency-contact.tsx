import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export default function EmergencyContactScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({ name: "", phone: "", relation: "" });

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScreenHeader title="Emergency Contact" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 20 : 0 }]} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: colors.foreground }]}>Emergency Contact</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>We'll contact this person in case of an emergency while you're delivering</Text>
        <View style={styles.form}>
          <Input label="Contact Name" placeholder="Full name" value={form.name} onChangeText={(t) => setForm((f) => ({ ...f, name: t }))} autoCapitalize="words" />
          <Input label="Mobile Number" placeholder="10-digit mobile number" value={form.phone} onChangeText={(t) => setForm((f) => ({ ...f, phone: t.replace(/\D/g, "").slice(0, 10) }))} keyboardType="phone-pad" />
          <Input label="Relationship" placeholder="e.g. Spouse, Parent, Sibling" value={form.relation} onChangeText={(t) => setForm((f) => ({ ...f, relation: t }))} autoCapitalize="words" />
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.background }]}>
        <Button title="Continue" onPress={() => router.push("/(onboarding)/selfie")} disabled={!form.name || form.phone.length !== 10} size="xl" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, gap: 20 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.6, marginTop: 8 },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  form: { gap: 16 },
  footer: { paddingHorizontal: 24, paddingTop: 12 },
});

import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/store/authStore";

export default function PersonalProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { agent, setAgent } = useAuthStore();
  const [form, setForm] = useState({ name: agent?.name ?? "", email: agent?.email ?? "" });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setAgent({ name: form.name, email: form.email });
    setSaved(true);
    setTimeout(() => { setSaved(false); router.back(); }, 1000);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScreenHeader title="Personal Details" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: colors.foreground }]}>Edit Profile</Text>
        <View style={styles.form}>
          <Input label="Full Name" value={form.name} onChangeText={(t) => setForm((f) => ({ ...f, name: t }))} autoCapitalize="words" />
          <Input label="Email Address" value={form.email} onChangeText={(t) => setForm((f) => ({ ...f, email: t }))} keyboardType="email-address" autoCapitalize="none" />
          <Input label="Mobile Number" value={`+91 ${agent?.phone ?? ""}`} editable={false} hint="Mobile number cannot be changed. Contact support." />
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.background }]}>
        <Button title={saved ? "Saved!" : "Save Changes"} onPress={handleSave} size="xl" variant={saved ? "success" : "primary"} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, gap: 20, paddingTop: 8 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.6 },
  form: { gap: 16 },
  footer: { paddingHorizontal: 24, paddingTop: 12 },
});

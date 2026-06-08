import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export default function IssueScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Report Issue" showBack />
      <View style={styles.successState}>
        <Text style={{ fontSize: 48 }}>✅</Text>
        <Text style={[styles.successTitle, { color: colors.foreground }]}>Issue Reported</Text>
        <Text style={[styles.successSub, { color: colors.mutedForeground }]}>We'll review and get back to you within 24 hours via SMS or app notification.</Text>
        <Button title="Back to Support" onPress={() => router.push("/support/" as any)} size="xl" style={{ marginTop: 16 }} />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScreenHeader title="Report Issue" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: colors.foreground }]}>Describe your issue</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>Provide as much detail as possible for faster resolution</Text>
        <Input label="Issue Title" placeholder="Brief summary of the problem" value={title} onChangeText={setTitle} />
        <Input label="Description" placeholder="Explain what happened in detail..." value={desc} onChangeText={setDesc} multiline numberOfLines={5} />
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.background }]}>
        <Button title="Submit Issue" onPress={() => setSubmitted(true)} disabled={!title || !desc} size="xl" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, gap: 16, paddingTop: 8 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.6 },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  footer: { paddingHorizontal: 24, paddingTop: 12 },
  successState: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, gap: 12 },
  successTitle: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.6 },
  successSub: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 24 },
});

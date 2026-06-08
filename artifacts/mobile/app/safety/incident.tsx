import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export default function IncidentScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("");

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScreenHeader title="Report Incident" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: colors.foreground }]}>Report Safety Incident</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          All incidents are kept confidential and reviewed by our safety team
        </Text>
        <Input label="Incident Title" placeholder="Brief description of what happened" value={title} onChangeText={setTitle} />
        <Input label="Location" placeholder="Where did this happen?" value={location} onChangeText={setLocation} />
        <Input label="Detailed Description" placeholder="Describe the incident in detail..." value={desc} onChangeText={setDesc} multiline numberOfLines={5} />
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.background }]}>
        <Button title="Submit Incident Report" onPress={() => { alert("Incident reported. Our safety team will review within 24 hours."); router.back(); }} disabled={!title || !desc} size="xl" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, gap: 16, paddingTop: 8 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.6 },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  footer: { paddingHorizontal: 24, paddingTop: 12 },
});

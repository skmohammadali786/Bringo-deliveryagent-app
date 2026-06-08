import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const TYPES = ["Missing payment", "Incorrect amount", "COD collection issue", "Earning deducted incorrectly", "Other"];

export default function OrderDisputeScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [type, setType] = useState<string | null>(null);
  const [orderId, setOrderId] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScreenHeader title="Payment Dispute" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: colors.foreground }]}>Report Payment Issue</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>Select the type of issue and provide order details</Text>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>Issue Type</Text>
        {TYPES.map((t) => (
          <Pressable key={t} onPress={() => setType(t)} style={[styles.typeBtn, { backgroundColor: type === t ? colors.primaryLight : colors.card, borderColor: type === t ? colors.primary : colors.border, borderRadius: colors.radiusSm }]}>
            <Text style={[styles.typeBtnText, { color: type === t ? colors.primary : colors.foreground }]}>{t}</Text>
          </Pressable>
        ))}
        <Input label="Order ID" placeholder="e.g. BRG-2024-001" value={orderId} onChangeText={setOrderId} />
        <Input label="Additional Details" placeholder="Describe the issue..." value={desc} onChangeText={setDesc} multiline numberOfLines={4} />
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.background }]}>
        <Button title="Submit Dispute" onPress={() => router.push("/support/chat" as any)} disabled={!type || !orderId} size="xl" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 12, paddingTop: 8 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.6 },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  label: { fontSize: 13, fontFamily: "Inter_600SemiBold", letterSpacing: 0.2 },
  typeBtn: { padding: 14, borderWidth: 1.5 },
  typeBtnText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  footer: { paddingHorizontal: 20, paddingTop: 12 },
});

import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export default function AlternativeFlowScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [product, setProduct] = useState("");

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScreenHeader title="Alternative Product" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: colors.foreground }]}>Suggest Alternative</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          Customer rejected the item. Propose a replacement product.
        </Text>
        <Input label="Alternative Product" placeholder="What can you offer instead?" value={product} onChangeText={setProduct} />
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.background }]}>
        <Button title="Propose Alternative" onPress={() => router.push("/product/approval-pending" as any)} disabled={!product} size="xl" />
        <Button title="Cancel Order Item" onPress={() => router.back()} variant="ghost" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, gap: 20, paddingTop: 8 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.6 },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  footer: { paddingHorizontal: 24, paddingTop: 12, gap: 8 },
});

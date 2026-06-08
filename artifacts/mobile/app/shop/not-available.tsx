import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export default function ProductNotAvailableScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Product Unavailable" showBack />
      <View style={styles.content}>
        <View style={[styles.iconWrap, { backgroundColor: colors.warningLight }]}>
          <Feather name="alert-circle" size={48} color={colors.warning} />
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>Product Not Available</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          The shop doesn't have this item. You can suggest an alternate product or shop.
        </Text>
        <View style={styles.btns}>
          <Button title="Find Alternate Shop" onPress={() => router.push("/shop/suggested" as any)} size="xl" />
          <Button title="Suggest Alternate Product" onPress={() => router.push("/shop/alternate-product" as any)} variant="outline" size="lg" />
          <Button title="Skip This Item" onPress={() => router.back()} variant="ghost" size="md" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, alignItems: "center", justifyContent: "center", gap: 16 },
  iconWrap: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontFamily: "Inter_700Bold", letterSpacing: -0.6, textAlign: "center" },
  sub: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 24 },
  btns: { width: "100%", gap: 10 },
});

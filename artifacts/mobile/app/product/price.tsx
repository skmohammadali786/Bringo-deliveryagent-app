import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";

export default function ProductPriceScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders, activeOrderId } = useOrderStore();
  const order = orders.find((o) => o.id === activeOrderId) ?? orders[1];
  const [prices, setPrices] = useState<Record<string, string>>(
    Object.fromEntries(order?.items.map((i) => [i.id, i.price.toString()]) ?? [])
  );

  const totalActual = Object.values(prices).reduce((sum, p) => sum + (parseFloat(p) || 0), 0);
  const totalExpected = order?.totalAmount ?? 0;
  const diff = totalActual - totalExpected;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScreenHeader title="Verify Prices" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 20 : 0 }]} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: colors.foreground }]}>Enter Actual Prices</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          Enter the price shown on the product/receipt at the shop
        </Text>
        {order?.items.map((item) => (
          <View key={item.id} style={[styles.priceRow, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: colors.foreground }]}>{item.name}</Text>
              <Text style={[styles.itemUnit, { color: colors.mutedForeground }]}>Qty: {item.quantity} • Expected: ₹{item.price}</Text>
            </View>
            <View style={styles.priceInput}>
              <MaterialCommunityIcons name="currency-inr" size={16} color={colors.foreground} />
              <Input
                value={prices[item.id]}
                onChangeText={(t) => setPrices((p) => ({ ...p, [item.id]: t.replace(/\D/g, "") }))}
                keyboardType="number-pad"
                style={{ width: 80, textAlign: "right" }}
              />
            </View>
          </View>
        ))}
        <View style={[styles.summary, { backgroundColor: diff > 0 ? colors.warningLight : diff < 0 ? colors.destructiveLight : colors.successLight, borderRadius: colors.radiusSm }]}>
          <Text style={[styles.summaryText, { color: diff > 0 ? colors.warning : diff < 0 ? colors.destructive : colors.success }]}>
            {diff === 0 ? "✓ Total matches expected amount" : diff > 0 ? `⚠ ₹${Math.abs(diff)} more than expected` : `⚠ ₹${Math.abs(diff)} less than expected`}
          </Text>
          <Text style={[styles.summaryTotal, { color: colors.foreground }]}>
            Total: ₹{totalActual.toFixed(0)} / ₹{totalExpected}
          </Text>
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.background }]}>
        <Button title="Review & Send to Customer" onPress={() => router.push("/product/review" as any)} size="xl" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 14 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.6, marginTop: 8 },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  priceRow: { flexDirection: "row", alignItems: "center", padding: 14, borderWidth: 1, gap: 12 },
  itemInfo: { flex: 1, gap: 4 },
  itemName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  itemUnit: { fontSize: 12, fontFamily: "Inter_400Regular" },
  priceInput: { flexDirection: "row", alignItems: "center" },
  summary: { padding: 14, gap: 4 },
  summaryText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  summaryTotal: { fontSize: 15, fontFamily: "Inter_700Bold" },
  footer: { paddingHorizontal: 20, paddingTop: 12 },
});

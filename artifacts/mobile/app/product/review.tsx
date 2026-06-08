import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";

export default function ProductReviewScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders, activeOrderId } = useOrderStore();
  const order = orders.find((o) => o.id === activeOrderId) ?? orders[1];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Review Order" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Review Before Sending</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          Verify all details are correct before sending to customer for approval
        </Text>
        <Card>
          <Text style={[styles.cardTitle, { color: colors.mutedForeground }]}>ORDER SUMMARY</Text>
          {order?.items.map((item, i) => (
            <View key={item.id} style={[styles.itemRow, { borderBottomColor: colors.border, borderBottomWidth: i < (order?.items.length ?? 0) - 1 ? 1 : 0 }]}>
              <Feather name="check-circle" size={14} color={colors.success} />
              <Text style={[styles.itemName, { color: colors.foreground }]}>{item.quantity}x {item.name}</Text>
              <Text style={[styles.itemPrice, { color: colors.foreground }]}>₹{item.price * item.quantity}</Text>
            </View>
          ))}
          <View style={[styles.total, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.foreground }]}>Total Payable</Text>
            <Text style={[styles.totalVal, { color: colors.foreground }]}>₹{order?.totalAmount}</Text>
          </View>
        </Card>
        <View style={[styles.infoBox, { backgroundColor: colors.primaryLight, borderRadius: colors.radiusSm }]}>
          <Feather name="send" size={14} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.primary }]}>
            This will be sent to the customer for approval. You'll be notified once they confirm.
          </Text>
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.background }]}>
        <Button title="Send for Customer Approval" onPress={() => router.push("/product/approval-pending" as any)} size="xl" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.6, marginTop: 8 },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  cardTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8, marginBottom: 12 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10 },
  itemName: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  itemPrice: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  total: { flexDirection: "row", justifyContent: "space-between", paddingTop: 12, borderTopWidth: 1, marginTop: 4 },
  totalLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  totalVal: { fontSize: 15, fontFamily: "Inter_700Bold" },
  infoBox: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12 },
  infoText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 20 },
  footer: { paddingHorizontal: 20, paddingTop: 12 },
});

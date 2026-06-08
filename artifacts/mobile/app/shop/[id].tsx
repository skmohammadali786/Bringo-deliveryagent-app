import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";

export default function ShopDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders } = useOrderStore();
  const order = orders.find((o) => o.shop.id === id) ?? orders[0];
  const shop = order?.shop;
  const [itemStatus, setItemStatus] = useState<Record<string, "pending" | "confirmed" | "unavailable">>(
    Object.fromEntries(order?.items.map((i) => [i.id, "pending" as const]) ?? [])
  );

  if (!shop) return null;

  const allConfirmed = order?.items.every((i) => itemStatus[i.id] === "confirmed");
  const hasUnavailable = order?.items.some((i) => itemStatus[i.id] === "unavailable");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={shop.name} showBack right={
        <Pressable onPress={() => Linking.openURL(`tel:${shop.phone}`)} style={[styles.callBtn, { backgroundColor: colors.successLight }]}>
          <Feather name="phone" size={16} color={colors.success} />
        </Pressable>
      } />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        {/* Shop Info */}
        <Animated.View entering={FadeInDown.delay(50).duration(400)}>
          <Card style={styles.shopInfo}>
            <View style={styles.shopTop}>
              <View style={[styles.shopIcon, { backgroundColor: colors.primaryLight }]}>
                <Feather name="shopping-bag" size={28} color={colors.primary} />
              </View>
              <View style={styles.shopText}>
                <Text style={[styles.shopName, { color: colors.foreground }]}>{shop.name}</Text>
                <Text style={[styles.shopAddr, { color: colors.mutedForeground }]}>{shop.address}</Text>
                <View style={styles.shopMeta}>
                  <Feather name="star" size={12} color={colors.accent} />
                  <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{shop.rating} • {shop.distance}</Text>
                  <Badge label={shop.category} variant="default" size="sm" />
                </View>
              </View>
            </View>
            <View style={styles.shopActions}>
              <Pressable onPress={() => Linking.openURL(`tel:${shop.phone}`)} style={[styles.shopActionBtn, { backgroundColor: colors.successLight, borderRadius: colors.radiusXs }]}>
                <Feather name="phone" size={16} color={colors.success} />
                <Text style={[styles.shopActionText, { color: colors.success }]}>Call</Text>
              </Pressable>
              <Pressable onPress={() => Linking.openURL(`whatsapp://send?phone=${shop.phone}`)} style={[styles.shopActionBtn, { backgroundColor: "#E7F9F0", borderRadius: colors.radiusXs }]}>
                <Feather name="message-circle" size={16} color="#25D366" />
                <Text style={[styles.shopActionText, { color: "#25D366" }]}>WhatsApp</Text>
              </Pressable>
              <Pressable style={[styles.shopActionBtn, { backgroundColor: colors.primaryLight, borderRadius: colors.radiusXs }]}>
                <Feather name="map-pin" size={16} color={colors.primary} />
                <Text style={[styles.shopActionText, { color: colors.primary }]}>Navigate</Text>
              </Pressable>
            </View>
          </Card>
        </Animated.View>

        {/* Items Checklist */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Collect Items</Text>
          {order?.items.map((item, i) => (
            <View key={item.id} style={[styles.itemCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}>
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: colors.foreground }]}>{item.name}</Text>
                <Text style={[styles.itemDetail, { color: colors.mutedForeground }]}>Qty: {item.quantity} {item.unit ? `• ${item.unit}` : ""} • ₹{item.price}</Text>
              </View>
              <View style={styles.itemActions}>
                {itemStatus[item.id] === "confirmed" ? (
                  <Badge label="Confirmed" variant="success" dot />
                ) : itemStatus[item.id] === "unavailable" ? (
                  <Badge label="Unavailable" variant="destructive" dot />
                ) : (
                  <View style={styles.confirmBtns}>
                    <Pressable onPress={() => setItemStatus((s) => ({ ...s, [item.id]: "confirmed" }))} style={[styles.confirmBtn, { backgroundColor: colors.successLight, borderRadius: 8 }]}>
                      <Feather name="check" size={16} color={colors.success} />
                    </Pressable>
                    <Pressable onPress={() => setItemStatus((s) => ({ ...s, [item.id]: "unavailable" }))} style={[styles.confirmBtn, { backgroundColor: colors.destructiveLight, borderRadius: 8 }]}>
                      <Feather name="x" size={16} color={colors.destructive} />
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          ))}
        </Animated.View>

        {hasUnavailable && (
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <Button title="Suggest Alternate Products" onPress={() => router.push("/shop/alternate-product" as any)} variant="outline" />
          </Animated.View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <Button title="Confirm & Proceed to Pickup" onPress={() => router.push("/product/photo" as any)} disabled={!allConfirmed && !hasUnavailable} size="xl" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  shopInfo: { gap: 16 },
  shopTop: { flexDirection: "row", gap: 14 },
  shopIcon: { width: 60, height: 60, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  shopText: { flex: 1, gap: 4 },
  shopName: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  shopAddr: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  shopMeta: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  metaText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  shopActions: { flexDirection: "row", gap: 8 },
  shopActionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10 },
  shopActionText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  itemCard: { flexDirection: "row", alignItems: "center", padding: 14, borderWidth: 1, marginBottom: 10 },
  itemInfo: { flex: 1, gap: 4 },
  itemName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  itemDetail: { fontSize: 12, fontFamily: "Inter_400Regular" },
  itemActions: {},
  confirmBtns: { flexDirection: "row", gap: 8 },
  confirmBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
  callBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
});

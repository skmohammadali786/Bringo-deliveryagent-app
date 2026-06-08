import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";

export default function ShopScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders, updateOrderStatus } = useOrderStore();
  const [itemStatus, setItemStatus] = useState<Record<string, "available" | "unavailable" | "substituted">>({});
  const [loading, setLoading] = useState(false);

  const order = orders.find((o) => o.shop.id === id && ["accepted", "at_shop"].includes(o.status));

  const handleItemToggle = (itemId: string, status: "available" | "unavailable") => {
    setItemStatus((prev) => ({ ...prev, [itemId]: status }));
  };

  const handleConfirmPickup = async () => {
    if (!order) return;
    const unavailable = Object.values(itemStatus).filter((s) => s === "unavailable").length;
    if (unavailable > 0) {
      Alert.alert(
        "Unavailable Items",
        `${unavailable} item(s) are marked as unavailable. Would you like to suggest alternatives?`,
        [
          { text: "Skip", onPress: () => proceedPickup() },
          { text: "Suggest Alternatives", onPress: () => router.push("/shop/suggested" as any) },
        ]
      );
    } else {
      proceedPickup();
    }
  };

  const proceedPickup = async () => {
    if (!order) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    updateOrderStatus(order.id, "picked_up");
    setLoading(false);
    router.push("/pickup/instructions" as any);
  };

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScreenHeader title="Shop Details" showBack />
        <View style={styles.center}>
          <Feather name="map-pin" size={48} color={colors.mutedForeground} />
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No active order for this shop</Text>
          <Button title="Go Back" onPress={() => router.back()} variant="outline" fullWidth={false} />
        </View>
      </View>
    );
  }

  const allChecked = order.items.every((item) => itemStatus[item.id] !== undefined);
  const confirmedCount = Object.values(itemStatus).filter((s) => s === "available").length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title={order.shop.name}
        showBack
        right={
          <Pressable
            onPress={() => Linking.openURL(`tel:${order.shop.phone}`)}
            style={[styles.callBtn, { backgroundColor: colors.successLight }]}
          >
            <Feather name="phone" size={16} color={colors.success} />
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 120, paddingTop: Platform.OS === "web" ? 12 : 0 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Shop Info */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)}>
          <Card style={styles.shopCard}>
            <View style={styles.shopHeader}>
              <View style={[styles.shopIcon, { backgroundColor: colors.primaryLight }]}>
                <Feather name="shopping-bag" size={24} color={colors.primary} />
              </View>
              <View style={styles.shopInfo}>
                <Text style={[styles.shopName, { color: colors.foreground }]}>{order.shop.name}</Text>
                <Text style={[styles.shopType, { color: colors.primary }]}>{order.shop.type || "Store"}</Text>
                <Text style={[styles.shopAddr, { color: colors.mutedForeground }]} numberOfLines={2}>
                  {order.shop.address}
                </Text>
              </View>
            </View>
            <View style={styles.shopActions}>
              <Pressable
                onPress={() => Linking.openURL(`tel:${order.shop.phone}`)}
                style={[styles.shopBtn, { backgroundColor: colors.successLight, borderRadius: 12 }]}
              >
                <Feather name="phone" size={15} color={colors.success} />
                <Text style={[styles.shopBtnText, { color: colors.success }]}>Call</Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(order.shop.address)}`)
                }
                style={[styles.shopBtn, { backgroundColor: colors.primaryLight, borderRadius: 12 }]}
              >
                <Feather name="navigation" size={15} color={colors.primary} />
                <Text style={[styles.shopBtnText, { color: colors.primary }]}>Directions</Text>
              </Pressable>
              <Pressable
                onPress={() => router.push("/shop/not-available" as any)}
                style={[styles.shopBtn, { backgroundColor: colors.warningLight, borderRadius: 12 }]}
              >
                <Feather name="alert-circle" size={15} color={colors.warning} />
                <Text style={[styles.shopBtnText, { color: colors.warning }]}>Issues</Text>
              </Pressable>
            </View>
          </Card>
        </Animated.View>

        {/* Shop Map */}
        <Animated.View entering={FadeInDown.delay(40).duration(400)}>
          <Card style={styles.shopMapCard}>
            <View style={[styles.mapMockup, { backgroundColor: colors.muted, borderRadius: 12 }]}>
              {/* Simulated map grid */}
              <View style={styles.mapGrid}>
                {Array.from({ length: 6 }).map((_, ri) => (
                  <View key={ri} style={styles.mapGridRow}>
                    {Array.from({ length: 8 }).map((_, ci) => (
                      <View
                        key={ci}
                        style={[
                          styles.mapGridCell,
                          { borderColor: colors.border + "60" },
                          (ri + ci) % 3 === 0 && { backgroundColor: colors.primary + "08" },
                        ]}
                      />
                    ))}
                  </View>
                ))}
              </View>

              {/* Shop pin */}
              <View style={styles.mapPinWrap}>
                <View style={[styles.mapPinOuter, { backgroundColor: colors.primary + "30" }]}>
                  <View style={[styles.mapPinInner, { backgroundColor: colors.primary }]}>
                    <Feather name="shopping-bag" size={14} color="#FFF" />
                  </View>
                </View>
                <View style={[styles.mapPinLabel, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.mapPinLabelText, { color: colors.foreground }]} numberOfLines={1}>
                    {order.shop.name}
                  </Text>
                </View>
              </View>

              {/* Directions button overlay */}
              <Pressable
                onPress={() =>
                  Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(order.shop.address)}`)
                }
                style={[styles.mapDirectionsBtn, { backgroundColor: colors.primary, borderRadius: 12 }]}
              >
                <Feather name="navigation" size={13} color="#FFF" />
                <Text style={styles.mapDirectionsBtnText}>Open in Maps</Text>
              </Pressable>
            </View>
          </Card>
        </Animated.View>

        {/* Progress */}
        <Animated.View entering={FadeInDown.delay(80).duration(400)}>
          <View
            style={[
              styles.progressCard,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm },
            ]}
          >
            <View style={[styles.progressBar, { backgroundColor: colors.muted }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor:
                      confirmedCount === order.items.length && allChecked ? colors.success : colors.primary,
                    width: allChecked
                      ? "100%"
                      : `${(Object.keys(itemStatus).length / order.items.length) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: colors.mutedForeground }]}>
              {Object.keys(itemStatus).length} of {order.items.length} items verified
            </Text>
          </View>
        </Animated.View>

        {/* Items */}
        <Animated.View entering={FadeInDown.delay(120).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Collect These Items</Text>
          <Card padding={0}>
            {order.items.map((item, i) => {
              const status = itemStatus[item.id];
              return (
                <View
                  key={item.id}
                  style={[
                    styles.itemRow,
                    {
                      borderBottomColor: colors.border,
                      borderBottomWidth: i < order.items.length - 1 ? 1 : 0,
                      backgroundColor:
                        status === "available"
                          ? colors.successLight + "80"
                          : status === "unavailable"
                          ? colors.destructiveLight + "80"
                          : "transparent",
                    },
                  ]}
                >
                  <View style={styles.itemLeft}>
                    <View style={[styles.itemQty, { backgroundColor: colors.primaryLight }]}>
                      <Text style={[styles.itemQtyText, { color: colors.primary }]}>{item.quantity}×</Text>
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemName, { color: colors.foreground }]}>{item.name}</Text>
                      {item.unit && (
                        <Text style={[styles.itemUnit, { color: colors.mutedForeground }]}>{item.unit}</Text>
                      )}
                      <Text style={[styles.itemPrice, { color: colors.mutedForeground }]}>
                        ₹{item.price * item.quantity}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.itemActions}>
                    <Pressable
                      onPress={() => handleItemToggle(item.id, "available")}
                      style={[
                        styles.itemBtn,
                        { backgroundColor: status === "available" ? colors.success : colors.muted },
                      ]}
                    >
                      <Feather
                        name="check"
                        size={16}
                        color={status === "available" ? "#FFF" : colors.mutedForeground}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => handleItemToggle(item.id, "unavailable")}
                      style={[
                        styles.itemBtn,
                        { backgroundColor: status === "unavailable" ? colors.destructive : colors.muted },
                      ]}
                    >
                      <Feather
                        name="x"
                        size={16}
                        color={status === "unavailable" ? "#FFF" : colors.mutedForeground}
                      />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </Card>
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeInDown.delay(160).duration(400)} style={styles.quickActions}>
          <Pressable
            onPress={() => router.push("/product/photo" as any)}
            style={[styles.qaBtn, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: 14 }]}
          >
            <Feather name="camera" size={18} color={colors.primary} />
            <Text style={[styles.qaBtnText, { color: colors.foreground }]}>Verify Photo</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/shop/alternate-product" as any)}
            style={[styles.qaBtn, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: 14 }]}
          >
            <Feather name="refresh-cw" size={18} color={colors.accent} />
            <Text style={[styles.qaBtnText, { color: colors.foreground }]}>Substitute</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + 16, borderTopColor: colors.border, backgroundColor: colors.background },
        ]}
      >
        <Button
          title={
            allChecked
              ? "Confirm & Proceed to Pickup"
              : `Verify All Items (${Object.keys(itemStatus).length}/${order.items.length})`
          }
          onPress={handleConfirmPickup}
          loading={loading}
          size="xl"
          disabled={!allChecked}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  emptyText: { fontSize: 16, fontFamily: "Inter_400Regular" },
  content: { paddingHorizontal: 20, gap: 16 },
  callBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  shopCard: { gap: 16 },
  shopHeader: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  shopIcon: { width: 56, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  shopInfo: { flex: 1, gap: 3 },
  shopName: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  shopType: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  shopAddr: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  shopActions: { flexDirection: "row", gap: 8 },
  shopBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, padding: 10 },
  shopBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  /* Shop map */
  shopMapCard: { padding: 0, overflow: "hidden" },
  mapMockup: { height: 180, overflow: "hidden", justifyContent: "center", alignItems: "center" },
  mapGrid: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, flexDirection: "column" },
  mapGridRow: { flex: 1, flexDirection: "row" },
  mapGridCell: { flex: 1, borderWidth: 0.5 },
  mapPinWrap: { alignItems: "center", gap: 6 },
  mapPinOuter: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center" },
  mapPinInner: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  mapPinLabel: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    maxWidth: 160,
  },
  mapPinLabelText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  mapDirectionsBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  mapDirectionsBtnText: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#FFF" },
  /* Progress */
  progressCard: { padding: 14, gap: 10, borderWidth: 1 },
  progressBar: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  progressText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4, marginBottom: 4 },
  /* Items */
  itemRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  itemLeft: { flex: 1, flexDirection: "row", gap: 12, alignItems: "center" },
  itemQty: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  itemQtyText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  itemInfo: { flex: 1, gap: 2 },
  itemName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  itemUnit: { fontSize: 12, fontFamily: "Inter_400Regular" },
  itemPrice: { fontSize: 12, fontFamily: "Inter_500Medium" },
  itemActions: { flexDirection: "row", gap: 8 },
  itemBtn: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  quickActions: { flexDirection: "row", gap: 10 },
  qaBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderWidth: 1 },
  qaBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});

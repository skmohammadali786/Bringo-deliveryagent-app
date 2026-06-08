import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Alert, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";

const STATUS_GRADIENTS: Record<string, string[]> = {
  new: ["#FF9A3D", "#FF6B35"],
  accepted: ["#4A90E2", "#2171CC"],
  at_shop: ["#7C5CFF", "#5C3CDF"],
  picked_up: ["#00BFA6", "#00937F"],
  delivering: ["#4A90E2", "#2171CC"],
  delivered: ["#34C759", "#27A34F"],
  cancelled: ["#FF4D4F", "#D93638"],
  failed: ["#FF4D4F", "#D93638"],
};

const STATUS_STEPS = ["new", "accepted", "at_shop", "picked_up", "delivering", "delivered"];

export default function OrderDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrder, acceptOrder, rejectOrder, updateOrderStatus } = useOrderStore();
  const order = getOrder(id ?? "");
  const [loading, setLoading] = useState(false);

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScreenHeader title="Order Details" showBack />
        <View style={styles.center}>
          <Feather name="package" size={48} color={colors.mutedForeground} />
          <Text style={[styles.notFound, { color: colors.mutedForeground }]}>Order not found</Text>
        </View>
      </View>
    );
  }

  const handleAccept = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    acceptOrder(order.id);
    setLoading(false);
    router.push(`/shop/${order.shop.id}` as any);
  };

  const handleReject = () => {
    Alert.alert("Reject Order", "Are you sure you want to reject this order?", [
      { text: "Cancel", style: "cancel" },
      { text: "Reject", style: "destructive", onPress: () => { rejectOrder(order.id); router.back(); } },
    ]);
  };

  const getNextAction = () => {
    switch (order.status) {
      case "new": return null;
      case "accepted": return { label: "I'm at the Shop", nextStatus: "at_shop" as const, route: `/shop/${order.shop.id}` };
      case "at_shop": return { label: "All Items Confirmed — Pickup", nextStatus: "picked_up" as const, route: "/pickup/instructions" };
      case "picked_up": return { label: "Start Delivery", nextStatus: "delivering" as const, route: "/delivery/navigate" };
      case "delivering": return { label: "Verify Delivery OTP", nextStatus: "delivered" as const, route: "/delivery/otp" };
      default: return null;
    }
  };

  const nextAction = getNextAction();
  const gradientColors = STATUS_GRADIENTS[order.status] ?? ["#4A90E2", "#2171CC"];
  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title={`Order ${order.orderNumber}`}
        showBack
        right={
          <Pressable
            onPress={() => Linking.openURL(`tel:${order.customer.phone}`)}
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
        {/* Status Banner */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)}>
          <LinearGradient
            colors={gradientColors as any}
            style={[styles.statusBanner, { borderRadius: colors.radiusSm }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View>
              <Text style={styles.statusLabel}>STATUS</Text>
              <Text style={styles.statusValue}>
                {order.status.replace(/_/g, " ").toUpperCase()}
              </Text>
            </View>
            <View style={styles.statusRight}>
              <Feather name="clock" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.statusTime}>Est. {order.estimatedTime}</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Progress Steps */}
        {!["delivered", "cancelled", "failed"].includes(order.status) && (
          <Animated.View entering={FadeInDown.delay(60).duration(400)}>
            <Card style={styles.stepsCard}>
              <View style={styles.stepsRow}>
                {["Request", "Shop", "Pickup", "Delivery"].map((step, i) => {
                  const isActive = currentStep > i;
                  const isCurrent = currentStep === i + 1 || (i === 0 && currentStep === 0);
                  return (
                    <View key={step} style={styles.stepItem}>
                      <View style={[
                        styles.stepCircle,
                        {
                          backgroundColor: isActive ? colors.success : isCurrent ? colors.primary : colors.muted,
                          borderColor: isActive ? colors.success : isCurrent ? colors.primary : colors.border,
                        }
                      ]}>
                        {isActive ? (
                          <Feather name="check" size={12} color="#FFF" />
                        ) : (
                          <Text style={[styles.stepNum, { color: isCurrent ? "#FFF" : colors.mutedForeground }]}>
                            {i + 1}
                          </Text>
                        )}
                      </View>
                      <Text style={[styles.stepLabel, { color: isActive || isCurrent ? colors.foreground : colors.mutedForeground }]}>
                        {step}
                      </Text>
                      {i < 3 && <View style={[styles.stepLine, { backgroundColor: isActive ? colors.success : colors.border }]} />}
                    </View>
                  );
                })}
              </View>
            </Card>
          </Animated.View>
        )}

        {/* Earnings Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Card style={[styles.earningsCard, { backgroundColor: colors.successLight, borderColor: colors.success + "30" }]}>
            <View style={styles.earningsLeft}>
              <Feather name="trending-up" size={20} color={colors.success} />
              <View>
                <Text style={[styles.earningsLabel, { color: colors.success }]}>Your Earning</Text>
                <Text style={[styles.earningsValue, { color: colors.success }]}>₹{order.deliveryFee}</Text>
              </View>
            </View>
            <View style={styles.earningsRight}>
              <View style={styles.metaTag}>
                <Feather name="navigation" size={12} color={colors.mutedForeground} />
                <Text style={[styles.metaTagText, { color: colors.mutedForeground }]}>{order.distance}</Text>
              </View>
              {order.priority === "express" && (
                <View style={[styles.priorityTag, { backgroundColor: "#FF4D4F18" }]}>
                  <Text style={[styles.priorityText, { color: "#FF4D4F" }]}>EXPRESS</Text>
                </View>
              )}
            </View>
          </Card>
        </Animated.View>

        {/* Pickup */}
        <Animated.View entering={FadeInDown.delay(140).duration(400)}>
          <Card>
            <Text style={[styles.cardSection, { color: colors.mutedForeground }]}>PICKUP FROM</Text>
            <Text style={[styles.shopName, { color: colors.foreground }]}>{order.shop.name}</Text>
            {order.shop.type && (
              <Text style={[styles.shopType, { color: colors.primary }]}>{order.shop.type}</Text>
            )}
            <Text style={[styles.shopAddr, { color: colors.mutedForeground }]}>{order.shop.address}</Text>
            <View style={styles.actionBtns}>
              <Pressable
                onPress={() => Linking.openURL(`tel:${order.shop.phone}`)}
                style={[styles.actionBtn, { backgroundColor: colors.successLight, borderRadius: colors.radiusXs }]}
              >
                <Feather name="phone" size={14} color={colors.success} />
                <Text style={[styles.actionBtnText, { color: colors.success }]}>Call Shop</Text>
              </Pressable>
              <Pressable
                onPress={() => router.push(`/shop/${order.shop.id}` as any)}
                style={[styles.actionBtn, { backgroundColor: colors.primaryLight, borderRadius: colors.radiusXs }]}
              >
                <Feather name="navigation" size={14} color={colors.primary} />
                <Text style={[styles.actionBtnText, { color: colors.primary }]}>Navigate</Text>
              </Pressable>
            </View>
          </Card>
        </Animated.View>

        {/* Order Items */}
        <Animated.View entering={FadeInDown.delay(180).duration(400)}>
          <Card>
            <Text style={[styles.cardSection, { color: colors.mutedForeground }]}>
              ORDER ITEMS ({order.items.length})
            </Text>
            {order.items.map((item, i) => (
              <View
                key={item.id}
                style={[
                  styles.itemRow,
                  { borderBottomColor: colors.border, borderBottomWidth: i < order.items.length - 1 ? 1 : 0 },
                ]}
              >
                <View style={[styles.itemQtyBadge, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.itemQtyText, { color: colors.primary }]}>{item.quantity}×</Text>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, { color: colors.foreground }]}>{item.name}</Text>
                  {item.unit && <Text style={[styles.itemUnit, { color: colors.mutedForeground }]}>{item.unit}</Text>}
                </View>
                <Text style={[styles.itemPrice, { color: colors.foreground }]}>
                  ₹{item.price * item.quantity}
                </Text>
              </View>
            ))}
            <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
              <Text style={[styles.totalLabel, { color: colors.foreground }]}>Order Total</Text>
              <Text style={[styles.totalValue, { color: colors.foreground }]}>₹{order.totalAmount}</Text>
            </View>
          </Card>
        </Animated.View>

        {/* Deliver To */}
        <Animated.View entering={FadeInDown.delay(220).duration(400)}>
          <Card>
            <Text style={[styles.cardSection, { color: colors.mutedForeground }]}>DELIVER TO</Text>
            <Text style={[styles.customerName, { color: colors.foreground }]}>{order.customer.name}</Text>
            <Text style={[styles.customerAddr, { color: colors.mutedForeground }]}>{order.customer.address}</Text>
            {order.customer.landmark && (
              <View style={[styles.landmarkRow, { backgroundColor: colors.muted, borderRadius: 10 }]}>
                <Feather name="map-pin" size={14} color={colors.mutedForeground} />
                <Text style={[styles.landmark, { color: colors.mutedForeground }]}>{order.customer.landmark}</Text>
              </View>
            )}
            <View style={styles.deliveryMeta}>
              {order.paymentMode === "cod" ? (
                <View style={[styles.paymentTag, { backgroundColor: colors.warningLight }]}>
                  <MaterialCommunityIcons name="currency-inr" size={14} color={colors.warning} />
                  <Text style={[styles.paymentText, { color: colors.warning }]}>COD ₹{order.codAmount}</Text>
                </View>
              ) : (
                <View style={[styles.paymentTag, { backgroundColor: colors.successLight }]}>
                  <Feather name="check-circle" size={14} color={colors.success} />
                  <Text style={[styles.paymentText, { color: colors.success }]}>Prepaid</Text>
                </View>
              )}
              <Pressable
                onPress={() => Linking.openURL(`tel:${order.customer.phone}`)}
                style={[styles.callCustomerBtn, { backgroundColor: colors.successLight, borderRadius: 10 }]}
              >
                <Feather name="phone" size={14} color={colors.success} />
                <Text style={[styles.callCustomerText, { color: colors.success }]}>Call Customer</Text>
              </Pressable>
            </View>
          </Card>
        </Animated.View>

        {/* Instructions */}
        {order.instructions && (
          <Animated.View entering={FadeInDown.delay(260).duration(400)}>
            <Card style={[styles.instructionsCard, { backgroundColor: colors.accentLight, borderColor: colors.accent + "30" }]}>
              <Feather name="message-circle" size={18} color={colors.accent} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.instrLabel, { color: colors.accent }]}>SPECIAL INSTRUCTIONS</Text>
                <Text style={[styles.instrText, { color: colors.foreground }]}>{order.instructions}</Text>
              </View>
            </Card>
          </Animated.View>
        )}
      </ScrollView>

      {/* CTA Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, borderTopColor: colors.border, backgroundColor: colors.background }]}>
        {order.status === "new" ? (
          <View style={styles.newOrderBtns}>
            <Button title="Reject" onPress={handleReject} variant="outline" style={{ flex: 1 }} />
            <Button
              title="Accept Order"
              onPress={handleAccept}
              loading={loading}
              style={{ flex: 2 }}
              size="xl"
            />
          </View>
        ) : nextAction ? (
          <Button
            title={nextAction.label}
            onPress={() => {
              updateOrderStatus(order.id, nextAction.nextStatus);
              router.push(nextAction.route as any);
            }}
            size="xl"
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  notFound: { fontSize: 16, fontFamily: "Inter_400Regular" },
  content: { paddingHorizontal: 20, gap: 14 },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBanner: {
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", color: "rgba(255,255,255,0.7)", letterSpacing: 0.8 },
  statusValue: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#FFF", letterSpacing: -0.4, marginTop: 2 },
  statusRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusTime: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "rgba(255,255,255,0.9)" },
  stepsCard: { padding: 16 },
  stepsRow: { flexDirection: "row", alignItems: "center" },
  stepItem: { flex: 1, alignItems: "center", position: "relative" },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    marginBottom: 6,
    zIndex: 1,
  },
  stepNum: { fontSize: 12, fontFamily: "Inter_700Bold" },
  stepLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  stepLine: {
    position: "absolute",
    top: 14,
    right: "-50%",
    width: "100%",
    height: 2,
    zIndex: 0,
  },
  earningsCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
  },
  earningsLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  earningsLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  earningsValue: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -1 },
  earningsRight: { alignItems: "flex-end", gap: 8 },
  metaTag: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaTagText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  priorityTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  priorityText: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  cardSection: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.8, marginBottom: 10 },
  shopName: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  shopType: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginTop: 2, marginBottom: 4 },
  shopAddr: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20, marginBottom: 14 },
  actionBtns: { flexDirection: "row", gap: 10 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 11,
  },
  actionBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    gap: 12,
  },
  itemQtyBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, minWidth: 32, alignItems: "center" },
  itemQtyText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  itemInfo: { flex: 1, gap: 2 },
  itemName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  itemUnit: { fontSize: 12, fontFamily: "Inter_400Regular" },
  itemPrice: { fontSize: 14, fontFamily: "Inter_700Bold" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1,
  },
  totalLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  totalValue: { fontSize: 15, fontFamily: "Inter_700Bold" },
  customerName: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  customerAddr: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20, marginTop: 4, marginBottom: 10 },
  landmarkRow: { flexDirection: "row", alignItems: "center", gap: 6, padding: 10, marginBottom: 12 },
  landmark: { fontSize: 13, fontFamily: "Inter_400Regular" },
  deliveryMeta: { flexDirection: "row", gap: 10, alignItems: "center" },
  paymentTag: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  paymentText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  callCustomerBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 6 },
  callCustomerText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  instructionsCard: { flexDirection: "row", alignItems: "flex-start", gap: 12, borderWidth: 1 },
  instrLabel: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.6, marginBottom: 4 },
  instrText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
  newOrderBtns: { flexDirection: "row", gap: 12 },
});

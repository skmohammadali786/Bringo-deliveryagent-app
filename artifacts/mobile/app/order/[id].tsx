import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Alert, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";

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

  const handleCall = () => {
    Linking.openURL(`tel:${order.customer.phone}`);
  };

  const getNextAction = () => {
    switch (order.status) {
      case "new": return null;
      case "accepted": return { label: "I'm at the shop", nextStatus: "at_shop" as const, route: `/shop/${order.shop.id}` };
      case "at_shop": return { label: "Products Confirmed — Pickup", nextStatus: "picked_up" as const, route: `/pickup/instructions` };
      case "picked_up": return { label: "Start Delivery", nextStatus: "delivering" as const, route: `/delivery/navigate` };
      case "delivering": return { label: "Deliver OTP", nextStatus: "delivered" as const, route: `/delivery/otp` };
      default: return null;
    }
  };

  const nextAction = getNextAction();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={`Order ${order.orderNumber}`} showBack right={
        <Pressable onPress={handleCall} style={[styles.callBtn, { backgroundColor: colors.successLight }]}>
          <Feather name="phone" size={16} color={colors.success} />
        </Pressable>
      } />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120, paddingTop: Platform.OS === "web" ? 20 : 0 }]} showsVerticalScrollIndicator={false}>

        {/* Status Banner */}
        <Animated.View entering={FadeInDown.delay(50).duration(400)}>
          <LinearGradient
            colors={order.status === "new" ? ["#FF9F0A", "#FF6B35"] : order.status === "delivered" ? ["#34C759", "#27A34F"] : ["#007AFF", "#0055CC"]}
            style={[styles.statusBanner, { borderRadius: colors.radiusSm }]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            <Text style={styles.statusText}>{order.status.replace("_", " ").toUpperCase()}</Text>
            <Text style={styles.statusTime}>Est. {order.estimatedTime}</Text>
          </LinearGradient>
        </Animated.View>

        {/* Shop Info */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Card>
            <Text style={[styles.cardTitle, { color: colors.mutedForeground }]}>PICKUP FROM</Text>
            <Text style={[styles.shopName, { color: colors.foreground }]}>{order.shop.name}</Text>
            <Text style={[styles.shopAddr, { color: colors.mutedForeground }]}>{order.shop.address}</Text>
            <View style={styles.shopActions}>
              <Pressable onPress={() => Linking.openURL(`tel:${order.shop.phone}`)} style={[styles.shopBtn, { backgroundColor: colors.successLight, borderRadius: colors.radiusXs }]}>
                <Feather name="phone" size={14} color={colors.success} />
                <Text style={[styles.shopBtnText, { color: colors.success }]}>Call Shop</Text>
              </Pressable>
              <Pressable onPress={() => router.push(`/shop/${order.shop.id}` as any)} style={[styles.shopBtn, { backgroundColor: colors.primaryLight, borderRadius: colors.radiusXs }]}>
                <Feather name="navigation" size={14} color={colors.primary} />
                <Text style={[styles.shopBtnText, { color: colors.primary }]}>Navigate</Text>
              </Pressable>
            </View>
          </Card>
        </Animated.View>

        {/* Items */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <Card>
            <Text style={[styles.cardTitle, { color: colors.mutedForeground }]}>ORDER ITEMS</Text>
            {order.items.map((item, i) => (
              <View key={item.id} style={[styles.itemRow, { borderBottomColor: colors.border, borderBottomWidth: i < order.items.length - 1 ? 1 : 0 }]}>
                <View style={styles.itemLeft}>
                  <Text style={[styles.itemQty, { color: colors.primary }]}>{item.quantity}x</Text>
                  <View>
                    <Text style={[styles.itemName, { color: colors.foreground }]}>{item.name}</Text>
                    {item.unit && <Text style={[styles.itemUnit, { color: colors.mutedForeground }]}>{item.unit}</Text>}
                  </View>
                </View>
                <Text style={[styles.itemPrice, { color: colors.foreground }]}>₹{item.price * item.quantity}</Text>
              </View>
            ))}
            <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
              <Text style={[styles.totalLabel, { color: colors.foreground }]}>Total</Text>
              <Text style={[styles.totalVal, { color: colors.foreground }]}>₹{order.totalAmount}</Text>
            </View>
          </Card>
        </Animated.View>

        {/* Delivery Info */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Card>
            <Text style={[styles.cardTitle, { color: colors.mutedForeground }]}>DELIVER TO</Text>
            <Text style={[styles.customerName, { color: colors.foreground }]}>{order.customer.name}</Text>
            <Text style={[styles.customerAddr, { color: colors.mutedForeground }]}>{order.customer.address}</Text>
            {order.customer.landmark && <Text style={[styles.landmark, { color: colors.mutedForeground }]}>📍 {order.customer.landmark}</Text>}
            <View style={styles.deliveryMeta}>
              <View style={styles.metaItem}>
                <Feather name="navigation" size={14} color={colors.mutedForeground} />
                <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{order.distance}</Text>
              </View>
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name={order.paymentMode === "cod" ? "currency-inr" : "check-circle"} size={14} color={order.paymentMode === "cod" ? colors.warning : colors.success} />
                <Text style={[styles.metaText, { color: order.paymentMode === "cod" ? colors.warning : colors.success }]}>
                  {order.paymentMode === "cod" ? `COD ₹${order.codAmount}` : "Prepaid"}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Earnings */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)}>
          <Card style={[styles.earningsCard, { backgroundColor: colors.successLight }]}>
            <Feather name="trending-up" size={20} color={colors.success} />
            <View>
              <Text style={[styles.earningsLabel, { color: colors.success }]}>Your Earning</Text>
              <Text style={[styles.earningsVal, { color: colors.success }]}>₹{order.deliveryFee}</Text>
            </View>
          </Card>
        </Animated.View>

        {/* Instructions */}
        {order.instructions && (
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <Card>
              <Text style={[styles.cardTitle, { color: colors.mutedForeground }]}>INSTRUCTIONS</Text>
              <Text style={[styles.instructions, { color: colors.foreground }]}>{order.instructions}</Text>
            </Card>
          </Animated.View>
        )}
      </ScrollView>

      {/* Footer Actions */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        {order.status === "new" ? (
          <View style={styles.newOrderActions}>
            <Button title="Reject" onPress={handleReject} variant="outline" style={{ flex: 1 }} />
            <Button title="Accept Order" onPress={handleAccept} loading={loading} style={{ flex: 2 }} />
          </View>
        ) : nextAction ? (
          <Button title={nextAction.label} onPress={() => { updateOrderStatus(order.id, nextAction.nextStatus); router.push(nextAction.route as any); }} size="xl" />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFound: { fontSize: 16, fontFamily: "Inter_400Regular" },
  content: { paddingHorizontal: 20, gap: 14 },
  statusBanner: { padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statusText: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#FFF", letterSpacing: 0.5 },
  statusTime: { fontSize: 13, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.8)" },
  cardTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8, marginBottom: 10 },
  shopName: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4, marginBottom: 4 },
  shopAddr: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20, marginBottom: 12 },
  shopActions: { flexDirection: "row", gap: 10 },
  shopBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, padding: 10 },
  shopBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  itemRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 },
  itemLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  itemQty: { fontSize: 14, fontFamily: "Inter_700Bold", width: 24 },
  itemName: { fontSize: 14, fontFamily: "Inter_500Medium" },
  itemUnit: { fontSize: 12, fontFamily: "Inter_400Regular" },
  itemPrice: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingTop: 12, borderTopWidth: 1, marginTop: 4 },
  totalLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  totalVal: { fontSize: 15, fontFamily: "Inter_700Bold" },
  customerName: { fontSize: 17, fontFamily: "Inter_700Bold", letterSpacing: -0.3, marginBottom: 4 },
  customerAddr: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  landmark: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 4 },
  deliveryMeta: { flexDirection: "row", gap: 16, marginTop: 12 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  earningsCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  earningsLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  earningsVal: { fontSize: 24, fontFamily: "Inter_700Bold", letterSpacing: -0.6 },
  instructions: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
  newOrderActions: { flexDirection: "row", gap: 12 },
  callBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
});

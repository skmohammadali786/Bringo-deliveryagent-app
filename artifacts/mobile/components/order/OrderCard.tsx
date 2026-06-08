import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Order } from "@/store/orderStore";
import { Badge } from "@/components/ui/Badge";

interface OrderCardProps {
  order: Order;
  compact?: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  new: "New Order",
  accepted: "Active",
  at_shop: "At Shop",
  picked_up: "Picked Up",
  delivering: "Delivering",
  delivered: "Delivered",
  cancelled: "Cancelled",
  failed: "Failed",
};

const STATUS_VARIANTS: Record<string, "success" | "warning" | "destructive" | "primary" | "default"> = {
  new: "warning",
  accepted: "primary",
  at_shop: "primary",
  picked_up: "accent" as any,
  delivering: "primary",
  delivered: "success",
  cancelled: "destructive",
  failed: "destructive",
};

export function OrderCard({ order, compact }: OrderCardProps) {
  const colors = useColors();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/order/${order.id}` as any)}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          borderColor: colors.border,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 10,
          elevation: 3,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.orderInfo}>
          <Text style={[styles.orderNum, { color: colors.mutedForeground }]}>
            {order.orderNumber}
          </Text>
          <Text style={[styles.shopName, { color: colors.foreground }]}>
            {order.shop.name}
          </Text>
        </View>
        <Badge
          label={STATUS_LABELS[order.status] || order.status}
          variant={STATUS_VARIANTS[order.status] || "default"}
          dot
        />
      </View>

      {!compact && (
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
      )}

      {!compact && (
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Feather name="map-pin" size={14} color={colors.mutedForeground} />
            <Text style={[styles.detailText, { color: colors.mutedForeground }]} numberOfLines={1}>
              {order.customer.address}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Feather name="package" size={14} color={colors.mutedForeground} />
            <Text style={[styles.detailText, { color: colors.mutedForeground }]}>
              {order.items.length} item{order.items.length !== 1 ? "s" : ""}
            </Text>
            <View style={styles.dot} />
            <Feather name="navigation" size={14} color={colors.mutedForeground} />
            <Text style={[styles.detailText, { color: colors.mutedForeground }]}>
              {order.distance}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.earningsRow}>
          <MaterialCommunityIcons name="currency-inr" size={16} color={colors.success} />
          <Text style={[styles.earnings, { color: colors.success }]}>
            {order.deliveryFee}
          </Text>
          <Text style={[styles.earningsLabel, { color: colors.mutedForeground }]}>
            delivery fee
          </Text>
        </View>
        <View style={styles.timeRow}>
          <Feather name="clock" size={13} color={colors.mutedForeground} />
          <Text style={[styles.time, { color: colors.mutedForeground }]}>
            {order.estimatedTime}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderInfo: { flex: 1, marginRight: 12 },
  orderNum: { fontSize: 11, fontFamily: "Inter_500Medium", letterSpacing: 0.5, marginBottom: 2 },
  shopName: { fontSize: 16, fontFamily: "Inter_600SemiBold", letterSpacing: -0.3 },
  divider: { height: 1, marginBottom: 12 },
  details: { gap: 6, marginBottom: 12 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  detailText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1 },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: "#ccc" },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  earningsRow: { flexDirection: "row", alignItems: "center", gap: 2 },
  earnings: { fontSize: 16, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  earningsLabel: { fontSize: 12, fontFamily: "Inter_400Regular", marginLeft: 2 },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  time: { fontSize: 13, fontFamily: "Inter_400Regular" },
});

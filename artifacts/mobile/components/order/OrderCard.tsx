import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Order, OrderStatus } from "@/store/orderStore";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  new: { label: "New Request", color: "#FF9A3D", icon: "bell" },
  accepted: { label: "Accepted", color: "#4A90E2", icon: "check-circle" },
  at_shop: { label: "At Shop", color: "#7C5CFF", icon: "map-pin" },
  picked_up: { label: "Picked Up", color: "#00BFA6", icon: "package" },
  delivering: { label: "Delivering", color: "#4A90E2", icon: "navigation" },
  delivered: { label: "Delivered", color: "#34C759", icon: "check" },
  cancelled: { label: "Cancelled", color: "#FF4D4F", icon: "x-circle" },
  failed: { label: "Failed", color: "#FF4D4F", icon: "alert-circle" },
};

interface Props {
  order: Order;
  compact?: boolean;
}

export function OrderCard({ order, compact = false }: Props) {
  const colors = useColors();
  const router = useRouter();
  const cfg = STATUS_CONFIG[order.status];

  if (compact) {
    return (
      <Pressable
        onPress={() => router.push(`/order/${order.id}` as any)}
        style={[styles.compactCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}
      >
        <View style={[styles.compactIcon, { backgroundColor: cfg.color + "18" }]}>
          <Feather name={cfg.icon as any} size={16} color={cfg.color} />
        </View>
        <View style={styles.compactInfo}>
          <Text style={[styles.compactOrderNum, { color: colors.foreground }]}>{order.orderNumber}</Text>
          <Text style={[styles.compactShop, { color: colors.mutedForeground }]} numberOfLines={1}>
            {order.shop.name}
          </Text>
        </View>
        <View style={styles.compactRight}>
          <Text style={[styles.compactEarning, { color: colors.success }]}>+₹{order.deliveryFee}</Text>
          <Text style={[styles.compactStatus, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => router.push(`/order/${order.id}` as any)}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: order.status === "new" ? cfg.color + "50" : colors.border,
          borderRadius: colors.radius,
          borderWidth: order.status === "new" ? 1.5 : 1,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.orderNum, { color: colors.foreground }]}>{order.orderNumber}</Text>
          {order.priority === "express" && (
            <View style={[styles.priorityTag, { backgroundColor: "#FF4D4F18" }]}>
              <Text style={[styles.priorityText, { color: "#FF4D4F" }]}>EXPRESS</Text>
            </View>
          )}
        </View>
        <View style={[styles.statusBadge, { backgroundColor: cfg.color + "18" }]}>
          <Feather name={cfg.icon as any} size={11} color={cfg.color} />
          <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>

      {/* Route */}
      <View style={styles.route}>
        <View style={styles.routeRow}>
          <View style={[styles.routeDot, { backgroundColor: colors.primary }]} />
          <View style={styles.routeDetails}>
            <Text style={[styles.routeHint, { color: colors.mutedForeground }]}>PICKUP</Text>
            <Text style={[styles.routeName, { color: colors.foreground }]} numberOfLines={1}>
              {order.shop.name}
            </Text>
          </View>
        </View>
        <View style={[styles.routeLine, { backgroundColor: colors.border }]} />
        <View style={styles.routeRow}>
          <View style={[styles.routeDot, { backgroundColor: colors.success }]} />
          <View style={styles.routeDetails}>
            <Text style={[styles.routeHint, { color: colors.mutedForeground }]}>DELIVER TO</Text>
            <Text style={[styles.routeName, { color: colors.foreground }]} numberOfLines={1}>
              {order.customer.name}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <View style={styles.footerLeft}>
          <View style={styles.metaItem}>
            <Feather name="navigation" size={11} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{order.distance}</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="clock" size={11} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{order.estimatedTime}</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="package" size={11} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </Text>
          </View>
          {order.paymentMode === "cod" && (
            <View style={[styles.codTag, { backgroundColor: colors.warningLight }]}>
              <Text style={[styles.codText, { color: colors.warning }]}>COD</Text>
            </View>
          )}
        </View>
        <View style={[styles.earningPill, { backgroundColor: colors.successLight }]}>
          <Text style={[styles.earningText, { color: colors.success }]}>+₹{order.deliveryFee}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 12,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  orderNum: { fontSize: 15, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  priorityTag: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  priorityText: { fontSize: 9, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  route: { paddingHorizontal: 16, paddingBottom: 14 },
  routeRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  routeLine: { width: 1.5, height: 14, marginLeft: 6, marginVertical: 3 },
  routeDot: { width: 14, height: 14, borderRadius: 7 },
  routeDetails: { flex: 1 },
  routeHint: { fontSize: 9, fontFamily: "Inter_700Bold", letterSpacing: 0.6 },
  routeName: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginTop: 1 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  footerLeft: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  codTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  codText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  earningPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  earningText: { fontSize: 14, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  compactCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  compactIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  compactInfo: { flex: 1, gap: 3 },
  compactOrderNum: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  compactShop: { fontSize: 12, fontFamily: "Inter_400Regular" },
  compactRight: { alignItems: "flex-end", gap: 3 },
  compactEarning: { fontSize: 14, fontFamily: "Inter_700Bold" },
  compactStatus: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
});

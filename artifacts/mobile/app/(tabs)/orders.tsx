import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OrderCard } from "@/components/order/OrderCard";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useColors } from "@/hooks/useColors";
import { useOrderStore, OrderStatus } from "@/store/orderStore";

const TABS = [
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
] as const;

type TabKey = "active" | "completed" | "cancelled";

export default function OrdersScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders } = useOrderStore();
  const [tab, setTab] = useState<TabKey>("active");

  const getOrders = () => {
    if (tab === "active") return orders.filter((o) => ["new", "accepted", "at_shop", "picked_up", "delivering"].includes(o.status));
    if (tab === "completed") return orders.filter((o) => o.status === "delivered");
    return orders.filter((o) => ["cancelled", "failed"].includes(o.status));
  };

  const filtered = getOrders();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16), borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Orders</Text>
        <Pressable onPress={() => router.push("/order/queue" as any)} style={[styles.queueBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="list" size={18} color={colors.foreground} />
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
        {TABS.map((t) => {
          const count = t.key === "active"
            ? orders.filter((o) => ["new", "accepted", "at_shop", "picked_up", "delivering"].includes(o.status)).length
            : t.key === "completed"
            ? orders.filter((o) => o.status === "delivered").length
            : orders.filter((o) => ["cancelled", "failed"].includes(o.status)).length;

          return (
            <Pressable
              key={t.key}
              onPress={() => setTab(t.key)}
              style={[styles.tabItem, { borderBottomColor: tab === t.key ? colors.primary : "transparent" }]}
            >
              <View style={styles.tabInner}>
                <Text style={[styles.tabLabel, { color: tab === t.key ? colors.primary : colors.mutedForeground }]}>
                  {t.label}
                </Text>
                {count > 0 && <Badge label={count.toString()} variant={tab === t.key ? "primary" : "default"} />}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Order List */}
      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon="package"
            title={`No ${tab} orders`}
            subtitle={tab === "active" ? "Go online to receive new delivery orders" : "Your order history will appear here"}
            actionLabel={tab === "active" ? "Go Online" : undefined}
          />
        ) : (
          filtered.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.8 },
  queueBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  tabs: { flexDirection: "row", borderBottomWidth: 1 },
  tabItem: { flex: 1, alignItems: "center", paddingVertical: 14, borderBottomWidth: 2.5 },
  tabInner: { flexDirection: "row", alignItems: "center", gap: 6 },
  tabLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  list: { paddingHorizontal: 20, paddingTop: 16, gap: 0 },
});

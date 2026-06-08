import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OrderCard } from "@/components/order/OrderCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";
import { fadeInDown } from "@/constants/animations";

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
  const [refreshing, setRefreshing] = useState(false);

  const getFiltered = () => {
    if (tab === "active")
      return orders.filter((o) =>
        ["new", "accepted", "at_shop", "picked_up", "delivering"].includes(o.status)
      );
    if (tab === "completed") return orders.filter((o) => o.status === "delivered");
    return orders.filter((o) => ["cancelled", "failed"].includes(o.status));
  };

  const counts = {
    active: orders.filter((o) =>
      ["new", "accepted", "at_shop", "picked_up", "delivering"].includes(o.status)
    ).length,
    completed: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => ["cancelled", "failed"].includes(o.status)).length,
  };

  const filtered = getFiltered();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16),
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>Orders</Text>
        <Pressable
          onPress={() => router.push("/order/queue" as any)}
          style={[styles.queueBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Feather name="list" size={18} color={colors.foreground} />
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={[styles.tabRow, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        {TABS.map((t) => (
          <Pressable
            key={t.key}
            onPress={() => setTab(t.key)}
            style={[styles.tab, { borderBottomColor: tab === t.key ? colors.primary : "transparent" }]}
          >
            <Text style={[styles.tabLabel, { color: tab === t.key ? colors.primary : colors.mutedForeground }]}>
              {t.label}
            </Text>
            {counts[t.key] > 0 && (
              <View
                style={[
                  styles.tabCount,
                  { backgroundColor: tab === t.key ? colors.primary : colors.muted },
                ]}
              >
                <Text
                  style={[
                    styles.tabCountText,
                    { color: tab === t.key ? "#FFF" : colors.mutedForeground },
                  ]}
                >
                  {counts[t.key]}
                </Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>

      {/* List */}
      <ScrollView
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon="package"
            title={`No ${tab} orders`}
            subtitle={
              tab === "active"
                ? "Go online to receive delivery orders"
                : `Your ${tab} orders will appear here`
            }
            actionLabel={tab === "active" ? "Go Online" : undefined}
          />
        ) : (
          filtered.map((order, i) => (
            <Animated.View
              key={order.id}
              entering={fadeInDown(i)}
            >
              <OrderCard order={order} />
            </Animated.View>
          ))
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
  title: { fontSize: 32, fontFamily: "Inter_700Bold", letterSpacing: -1 },
  queueBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderBottomWidth: 2.5,
  },
  tabLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  tabCount: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  tabCountText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  list: { paddingHorizontal: 20, paddingTop: 16, gap: 0 },
});

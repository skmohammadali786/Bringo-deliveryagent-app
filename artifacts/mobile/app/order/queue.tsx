import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OrderCard } from "@/components/order/OrderCard";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";

export default function OrderQueueScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders } = useOrderStore();

  const activeOrders = orders.filter((o) => ["new", "accepted", "at_shop", "picked_up", "delivering"].includes(o.status));
  const newOrders = orders.filter((o) => o.status === "new");
  const inProgress = orders.filter((o) => ["accepted", "at_shop", "picked_up", "delivering"].includes(o.status));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Order Queue" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 16 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)}>
          <View style={styles.statsRow}>
            {[
              { label: "New Requests", value: newOrders.length, color: colors.warning, icon: "bell" },
              { label: "In Progress", value: inProgress.length, color: colors.primary, icon: "navigation" },
              { label: "Total Active", value: activeOrders.length, color: colors.success, icon: "package" },
            ].map((s) => (
              <Card key={s.label} style={styles.statCard} shadow>
                <View style={[styles.statIcon, { backgroundColor: s.color + "18" }]}>
                  <Feather name={s.icon as any} size={16} color={s.color} />
                </View>
                <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
              </Card>
            ))}
          </View>
        </Animated.View>

        {/* New Requests */}
        {newOrders.length > 0 && (
          <Animated.View entering={FadeInDown.delay(80).duration(400)}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLeft}>
                <View style={[styles.sectionDot, { backgroundColor: colors.warning }]} />
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>New Requests</Text>
              </View>
              <View style={[styles.countBadge, { backgroundColor: colors.warningLight }]}>
                <Text style={[styles.countText, { color: colors.warning }]}>{newOrders.length}</Text>
              </View>
            </View>
            {newOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </Animated.View>
        )}

        {/* In Progress */}
        {inProgress.length > 0 && (
          <Animated.View entering={FadeInDown.delay(160).duration(400)}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLeft}>
                <View style={[styles.sectionDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>In Progress</Text>
              </View>
              <View style={[styles.countBadge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.countText, { color: colors.primary }]}>{inProgress.length}</Text>
              </View>
            </View>
            {inProgress.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </Animated.View>
        )}

        {/* Empty State */}
        {activeOrders.length === 0 && (
          <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.muted }]}>
              <Feather name="inbox" size={40} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Queue is Empty</Text>
            <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
              Go online to start receiving new orders
            </Text>
            <Pressable
              onPress={() => router.replace("/(tabs)/" as any)}
              style={[styles.goOnlineBtn, { backgroundColor: colors.primary, borderRadius: colors.radiusSm }]}
            >
              <Feather name="wifi" size={16} color="#FFF" />
              <Text style={styles.goOnlineTxt}>Go to Dashboard</Text>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, alignItems: "center", gap: 6, padding: 14 },
  statIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  statLabel: { fontSize: 10, fontFamily: "Inter_400Regular", textAlign: "center" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  sectionLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionDot: { width: 10, height: 10, borderRadius: 5 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  countBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  countText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  emptyState: { flex: 1, alignItems: "center", paddingTop: 60, gap: 16 },
  emptyIcon: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center" },
  emptyTitle: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  emptySub: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center" },
  goOnlineBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 20, paddingVertical: 14 },
  goOnlineTxt: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#FFF" },
});

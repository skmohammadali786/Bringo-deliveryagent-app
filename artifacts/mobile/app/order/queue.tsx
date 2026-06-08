import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OrderCard } from "@/components/order/OrderCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";

export default function QueueScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { orders } = useOrderStore();
  const active = orders.filter((o) => ["new", "accepted", "at_shop", "picked_up", "delivering"].includes(o.status));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Order Queue" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        {active.length === 0 ? (
          <EmptyState icon="package" title="No orders in queue" subtitle="You'll see incoming orders here when you're online" />
        ) : (
          active.map((o) => <OrderCard key={o.id} order={o} />)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 16, gap: 0 },
});

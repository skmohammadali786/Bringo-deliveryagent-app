import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export default function ScheduledOrdersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Scheduled Orders" showBack />
      <EmptyState icon="calendar" title="No scheduled orders" subtitle="Orders scheduled for later will appear here" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

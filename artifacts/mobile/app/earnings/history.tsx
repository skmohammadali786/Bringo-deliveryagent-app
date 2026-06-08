import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const HISTORY = [
  { date: "Today", items: [
    { label: "Order BRG-2024-003", type: "delivery", amount: 50, time: "2:30 PM" },
    { label: "Peak Hour Bonus", type: "bonus", amount: 100, time: "12:30 PM" },
    { label: "Order BRG-2024-002", type: "delivery", amount: 30, time: "11:15 AM" },
  ]},
  { date: "Yesterday", items: [
    { label: "Incentive — 5 orders", type: "incentive", amount: 200, time: "7:00 PM" },
    { label: "Order BRG-2024-001", type: "delivery", amount: 45, time: "3:00 PM" },
  ]},
];

export default function EarningsHistoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Earnings History" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        {HISTORY.map((group) => (
          <View key={group.date}>
            <Text style={[styles.dateLabel, { color: colors.mutedForeground }]}>{group.date}</Text>
            <Card padding={0}>
              {group.items.map((item, i) => (
                <View key={`${item.label}-${i}`} style={[styles.txRow, { borderBottomColor: colors.border, borderBottomWidth: i < group.items.length - 1 ? 1 : 0 }]}>
                  <View style={[styles.txIcon, { backgroundColor: item.type === "delivery" ? colors.primaryLight : item.type === "bonus" ? colors.accentLight : colors.successLight }]}>
                    <MaterialCommunityIcons name="currency-inr" size={16} color={item.type === "delivery" ? colors.primary : item.type === "bonus" ? colors.accent : colors.success} />
                  </View>
                  <View style={styles.txText}>
                    <Text style={[styles.txLabel, { color: colors.foreground }]}>{item.label}</Text>
                    <Text style={[styles.txTime, { color: colors.mutedForeground }]}>{item.time}</Text>
                  </View>
                  <Text style={[styles.txAmount, { color: colors.success }]}>+₹{item.amount}</Text>
                </View>
              ))}
            </Card>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  dateLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold", letterSpacing: 0.3, marginBottom: 8 },
  txRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  txIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  txText: { flex: 1, gap: 2 },
  txLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  txTime: { fontSize: 12, fontFamily: "Inter_400Regular" },
  txAmount: { fontSize: 16, fontFamily: "Inter_700Bold" },
});

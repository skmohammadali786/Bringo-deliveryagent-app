import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const HISTORY = [
  { id: "1", label: "Referral Bonus — Arun K.", amount: 500, date: "Feb 15, 2024" },
  { id: "2", label: "Referral Bonus — Meena R.", amount: 500, date: "Jan 28, 2024" },
];

export default function ReferralRewardsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Referral Rewards" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        <Card style={[styles.totalCard, { backgroundColor: colors.secondary }]}>
          <Text style={styles.totalLabel}>Total Referral Earnings</Text>
          <View style={styles.totalRow}>
            <MaterialCommunityIcons name="currency-inr" size={24} color={colors.accent} />
            <Text style={styles.totalVal}>1,000</Text>
          </View>
          <Text style={styles.totalSub}>From 2 successful referrals</Text>
        </Card>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Earnings History</Text>
        <Card padding={0}>
          {HISTORY.map((h, i) => (
            <View key={h.id} style={[styles.txRow, { borderBottomColor: colors.border, borderBottomWidth: i < HISTORY.length - 1 ? 1 : 0 }]}>
              <View style={[styles.txIcon, { backgroundColor: colors.accentLight }]}>
                <Feather name="users" size={16} color={colors.accent} />
              </View>
              <View style={styles.txText}>
                <Text style={[styles.txLabel, { color: colors.foreground }]}>{h.label}</Text>
                <Text style={[styles.txDate, { color: colors.mutedForeground }]}>{h.date}</Text>
              </View>
              <Text style={[styles.txAmount, { color: colors.success }]}>+₹{h.amount}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  totalCard: { alignItems: "center", gap: 8, paddingVertical: 28 },
  totalLabel: { fontSize: 13, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.7)" },
  totalRow: { flexDirection: "row", alignItems: "center" },
  totalVal: { fontSize: 48, fontFamily: "Inter_700Bold", color: "#FFF", letterSpacing: -1.5 },
  totalSub: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.6)" },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  txRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  txIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  txText: { flex: 1, gap: 2 },
  txLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  txDate: { fontSize: 12, fontFamily: "Inter_400Regular" },
  txAmount: { fontSize: 16, fontFamily: "Inter_700Bold" },
});

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useAppStore } from "@/store/appStore";

const AMOUNTS = [200, 500, 1000, 2000];

export default function WithdrawScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { earnings } = useAppStore();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [method, setMethod] = useState<"upi" | "bank">("upi");
  const [loading, setLoading] = useState(false);

  const withdrawAmount = selectedAmount ?? Number(customAmount) ?? 0;
  const fee = 10;
  const netAmount = Math.max(0, withdrawAmount - fee);

  const handleWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount < 100) {
      Alert.alert("Minimum ₹100", "Please enter a valid withdrawal amount of at least ₹100.");
      return;
    }
    if (withdrawAmount > earnings.today) {
      Alert.alert("Insufficient Balance", `You only have ₹${earnings.today} available.`);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    Alert.alert(
      "Withdrawal Initiated! 🎉",
      `₹${netAmount} will be credited to your ${method === "upi" ? "UPI account" : "bank account"} within 10 minutes.`,
      [{ text: "Done", onPress: () => router.back() }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Withdraw Earnings" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120, paddingTop: Platform.OS === "web" ? 16 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)}>
          <Card style={[styles.balanceCard, { backgroundColor: colors.successLight, borderColor: colors.success + "30" }]}>
            <View style={styles.balanceLeft}>
              <Text style={[styles.balLabel, { color: colors.mutedForeground }]}>Available Balance</Text>
              <View style={styles.balRow}>
                <MaterialCommunityIcons name="currency-inr" size={28} color={colors.success} />
                <Text style={[styles.balAmount, { color: colors.success }]}>{earnings.today}</Text>
              </View>
              <Text style={[styles.balSub, { color: colors.mutedForeground }]}>From {earnings.todayOrders} deliveries today</Text>
            </View>
            <View style={[styles.balIcon, { backgroundColor: colors.success + "20" }]}>
              <Feather name="trending-up" size={28} color={colors.success} />
            </View>
          </Card>
        </Animated.View>

        {/* Amount Selector */}
        <Animated.View entering={FadeInDown.delay(60).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Select Amount</Text>
          <View style={styles.amountGrid}>
            {AMOUNTS.map((a) => (
              <Pressable
                key={a}
                onPress={() => { setSelectedAmount(a); setCustomAmount(""); }}
                style={[
                  styles.amountChip,
                  {
                    backgroundColor: selectedAmount === a ? colors.success : colors.card,
                    borderColor: selectedAmount === a ? colors.success : colors.border,
                    borderRadius: colors.radiusSm,
                  },
                ]}
              >
                <Text style={[styles.amountText, { color: selectedAmount === a ? "#FFF" : colors.foreground }]}>
                  ₹{a}
                </Text>
              </Pressable>
            ))}
          </View>
          <Card style={styles.customCard}>
            <Text style={[styles.customLabel, { color: colors.mutedForeground }]}>Or enter custom amount</Text>
            <View style={[styles.customInput, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <MaterialCommunityIcons name="currency-inr" size={18} color={colors.mutedForeground} />
              <Pressable
                onPress={() => { setSelectedAmount(null); }}
                style={{ flex: 1 }}
              >
                <Text style={[styles.customValue, { color: customAmount ? colors.foreground : colors.mutedForeground }]}>
                  {customAmount || "0"}
                </Text>
              </Pressable>
            </View>
          </Card>
        </Animated.View>

        {/* Method */}
        <Animated.View entering={FadeInDown.delay(120).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Withdraw To</Text>
          <View style={styles.methodRow}>
            {([
              { id: "upi", label: "UPI", sub: "rahul@okaxis", icon: "zap", color: "#7C5CFF" },
              { id: "bank", label: "Bank", sub: "HDFC ••••1234", icon: "credit-card", color: "#4A90E2" },
            ] as const).map((m) => (
              <Pressable
                key={m.id}
                onPress={() => setMethod(m.id)}
                style={[
                  styles.methodCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: method === m.id ? m.color : colors.border,
                    borderWidth: method === m.id ? 2 : 1,
                    borderRadius: colors.radiusSm,
                  },
                ]}
              >
                <View style={[styles.methodIcon, { backgroundColor: m.color + "18" }]}>
                  <Feather name={m.icon} size={20} color={m.color} />
                </View>
                <View>
                  <Text style={[styles.methodLabel, { color: colors.foreground }]}>{m.label}</Text>
                  <Text style={[styles.methodSub, { color: colors.mutedForeground }]}>{m.sub}</Text>
                </View>
                {method === m.id && (
                  <View style={[styles.methodCheck, { backgroundColor: m.color, borderRadius: 10 }]}>
                    <Feather name="check" size={12} color="#FFF" />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Summary */}
        {withdrawAmount > 0 && (
          <Animated.View entering={FadeInDown.delay(180).duration(400)}>
            <Card style={styles.summaryCard}>
              <Text style={[styles.summaryTitle, { color: colors.foreground }]}>Summary</Text>
              {[
                { label: "Withdrawal Amount", value: `₹${withdrawAmount}` },
                { label: "Convenience Fee", value: `₹${fee}` },
                { label: "You'll Receive", value: `₹${netAmount}`, highlight: true },
              ].map((row) => (
                <View key={row.label} style={[styles.summaryRow, { borderTopColor: colors.border }]}>
                  <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>{row.label}</Text>
                  <Text style={[styles.summaryValue, { color: row.highlight ? colors.success : colors.foreground, fontFamily: row.highlight ? "Inter_700Bold" : "Inter_600SemiBold" }]}>
                    {row.value}
                  </Text>
                </View>
              ))}
            </Card>
          </Animated.View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <Button
          title={withdrawAmount > 0 ? `Withdraw ₹${netAmount}` : "Enter Amount to Withdraw"}
          onPress={handleWithdraw}
          loading={loading}
          disabled={!withdrawAmount}
          size="xl"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  balanceCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1 },
  balanceLeft: { gap: 4 },
  balLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  balRow: { flexDirection: "row", alignItems: "center" },
  balAmount: { fontSize: 38, fontFamily: "Inter_700Bold", letterSpacing: -1.5 },
  balSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  balIcon: { width: 60, height: 60, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4, marginBottom: 12 },
  amountGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 12 },
  amountChip: {
    flex: 1,
    minWidth: "44%",
    alignItems: "center",
    padding: 16,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  amountText: { fontSize: 18, fontFamily: "Inter_700Bold" },
  customCard: { gap: 10 },
  customLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  customInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  customValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  methodRow: { flexDirection: "row", gap: 10 },
  methodCard: {
    flex: 1,
    padding: 14,
    gap: 8,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  methodIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  methodLabel: { fontSize: 14, fontFamily: "Inter_700Bold" },
  methodSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  methodCheck: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCard: { gap: 4 },
  summaryTitle: { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 4 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingTop: 10, borderTopWidth: 1 },
  summaryLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  summaryValue: { fontSize: 14 },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useAppStore } from "@/store/appStore";

const AMOUNTS = [500, 1000, 2000, 5000];

export default function WithdrawScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { earnings } = useAppStore();
  const [amount, setAmount] = useState<number | null>(null);
  const [method, setMethod] = useState<"bank" | "upi">("upi");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const available = earnings.today + earnings.week;

  if (success) return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Withdraw" showBack />
      <View style={styles.successState}>
        <View style={[styles.successIcon, { backgroundColor: colors.successLight }]}>
          <Feather name="check" size={40} color={colors.success} />
        </View>
        <Text style={[styles.successTitle, { color: colors.foreground }]}>Withdrawal Initiated!</Text>
        <Text style={[styles.successSub, { color: colors.mutedForeground }]}>
          ₹{amount} will be credited to your account within 24 hours.
        </Text>
        <Button title="Back to Earnings" onPress={() => router.replace("/(tabs)/earnings")} style={{ marginTop: 20 }} size="xl" />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Withdraw Earnings" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        {/* Balance */}
        <Animated.View entering={FadeInDown.delay(50).duration(400)}>
          <Card style={[styles.balanceCard, { backgroundColor: colors.secondary }]}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <View style={styles.balanceRow}>
              <MaterialCommunityIcons name="currency-inr" size={22} color={colors.accent} />
              <Text style={styles.balanceVal}>{available.toLocaleString("en-IN")}</Text>
            </View>
            <Text style={styles.balanceSub}>Minimum withdrawal: ₹200</Text>
          </Card>
        </Animated.View>

        {/* Amount Selection */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Select Amount</Text>
          <View style={styles.amountGrid}>
            {AMOUNTS.map((a) => (
              <Pressable
                key={a}
                onPress={() => setAmount(a)}
                disabled={a > available}
                style={[styles.amountBtn, { backgroundColor: amount === a ? colors.primary : colors.card, borderColor: amount === a ? colors.primary : colors.border, borderRadius: colors.radiusSm, opacity: a > available ? 0.5 : 1 }]}
              >
                <Text style={[styles.amountText, { color: amount === a ? "#FFF" : colors.foreground }]}>₹{a.toLocaleString()}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Method */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Withdrawal Method</Text>
          <View style={styles.methodRow}>
            {(["upi", "bank"] as const).map((m) => (
              <Pressable key={m} onPress={() => setMethod(m)} style={[styles.methodBtn, { backgroundColor: method === m ? colors.primaryLight : colors.card, borderColor: method === m ? colors.primary : colors.border, borderRadius: colors.radiusSm }]}>
                <Feather name={m === "upi" ? "smartphone" : "credit-card"} size={20} color={method === m ? colors.primary : colors.mutedForeground} />
                <Text style={[styles.methodText, { color: method === m ? colors.primary : colors.foreground }]}>
                  {m === "upi" ? "UPI (Instant)" : "Bank (24h)"}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Button
          title={loading ? "Processing..." : `Withdraw ₹${amount?.toLocaleString() ?? "—"}`}
          onPress={async () => {
            if (!amount) return;
            setLoading(true);
            await new Promise((r) => setTimeout(r, 1500));
            setLoading(false);
            setSuccess(true);
          }}
          disabled={!amount}
          loading={loading}
          size="xl"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  balanceCard: { alignItems: "center", gap: 6, paddingVertical: 24 },
  balanceLabel: { fontSize: 13, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.7)" },
  balanceRow: { flexDirection: "row", alignItems: "center" },
  balanceVal: { fontSize: 40, fontFamily: "Inter_700Bold", color: "#FFF", letterSpacing: -1.2 },
  balanceSub: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.6)" },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold", letterSpacing: -0.3, marginBottom: 10 },
  amountGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  amountBtn: { width: "47%", padding: 16, alignItems: "center", borderWidth: 1.5 },
  amountText: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  methodRow: { flexDirection: "row", gap: 12 },
  methodBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderWidth: 1.5 },
  methodText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
  successState: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, gap: 12 },
  successIcon: { width: 90, height: 90, borderRadius: 45, alignItems: "center", justifyContent: "center" },
  successTitle: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.8 },
  successSub: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 24 },
});

import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export default function BankProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Bank Details" showBack />
      <View style={[styles.content, { paddingTop: Platform.OS === "web" ? 40 : 24 }]}>
        <Card>
          <View style={styles.bankTop}>
            <View style={[styles.bankIcon, { backgroundColor: colors.primaryLight }]}>
              <Feather name="credit-card" size={28} color={colors.primary} />
            </View>
            <Badge label="Primary Account" variant="success" />
          </View>
          <Text style={[styles.bankName, { color: colors.foreground }]}>State Bank of India</Text>
          <Text style={[styles.bankNum, { color: colors.mutedForeground }]}>•••• •••• •••• 1234</Text>
          <Text style={[styles.bankIfsc, { color: colors.mutedForeground }]}>IFSC: SBIN0001234</Text>
          <View style={[styles.verifiedRow, { backgroundColor: colors.successLight, borderRadius: 8 }]}>
            <Feather name="check-circle" size={14} color={colors.success} />
            <Text style={[styles.verifiedText, { color: colors.success }]}>Verified Account • Payouts active</Text>
          </View>
        </Card>
        <View style={[styles.infoBox, { backgroundColor: colors.warningLight, borderRadius: colors.radiusSm }]}>
          <Feather name="info" size={14} color={colors.warning} />
          <Text style={[styles.infoText, { color: colors.foreground }]}>
            Bank details can only be updated once every 30 days. Next update allowed in 18 days.
          </Text>
        </View>
      </View>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 32 }]}>
        <Button title="Update Bank Details" onPress={() => router.push("/(onboarding)/bank-details" as any)} variant="outline" size="xl" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, gap: 16 },
  bankTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  bankIcon: { width: 56, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  bankName: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.4, marginBottom: 6 },
  bankNum: { fontSize: 18, fontFamily: "Inter_600SemiBold", letterSpacing: 2, marginBottom: 4 },
  bankIfsc: { fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 14 },
  verifiedRow: { flexDirection: "row", alignItems: "center", gap: 8, padding: 10 },
  verifiedText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  infoBox: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12 },
  infoText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 20 },
  footer: { paddingHorizontal: 24 },
});

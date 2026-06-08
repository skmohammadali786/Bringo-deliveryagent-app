import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/store/authStore";

export default function KycStatusScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { kycStatus } = useAuthStore();

  const statusConfig = {
    approved: { icon: "check-circle", color: colors.success, label: "KYC Approved", desc: "All documents verified. You're a trusted Bringo partner." },
    under_review: { icon: "loader", color: colors.warning, label: "Under Review", desc: "Documents submitted. Review takes 24–48 hours." },
    rejected: { icon: "x-circle", color: colors.destructive, label: "KYC Rejected", desc: "Documents could not be verified. Please re-upload." },
    not_started: { icon: "circle", color: colors.mutedForeground, label: "Not Started", desc: "Complete KYC to start delivering." },
    pending: { icon: "clock", color: colors.warning, label: "Pending", desc: "KYC in progress." },
  };

  const cfg = statusConfig[kycStatus] ?? statusConfig.not_started;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="KYC Status" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        <Card style={[styles.statusCard, { backgroundColor: cfg.color + "18" }]}>
          <Feather name={cfg.icon as any} size={48} color={cfg.color} />
          <Text style={[styles.statusLabel, { color: cfg.color }]}>{cfg.label}</Text>
          <Text style={[styles.statusDesc, { color: colors.foreground }]}>{cfg.desc}</Text>
        </Card>
        <Card>
          <Text style={[styles.cardTitle, { color: colors.mutedForeground }]}>VERIFICATION CHECKLIST</Text>
          {[
            { label: "Identity Verification", done: true },
            { label: "Document Authenticity", done: true },
            { label: "Background Check", done: kycStatus === "approved" },
            { label: "Final Approval", done: kycStatus === "approved" },
          ].map((c) => (
            <View key={c.label} style={styles.checkRow}>
              <Feather name={c.done ? "check-circle" : "circle"} size={18} color={c.done ? colors.success : colors.muted} />
              <Text style={[styles.checkLabel, { color: c.done ? colors.foreground : colors.mutedForeground }]}>{c.label}</Text>
              <Badge label={c.done ? "Done" : "Pending"} variant={c.done ? "success" : "default"} size="sm" />
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  statusCard: { alignItems: "center", gap: 10, padding: 28 },
  statusLabel: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  statusDesc: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
  cardTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8, marginBottom: 12 },
  checkRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10 },
  checkLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
});

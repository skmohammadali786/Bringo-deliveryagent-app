import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const REFERRALS = [
  { name: "Arun K.", phone: "•••• 7890", status: "completed", deliveries: 15, earned: 500 },
  { name: "Meena R.", phone: "•••• 4521", status: "completed", deliveries: 12, earned: 500 },
  { name: "Suresh P.", phone: "•••• 3389", status: "pending", deliveries: 6, earned: 0 },
  { name: "Kavitha M.", phone: "•••• 1122", status: "registered", deliveries: 0, earned: 0 },
];

export default function ReferralStatusScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Referral Status" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        {REFERRALS.map((r) => (
          <Card key={r.name} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.avatarText, { color: colors.primary }]}>{r.name.charAt(0)}</Text>
              </View>
              <View style={styles.info}>
                <Text style={[styles.name, { color: colors.foreground }]}>{r.name}</Text>
                <Text style={[styles.phone, { color: colors.mutedForeground }]}>{r.phone}</Text>
              </View>
              <Badge label={r.status === "completed" ? "Earned" : r.status === "pending" ? "In Progress" : "Registered"} variant={r.status === "completed" ? "success" : "warning"} />
            </View>
            <View style={styles.cardBottom}>
              <View style={styles.stat}>
                <Feather name="package" size={13} color={colors.mutedForeground} />
                <Text style={[styles.statText, { color: colors.mutedForeground }]}>{r.deliveries}/10 deliveries</Text>
              </View>
              <Text style={[styles.earned, { color: r.earned > 0 ? colors.success : colors.mutedForeground }]}>
                {r.earned > 0 ? `+₹${r.earned} earned` : "Pending..."}
              </Text>
            </View>
            {r.status === "pending" && (
              <View style={[styles.progress, { backgroundColor: colors.muted }]}>
                <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${(r.deliveries / 10) * 100}%` }]} />
              </View>
            )}
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 12 },
  card: { gap: 12 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 18, fontFamily: "Inter_700Bold" },
  info: { flex: 1, gap: 2 },
  name: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  phone: { fontSize: 12, fontFamily: "Inter_400Regular" },
  cardBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  stat: { flexDirection: "row", alignItems: "center", gap: 6 },
  statText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  earned: { fontSize: 14, fontFamily: "Inter_700Bold" },
  progress: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
});

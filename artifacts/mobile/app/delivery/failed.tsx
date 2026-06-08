import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const REASONS = ["Customer not at home", "Wrong address", "Customer refused delivery", "Could not find location", "Customer not reachable"];

export default function DeliveryFailedScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Delivery Failed" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 20 : 8 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Reason for Failure</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>Select why the delivery could not be completed</Text>
        {REASONS.map((r) => (
          <Pressable key={r} onPress={() => setSelected(r)} style={[styles.reasonCard, { backgroundColor: selected === r ? colors.destructiveLight : colors.card, borderColor: selected === r ? colors.destructive : colors.border, borderRadius: colors.radiusSm }]}>
            <View style={[styles.radio, { borderColor: selected === r ? colors.destructive : colors.border }]}>
              {selected === r && <View style={[styles.radioDot, { backgroundColor: colors.destructive }]} />}
            </View>
            <Text style={[styles.reasonText, { color: selected === r ? colors.destructive : colors.foreground }]}>{r}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.background }]}>
        <Button title="Try Again" onPress={() => router.push("/delivery/navigate" as any)} variant="outline" />
        <Button title="Report Failed Delivery" onPress={() => router.push("/delivery/reschedule" as any)} variant="destructive" disabled={!selected} size="xl" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 12 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.6 },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22, marginBottom: 4 },
  reasonCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderWidth: 1 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  reasonText: { fontSize: 15, fontFamily: "Inter_500Medium", flex: 1 },
  footer: { paddingHorizontal: 20, paddingTop: 12, gap: 10 },
});

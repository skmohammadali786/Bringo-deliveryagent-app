import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "@/components/ui/Badge";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const DOCS = [
  { id: "aadhaar", label: "Aadhaar Card", status: "verified", route: "/(onboarding)/aadhaar-front" },
  { id: "pan", label: "PAN Card", status: "verified", route: "/(onboarding)/pan" },
  { id: "dl", label: "Driving Licence", status: "verified", route: "/(onboarding)/dl-front" },
  { id: "rc", label: "Vehicle RC", status: "pending", route: "/(onboarding)/vehicle-rc" },
  { id: "insurance", label: "Vehicle Insurance", status: "expiring", route: "/(onboarding)/insurance" },
];

export default function DocumentsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const getVariant = (status: string) => status === "verified" ? "success" : status === "pending" ? "warning" : "destructive";
  const getLabel = (status: string) => status === "verified" ? "Verified" : status === "pending" ? "Pending" : "Expiring Soon";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="My Documents" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        {DOCS.map((doc) => (
          <Pressable
            key={doc.id}
            onPress={() => router.push(doc.route as any)}
            style={[styles.docCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}
          >
            <View style={[styles.docIcon, { backgroundColor: colors.muted }]}>
              <Feather name="file-text" size={20} color={colors.foreground} />
            </View>
            <Text style={[styles.docLabel, { color: colors.foreground }]}>{doc.label}</Text>
            <Badge label={getLabel(doc.status)} variant={getVariant(doc.status) as any} dot />
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 10 },
  docCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderWidth: 1 },
  docIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  docLabel: { flex: 1, fontSize: 15, fontFamily: "Inter_500Medium" },
});

import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const TIPS = [
  { cat: "Road Safety", color: "#FF6B35", icon: "alert-triangle", items: ["Always wear a helmet when riding", "Follow traffic signals and rules", "Don't use phone while driving", "Check weather before night deliveries"] },
  { cat: "Customer Safety", color: "#007AFF", icon: "user", items: ["Verify delivery address before going", "Keep a safe distance from strangers", "Don't enter customer's home", "Report suspicious behavior"] },
  { cat: "Document Safety", color: "#34C759", icon: "file-text", items: ["Keep digital copies of all documents", "Never share OTP with anyone", "Lock phone when not in use", "Enable 2-factor authentication"] },
];

export default function SafetyTipsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Safety Guidelines" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        {TIPS.map((section) => (
          <View key={section.cat}>
            <View style={styles.catHeader}>
              <View style={[styles.catIcon, { backgroundColor: section.color + "18" }]}>
                <Feather name={section.icon as any} size={18} color={section.color} />
              </View>
              <Text style={[styles.catTitle, { color: colors.foreground }]}>{section.cat}</Text>
            </View>
            <Card>
              {section.items.map((tip, i) => (
                <View key={tip} style={[styles.tip, { borderBottomColor: colors.border, borderBottomWidth: i < section.items.length - 1 ? 1 : 0 }]}>
                  <Feather name="check-circle" size={14} color={section.color} />
                  <Text style={[styles.tipText, { color: colors.foreground }]}>{tip}</Text>
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
  catHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  catIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  catTitle: { fontSize: 17, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  tip: { flexDirection: "row", alignItems: "flex-start", gap: 10, paddingVertical: 12 },
  tipText: { fontSize: 14, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 22 },
});

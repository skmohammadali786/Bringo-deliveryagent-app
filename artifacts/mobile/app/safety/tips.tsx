import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const CATEGORIES = [
  {
    title: "Road Safety",
    icon: "shield" as const,
    color: "#4A90E2",
    tips: [
      "Always wear your helmet before starting a ride",
      "Follow traffic signals and lane discipline",
      "Avoid using your phone while riding",
      "Maintain safe distance from other vehicles",
      "Reduce speed in school zones and hospital areas",
    ],
  },
  {
    title: "Weather Precautions",
    icon: "cloud" as const,
    color: "#00BFA6",
    tips: [
      "Avoid riding during heavy rain or thunderstorms",
      "Wear reflective gear in low visibility conditions",
      "Check tire pressure regularly during monsoon season",
      "Slow down on wet roads to prevent skidding",
    ],
  },
  {
    title: "Personal Safety",
    icon: "user-check" as const,
    color: "#7C5CFF",
    tips: [
      "Share your live location with emergency contacts",
      "Avoid riding in unfamiliar areas after midnight",
      "Keep the SOS button easily accessible",
      "Report any suspicious behavior to support",
    ],
  },
  {
    title: "Health & Wellness",
    icon: "heart" as const,
    color: "#FF6B35",
    tips: [
      "Take a 5-min break every 2 hours of riding",
      "Stay hydrated, especially in summer months",
      "Don't ride if you feel tired or unwell",
      "Eat proper meals at regular intervals",
    ],
  },
];

export default function SafetyTipsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Safety Tips" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 16 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)}>
          <Card style={[styles.heroBanner, { backgroundColor: colors.warningLight, borderColor: colors.warning + "30" }]}>
            <Text style={styles.heroEmoji}>🛡️</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.heroTitle, { color: colors.foreground }]}>Your Safety Matters</Text>
              <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>
                Follow these guidelines to stay safe every delivery
              </Text>
            </View>
          </Card>
        </Animated.View>

        {/* Categories */}
        {CATEGORIES.map((cat, ci) => (
          <Animated.View key={cat.title} entering={FadeInDown.delay(60 + ci * 70).duration(400)}>
            <Pressable
              onPress={() => setExpanded((e) => (e === ci ? null : ci))}
              style={[
                styles.categoryHeader,
                {
                  backgroundColor: colors.card,
                  borderColor: expanded === ci ? cat.color : colors.border,
                  borderRadius: colors.radiusSm,
                  borderWidth: expanded === ci ? 1.5 : 1,
                },
              ]}
            >
              <View style={[styles.catIcon, { backgroundColor: cat.color + "18" }]}>
                <Feather name={cat.icon} size={20} color={cat.color} />
              </View>
              <Text style={[styles.catTitle, { color: colors.foreground }]}>{cat.title}</Text>
              <View style={[styles.catCount, { backgroundColor: cat.color + "18" }]}>
                <Text style={[styles.catCountText, { color: cat.color }]}>{cat.tips.length}</Text>
              </View>
              <Feather
                name={expanded === ci ? "chevron-up" : "chevron-down"}
                size={16}
                color={colors.mutedForeground}
              />
            </Pressable>
            {expanded === ci && (
              <Card style={styles.tipsCard}>
                {cat.tips.map((tip, ti) => (
                  <View key={ti} style={styles.tipRow}>
                    <View style={[styles.tipBullet, { backgroundColor: cat.color }]} />
                    <Text style={[styles.tipText, { color: colors.foreground }]}>{tip}</Text>
                  </View>
                ))}
              </Card>
            )}
          </Animated.View>
        ))}

        {/* Emergency */}
        <Animated.View entering={FadeInDown.delay(350).duration(400)}>
          <Card style={[styles.emergencyCard, { backgroundColor: colors.destructiveLight, borderColor: colors.destructive + "30" }]}>
            <Feather name="phone" size={18} color={colors.destructive} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.emergencyTitle, { color: colors.foreground }]}>Emergency Helpline</Text>
              <Text style={[styles.emergencyNum, { color: colors.destructive }]}>1800-123-456 (24/7)</Text>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 12 },
  heroBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 4,
  },
  heroEmoji: { fontSize: 32 },
  heroTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  heroSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  catIcon: { width: 40, height: 40, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  catTitle: { flex: 1, fontSize: 15, fontFamily: "Inter_600SemiBold" },
  catCount: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  catCountText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  tipsCard: { gap: 12, marginTop: -8, borderTopLeftRadius: 0, borderTopRightRadius: 0 },
  tipRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  tipBullet: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
  tipText: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  emergencyCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderWidth: 1, borderRadius: 16 },
  emergencyTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  emergencyNum: { fontSize: 16, fontFamily: "Inter_700Bold" },
});

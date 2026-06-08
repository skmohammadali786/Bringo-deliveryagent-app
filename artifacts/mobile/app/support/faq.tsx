import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { fadeInDown } from "@/constants/animations";

const FAQ_DATA = [
  {
    category: "Earnings & Payouts",
    icon: "trending-up" as const,
    color: "#34C759",
    questions: [
      {
        q: "How are delivery fees calculated?",
        a: "Delivery fees are based on distance, order value, and surge multiplier in your area. You can see fee breakdown in each order card before accepting.",
      },
      {
        q: "When will I receive my earnings?",
        a: "Earnings are processed daily and credited to your bank account by 12 AM the next day. Minimum payout is ₹100.",
      },
      {
        q: "How do I request early payout?",
        a: "Go to Earnings → Withdraw. You can request instant payout with a small convenience fee of ₹10.",
      },
    ],
  },
  {
    category: "Orders & Deliveries",
    icon: "package" as const,
    color: "#FF6B35",
    questions: [
      {
        q: "What if a customer is not available?",
        a: "Wait 5 minutes and try calling. If no response, take a photo proof and mark delivery as failed. Contact support for assistance.",
      },
      {
        q: "What if an item is unavailable at shop?",
        a: "Mark the item as unavailable in the shop screen. You can suggest alternatives or contact the customer directly.",
      },
      {
        q: "How do I handle COD payments?",
        a: "Collect exact cash from the customer before handing over the order. Submit the collected amount in the app.",
      },
    ],
  },
  {
    category: "Account & KYC",
    icon: "user-check" as const,
    color: "#7C5CFF",
    questions: [
      {
        q: "What documents do I need for KYC?",
        a: "You need Aadhaar card, PAN card, driving license, vehicle RC book, and a clear selfie. All must be valid and not expired.",
      },
      {
        q: "How long does KYC verification take?",
        a: "KYC review typically takes 1-2 business days. You'll receive a notification once approved.",
      },
    ],
  },
];

export default function FaqScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (key: string) => setExpanded((e) => (e === key ? null : key));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="FAQs" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 16 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {FAQ_DATA.map((cat, ci) => (
          <Animated.View key={cat.category} entering={fadeInDown(ci)}>
            <View style={styles.catHeader}>
              <View style={[styles.catIcon, { backgroundColor: cat.color + "18" }]}>
                <Feather name={cat.icon} size={18} color={cat.color} />
              </View>
              <Text style={[styles.catTitle, { color: colors.foreground }]}>{cat.category}</Text>
            </View>
            <Card padding={0}>
              {cat.questions.map((item, qi) => {
                const key = `${ci}-${qi}`;
                return (
                  <View key={qi} style={[styles.faqItem, { borderBottomColor: colors.border, borderBottomWidth: qi < cat.questions.length - 1 ? 1 : 0 }]}>
                    <Pressable
                      onPress={() => toggle(key)}
                      style={styles.faqQuestion}
                    >
                      <Text style={[styles.qText, { color: colors.foreground }]}>{item.q}</Text>
                      <Feather
                        name={expanded === key ? "chevron-up" : "chevron-down"}
                        size={16}
                        color={colors.mutedForeground}
                      />
                    </Pressable>
                    {expanded === key && (
                      <View style={[styles.faqAnswer, { backgroundColor: colors.muted + "40" }]}>
                        <Text style={[styles.aText, { color: colors.mutedForeground }]}>{item.a}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </Card>
          </Animated.View>
        ))}

        {/* Still need help? */}
        <Card style={[styles.helpCard, { backgroundColor: colors.primaryLight, borderColor: colors.primary + "30" }]}>
          <Feather name="headphones" size={20} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.helpTitle, { color: colors.foreground }]}>Still need help?</Text>
            <Text style={[styles.helpSub, { color: colors.mutedForeground }]}>Chat with a support agent</Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.primary} />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  catHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  catIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  catTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  faqItem: {},
  faqQuestion: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  qText: { flex: 1, fontSize: 14, fontFamily: "Inter_600SemiBold", lineHeight: 20 },
  faqAnswer: { paddingHorizontal: 14, paddingBottom: 14, paddingTop: 4 },
  aText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 22 },
  helpCard: { flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1 },
  helpTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  helpSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
});

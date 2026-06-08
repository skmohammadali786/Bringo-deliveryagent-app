import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const FAQS = [
  { q: "How do I reset my OTP?", a: "If your pickup OTP is incorrect, contact the shop owner first. If the problem persists, call our support line at 1800-BRINGO." },
  { q: "What if a customer is not home?", a: "Try calling the customer twice. If unreachable, take a photo at the doorstep and report a failed delivery. Support will reschedule." },
  { q: "How are earnings calculated?", a: "Earnings = Base delivery fee + Distance bonus + Incentives + Peak hour multiplier. All breakdowns are visible in the Earnings tab." },
  { q: "How to update bank details?", a: "Go to Profile → Bank Details. Note that bank details can only be updated once every 30 days for security." },
  { q: "What is the acceptance rate?", a: "The percentage of orders you accept vs received. Maintaining above 90% qualifies you for premium order slots and incentives." },
  { q: "Can I pause accepting orders?", a: "Yes! Use the Online/Offline toggle on the home screen. Going offline won't affect your rating." },
];

export default function FaqScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="FAQ" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        {FAQS.map((faq, i) => (
          <Pressable key={i} onPress={() => setExpanded(expanded === i ? null : i)} style={[styles.faqItem, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}>
            <View style={styles.faqHeader}>
              <Text style={[styles.faqQ, { color: colors.foreground }]}>{faq.q}</Text>
              <Feather name={expanded === i ? "chevron-up" : "chevron-down"} size={18} color={colors.mutedForeground} />
            </View>
            {expanded === i && (
              <Text style={[styles.faqA, { color: colors.mutedForeground }]}>{faq.a}</Text>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 10 },
  faqItem: { padding: 16, borderWidth: 1, gap: 10 },
  faqHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 10 },
  faqQ: { fontSize: 15, fontFamily: "Inter_600SemiBold", flex: 1, lineHeight: 22 },
  faqA: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
});

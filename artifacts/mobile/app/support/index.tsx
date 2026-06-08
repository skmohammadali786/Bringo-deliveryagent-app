import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { useColors } from "@/hooks/useColors";
import { fadeInDownDelay } from "@/constants/animations";

const QUICK_ACTIONS = [
  { icon: "message-circle" as const, label: "Live Chat", sub: "Chat with support", route: "/support/chat", color: "#4A90E2" },
  { icon: "phone" as const, label: "Call Support", sub: "1800-123-456", route: null, phone: "18001234567", color: "#34C759" },
  { icon: "file-text" as const, label: "Raise Ticket", sub: "Track your issue", route: "/support/issue", color: "#7C5CFF" },
  { icon: "alert-triangle" as const, label: "Emergency", sub: "Urgent help", route: "/support/emergency", color: "#FF4D4F" },
];

const FAQ_ITEMS = [
  {
    q: "How do I increase my earnings?",
    a: "Work during peak hours (7–9 AM, 12–2 PM, 6–9 PM) in surge zones. Maintain a 4.8+ rating for priority order assignments and complete daily incentive milestones visible in your Earnings tab.",
  },
  {
    q: "How are delivery fees calculated?",
    a: "Your fee = Base fare + Distance charge + Surge multiplier + Tips. Peak-hour surge can be up to 2.5× the base fare. You can see a full breakdown for any order in Earnings → History.",
  },
  {
    q: "What if a customer is not available?",
    a: "Wait 5 minutes at the delivery location and try calling. If unreachable, tap 'Customer Unavailable' in the delivery screen — our support team will take over and you'll still receive your delivery fee.",
  },
  {
    q: "How to dispute a wrong or missing order?",
    a: "Tap the order in your history, then tap 'Raise Dispute'. Attach a photo if possible. Our team reviews disputes within 24 hours and the fee is credited back if the issue is confirmed.",
  },
  {
    q: "How to request an early payout?",
    a: "Go to Earnings → Withdraw and tap 'Instant Payout'. A small convenience fee applies. Your earnings must be above ₹200 to initiate. Make sure your bank/UPI details are verified first.",
  },
  {
    q: "What documents are needed for KYC?",
    a: "You need: (1) Aadhaar card (front & back), (2) Driving licence, (3) Vehicle registration certificate, (4) A clear selfie. Upload them under Profile → Documents. Verification takes 1–2 working days.",
  },
];

export default function SupportScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16), paddingBottom: insets.bottom + 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.pageTitle, { color: colors.foreground }]}>Help Center</Text>

      {/* Hero */}
      <Animated.View entering={fadeInDownDelay(50)}>
        <LinearGradient
          colors={["#FF6B35", "#E8501C"]}
          style={[styles.hero, { borderRadius: colors.radius }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={[styles.heroIcon, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Feather name="headphones" size={28} color="#FFF" />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>We're here to help!</Text>
            <Text style={styles.heroSub}>Average response time: 2 minutes</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View entering={fadeInDownDelay(100)}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((a) => (
            <Pressable
              key={a.label}
              onPress={() => a.route ? router.push(a.route as any) : a.phone ? Linking.openURL(`tel:${a.phone}`) : null}
              style={[styles.quickCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}
            >
              <View style={[styles.quickIcon, { backgroundColor: a.color + "18" }]}>
                <Feather name={a.icon} size={22} color={a.color} />
              </View>
              <Text style={[styles.quickLabel, { color: colors.foreground }]}>{a.label}</Text>
              <Text style={[styles.quickSub, { color: colors.mutedForeground }]}>{a.sub}</Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      {/* Order Dispute CTA */}
      <Animated.View entering={fadeInDownDelay(150)}>
        <Pressable
          onPress={() => router.push("/support/order-dispute" as any)}
          style={[styles.disputeCard, { backgroundColor: colors.warningLight, borderColor: colors.warning + "30", borderRadius: colors.radiusSm }]}
        >
          <View style={[styles.disputeIcon, { backgroundColor: colors.warning + "25" }]}>
            <Feather name="package" size={20} color={colors.warning} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.disputeTitle, { color: colors.foreground }]}>Order Issue?</Text>
            <Text style={[styles.disputeSub, { color: colors.mutedForeground }]}>
              Wrong item, missing order, or delivery problem
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color={colors.warning} />
        </Pressable>
      </Animated.View>

      {/* FAQs */}
      <Animated.View entering={fadeInDownDelay(200)}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Frequently Asked</Text>
          <Pressable onPress={() => router.push("/support/faq" as any)}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
          </Pressable>
        </View>
        <Card padding={0}>
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = expandedFaq === i;
            return (
              <View
                key={item.q}
                style={{
                  borderBottomColor: colors.border,
                  borderBottomWidth: i < FAQ_ITEMS.length - 1 ? 1 : 0,
                }}
              >
                <Pressable
                  onPress={() => setExpandedFaq(isOpen ? null : i)}
                  style={({ pressed }) => [
                    styles.faqRow,
                    { backgroundColor: pressed ? colors.muted + "40" : "transparent" },
                  ]}
                >
                  <View style={[styles.faqIconWrap, { backgroundColor: colors.primaryLight }]}>
                    <Feather name="help-circle" size={14} color={colors.primary} />
                  </View>
                  <Text style={[styles.faqQ, { color: colors.foreground }]}>{item.q}</Text>
                  <Feather
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={16}
                    color={isOpen ? colors.primary : colors.mutedForeground}
                  />
                </Pressable>
                {isOpen && (
                  <View style={[styles.faqAnswer, { backgroundColor: colors.muted + "50", borderTopColor: colors.border }]}>
                    <Text style={[styles.faqAnswerText, { color: colors.mutedForeground }]}>{item.a}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </Card>
      </Animated.View>

      {/* Hours */}
      <Animated.View entering={fadeInDownDelay(250)}>
        <Card style={styles.hoursCard}>
          <Feather name="clock" size={18} color={colors.primary} />
          <View>
            <Text style={[styles.hoursTitle, { color: colors.foreground }]}>Support Hours</Text>
            <Text style={[styles.hoursSub, { color: colors.mutedForeground }]}>Chat: 24/7 · Phone: 6 AM – 11 PM</Text>
          </View>
        </Card>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 20 },
  pageTitle: { fontSize: 32, fontFamily: "Inter_700Bold", letterSpacing: -1 },
  hero: { flexDirection: "row", alignItems: "center", gap: 16, padding: 20 },
  heroIcon: { width: 56, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  heroText: { flex: 1, gap: 4 },
  heroTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#FFF" },
  heroSub: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.8)" },
  sectionTitle: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  seeAll: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 },
  quickCard: {
    width: "47%",
    alignItems: "center",
    padding: 16,
    gap: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  quickIcon: { width: 52, height: 52, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  quickLabel: { fontSize: 14, fontFamily: "Inter_700Bold" },
  quickSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
  disputeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderWidth: 1,
  },
  disputeIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  disputeTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  disputeSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  faqRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  faqIconWrap: { width: 30, height: 30, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  faqQ: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium", lineHeight: 20 },
  faqAnswer: { paddingHorizontal: 16, paddingBottom: 14, paddingTop: 10, borderTopWidth: 1 },
  faqAnswerText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  hoursCard: { flexDirection: "row", alignItems: "center", gap: 12 },
  hoursTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  hoursSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
});

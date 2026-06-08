import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const QUICK_ISSUES = [
  { icon: "package", label: "Order Issue", route: "/support/issue" },
  { icon: "dollar-sign", label: "Payment Problem", route: "/support/order-dispute" },
  { icon: "map-pin", label: "Navigation Help", route: "/support/faq" },
  { icon: "user", label: "Account Issue", route: "/support/issue" },
];

const FAQS = [
  { q: "How do I reset my OTP?", route: "/support/faq" },
  { q: "What if a customer is not home?", route: "/support/faq" },
  { q: "How are earnings calculated?", route: "/support/faq" },
  { q: "How to update bank details?", route: "/support/faq" },
];

export default function SupportScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Help & Support" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        {/* Live Chat CTA */}
        <Animated.View entering={FadeInDown.delay(50).duration(400)}>
          <Pressable onPress={() => router.push("/support/chat" as any)} style={[styles.chatCta, { backgroundColor: colors.primary, borderRadius: colors.radius }]}>
            <View>
              <Text style={styles.ctaTitle}>Live Support Chat</Text>
              <Text style={styles.ctaSub}>Average response time: 2 minutes</Text>
            </View>
            <View style={[styles.ctaIcon, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
              <Feather name="message-circle" size={24} color="#FFF" />
            </View>
          </Pressable>
        </Animated.View>

        {/* Quick Issues */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Common Issues</Text>
          <View style={styles.quickGrid}>
            {QUICK_ISSUES.map((item) => (
              <Pressable key={item.label} onPress={() => router.push(item.route as any)} style={[styles.quickItem, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}>
                <View style={[styles.quickIcon, { backgroundColor: colors.muted }]}>
                  <Feather name={item.icon as any} size={20} color={colors.foreground} />
                </View>
                <Text style={[styles.quickLabel, { color: colors.foreground }]}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Contact Options */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Contact Us</Text>
          <Card padding={0}>
            {[
              { icon: "phone", label: "Call Support", sub: "+91 1800-BRINGO", action: () => Linking.openURL("tel:+911800274646") },
              { icon: "mail", label: "Email Support", sub: "support@bringo.in", action: () => Linking.openURL("mailto:support@bringo.in") },
              { icon: "message-circle", label: "Chat Support", sub: "Available 24/7", action: () => router.push("/support/chat" as any) },
            ].map((c, i) => (
              <Pressable key={c.label} onPress={c.action} style={[styles.contactRow, { borderBottomColor: colors.border, borderBottomWidth: i < 2 ? 1 : 0 }]}>
                <View style={[styles.contactIcon, { backgroundColor: colors.primaryLight }]}>
                  <Feather name={c.icon as any} size={18} color={colors.primary} />
                </View>
                <View style={styles.contactText}>
                  <Text style={[styles.contactLabel, { color: colors.foreground }]}>{c.label}</Text>
                  <Text style={[styles.contactSub, { color: colors.mutedForeground }]}>{c.sub}</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </Pressable>
            ))}
          </Card>
        </Animated.View>

        {/* FAQs */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Frequently Asked</Text>
          <Card padding={0}>
            {FAQS.map((faq, i) => (
              <Pressable key={faq.q} onPress={() => router.push(faq.route as any)} style={[styles.faqRow, { borderBottomColor: colors.border, borderBottomWidth: i < FAQS.length - 1 ? 1 : 0 }]}>
                <Feather name="help-circle" size={16} color={colors.primary} />
                <Text style={[styles.faqText, { color: colors.foreground }]}>{faq.q}</Text>
                <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
              </Pressable>
            ))}
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250).duration(400)}>
          <Pressable onPress={() => router.push("/support/emergency" as any)} style={[styles.emergencyBtn, { backgroundColor: colors.destructiveLight, borderRadius: colors.radiusSm }]}>
            <Feather name="alert-triangle" size={18} color={colors.destructive} />
            <Text style={[styles.emergencyText, { color: colors.destructive }]}>Emergency Support</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  chatCta: { padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  ctaTitle: { fontSize: 17, fontFamily: "Inter_700Bold", color: "#FFF", letterSpacing: -0.3 },
  ctaSub: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.8)", marginTop: 4 },
  ctaIcon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4, marginBottom: 10 },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  quickItem: { width: "47%", alignItems: "center", padding: 16, gap: 10, borderWidth: 1 },
  quickIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  quickLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  contactRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  contactIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  contactText: { flex: 1, gap: 2 },
  contactLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  contactSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  faqRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14 },
  faqText: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  emergencyBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, padding: 16 },
  emergencyText: { fontSize: 15, fontFamily: "Inter_700Bold" },
});

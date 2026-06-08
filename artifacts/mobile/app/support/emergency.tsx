import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { fadeInDown, fadeInDownDelay } from "@/constants/animations";

const EMERGENCY_SERVICES = [
  { name: "Police", number: "100", icon: "shield", color: "#4A90E2", desc: "Theft, harassment, crime" },
  { name: "Ambulance", number: "108", icon: "activity", color: "#FF4D4F", desc: "Medical emergency" },
  { name: "National Emergency", number: "112", icon: "alert-circle", color: "#FF9A3D", desc: "All emergencies" },
  { name: "Women Helpline", number: "1091", icon: "heart", color: "#FF6B35", desc: "Women's safety" },
];

const BRINGO_CONTACTS = [
  { name: "Bringo SOS Hotline", number: "1800-555-999", available: "24/7", icon: "phone-call", color: "#FF4D4F" },
  { name: "Partner Support", number: "1800-123-456", available: "6 AM–11 PM", icon: "headphones", color: "#FF6B35" },
  { name: "Safety Team", number: "1800-456-789", available: "24/7", icon: "shield", color: "#7C5CFF" },
];

export default function EmergencyScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const callNumber = (num: string) => Linking.openURL(`tel:${num}`);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Emergency Help" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 16 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* SOS CTA */}
        <Animated.View entering={fadeInDown(0)}>
          <Pressable
            onPress={() => router.push("/safety/sos" as any)}
            style={[styles.sosCta, { backgroundColor: colors.destructive, borderRadius: colors.radius }]}
          >
            <View style={[styles.sosIcon, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
              <Feather name="alert-circle" size={32} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sosTitle}>Send SOS Alert</Text>
              <Text style={styles.sosSub}>Instantly alert emergency contacts & Bringo team</Text>
            </View>
            <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.8)" />
          </Pressable>
        </Animated.View>

        {/* Govt Services */}
        <Animated.View entering={fadeInDownDelay(80)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Government Emergency Services</Text>
          <View style={styles.serviceGrid}>
            {EMERGENCY_SERVICES.map((s) => (
              <Pressable
                key={s.name}
                onPress={() => callNumber(s.number)}
                style={[styles.serviceCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}
              >
                <View style={[styles.serviceIcon, { backgroundColor: s.color + "18" }]}>
                  <Feather name={s.icon as any} size={22} color={s.color} />
                </View>
                <Text style={[styles.serviceName, { color: colors.foreground }]}>{s.name}</Text>
                <Text style={[styles.serviceNum, { color: s.color }]}>{s.number}</Text>
                <Text style={[styles.serviceDesc, { color: colors.mutedForeground }]}>{s.desc}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Bringo Contacts */}
        <Animated.View entering={fadeInDownDelay(160)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Bringo Emergency Contacts</Text>
          <Card padding={0}>
            {BRINGO_CONTACTS.map((c, i) => (
              <Pressable
                key={c.name}
                onPress={() => callNumber(c.number)}
                style={[
                  styles.contactRow,
                  { borderBottomColor: colors.border, borderBottomWidth: i < BRINGO_CONTACTS.length - 1 ? 1 : 0 },
                ]}
              >
                <View style={[styles.contactIcon, { backgroundColor: c.color + "14" }]}>
                  <Feather name={c.icon as any} size={18} color={c.color} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactName, { color: colors.foreground }]}>{c.name}</Text>
                  <Text style={[styles.contactNum, { color: c.color }]}>{c.number}</Text>
                  <Text style={[styles.contactAvail, { color: colors.mutedForeground }]}>{c.available}</Text>
                </View>
                <Feather name="phone" size={18} color={colors.success} />
              </Pressable>
            ))}
          </Card>
        </Animated.View>

        {/* Tips */}
        <Animated.View entering={fadeInDownDelay(240)}>
          <Card style={[styles.tipsCard, { backgroundColor: colors.infoLight }]}>
            <Feather name="info" size={18} color={colors.info} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[styles.tipsTitle, { color: colors.foreground }]}>In case of emergency:</Text>
              {[
                "Stay calm and find a safe location",
                "Call the relevant emergency number",
                "Your GPS location is automatically shared with Bringo team",
                "Do not engage with aggressive individuals",
              ].map((t, i) => (
                <Text key={i} style={[styles.tipText, { color: colors.info }]}>• {t}</Text>
              ))}
            </View>
          </Card>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  sosCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 20,
    shadowColor: "#FF4D4F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  sosIcon: { width: 60, height: 60, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  sosTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#FFF" },
  sosSub: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.8)", marginTop: 2 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  serviceGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  serviceCard: {
    width: "47%",
    alignItems: "center",
    padding: 16,
    gap: 6,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  serviceIcon: { width: 52, height: 52, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  serviceName: { fontSize: 13, fontFamily: "Inter_700Bold" },
  serviceNum: { fontSize: 18, fontFamily: "Inter_700Bold" },
  serviceDesc: { fontSize: 10, fontFamily: "Inter_400Regular", textAlign: "center" },
  contactRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16 },
  contactIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  contactInfo: { flex: 1, gap: 2 },
  contactName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  contactNum: { fontSize: 15, fontFamily: "Inter_700Bold" },
  contactAvail: { fontSize: 11, fontFamily: "Inter_400Regular" },
  tipsCard: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 14 },
  tipsTitle: { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 4 },
  tipText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
});

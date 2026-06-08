import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated as RNAnimated, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const EMERGENCY_CONTACTS = [
  { name: "Police", number: "100", icon: "shield", color: "#4A90E2" },
  { name: "Ambulance", number: "108", icon: "activity", color: "#FF4D4F" },
  { name: "Bringo Support", number: "1800-123-456", icon: "headphones", color: "#FF6B35" },
  { name: "Emergency", number: "112", icon: "alert-circle", color: "#7C5CFF" },
];

export default function SosScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [countdown, setCountdown] = useState(5);
  const [sosSent, setSosSent] = useState(false);
  const [pressing, setPressing] = useState(false);
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(pulseAnim, { toValue: 1.12, duration: 700, useNativeDriver: true }),
        RNAnimated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, []);

  const startSos = () => {
    setPressing(true);
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    let count = 5;
    countdownRef.current = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (count <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current);
        setSosSent(true);
        setPressing(false);
        if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }, 1000);
  };

  const [callContact, setCallContact] = useState<{ name: string; number: string } | null>(null);

  const cancelSos = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setPressing(false);
    setCountdown(5);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ConfirmModal
        visible={!!callContact}
        onClose={() => setCallContact(null)}
        title={`Call ${callContact?.name ?? ""}`}
        body={`Dial ${callContact?.number ?? ""}`}
        confirmText="Call"
        onConfirm={() => { if (callContact) Linking.openURL(`tel:${callContact.number}`); }}
        variant="info"
        icon="phone"
      />
      <ScreenHeader title="SOS & Safety" showBack />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 16 : 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* SOS Button */}
        <View style={styles.sosSection}>
          <Text style={[styles.sosHint, { color: colors.mutedForeground }]}>
            {sosSent ? "SOS alert sent to emergency contacts" : pressing ? `Hold for ${countdown} seconds...` : "Press & hold to send SOS alert"}
          </Text>

          <Pressable
            onPressIn={!sosSent ? startSos : undefined}
            onPressOut={pressing ? cancelSos : undefined}
            disabled={sosSent}
          >
            <RNAnimated.View style={[styles.sosPulse, { backgroundColor: "#FF4D4F20", transform: [{ scale: pulseAnim }] }]} />
            <View style={[styles.sosButton, { backgroundColor: sosSent ? colors.success : "#FF4D4F" }]}>
              {sosSent ? (
                <Feather name="check" size={40} color="#FFF" />
              ) : (
                <Text style={styles.sosButtonText}>SOS</Text>
              )}
            </View>
          </Pressable>

          {sosSent && (
            <View style={[styles.sentBadge, { backgroundColor: colors.successLight, borderRadius: 16 }]}>
              <Feather name="check-circle" size={16} color={colors.success} />
              <Text style={[styles.sentText, { color: colors.success }]}>
                Alert sent! Help is on the way.
              </Text>
            </View>
          )}
        </View>

        {/* Emergency Contacts */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Emergency Contacts</Text>
        <View style={styles.contactsGrid}>
          {EMERGENCY_CONTACTS.map((c) => (
            <Pressable
              key={c.name}
              onPress={() => {
                setCallContact({ name: c.name, number: c.number });
              }}
              style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}
            >
              <View style={[styles.contactIcon, { backgroundColor: c.color + "18" }]}>
                <Feather name={c.icon as any} size={22} color={c.color} />
              </View>
              <Text style={[styles.contactName, { color: colors.foreground }]}>{c.name}</Text>
              <Text style={[styles.contactNum, { color: c.color }]}>{c.number}</Text>
            </Pressable>
          ))}
        </View>

        {/* Safety Actions */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Safety Actions</Text>
        <Card padding={0}>
          {[
            { icon: "camera", label: "Take Safety Photo", sub: "Document your surroundings", color: "#4A90E2" },
            { icon: "map-pin", label: "Share Live Location", sub: "Share with emergency contact", color: "#34C759" },
            { icon: "file-text", label: "Report Incident", sub: "Harassment, theft, accident", color: "#FF9A3D" },
          ].map((action, i) => (
            <Pressable
              key={action.label}
              onPress={() => router.push("/safety/incident" as any)}
              style={[
                styles.actionRow,
                { borderBottomColor: colors.border, borderBottomWidth: i < 2 ? 1 : 0 },
              ]}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + "14" }]}>
                <Feather name={action.icon as any} size={18} color={action.color} />
              </View>
              <View style={styles.actionText}>
                <Text style={[styles.actionLabel, { color: colors.foreground }]}>{action.label}</Text>
                <Text style={[styles.actionSub, { color: colors.mutedForeground }]}>{action.sub}</Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </Card>

        {/* Info */}
        <Card style={[styles.infoCard, { backgroundColor: colors.infoLight }]}>
          <Feather name="info" size={16} color={colors.info} />
          <Text style={[styles.infoText, { color: colors.info }]}>
            Your GPS location is automatically shared when SOS is triggered. Stay calm and find a safe place.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  sosSection: { alignItems: "center", gap: 16, paddingVertical: 20 },
  sosHint: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center" },
  sosPulse: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    alignSelf: "center",
    marginTop: -20,
  },
  sosButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF4D4F",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  sosButtonText: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    color: "#FFF",
    letterSpacing: 2,
  },
  sentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sentText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  sectionTitle: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  contactsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  contactCard: {
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
  contactIcon: { width: 52, height: 52, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  contactName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  contactNum: { fontSize: 14, fontFamily: "Inter_700Bold" },
  actionRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16 },
  actionIcon: { width: 40, height: 40, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  actionText: { flex: 1, gap: 2 },
  actionLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  actionSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  infoCard: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 14 },
  infoText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
});

import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const UPI_APPS = [
  { id: "gpay", name: "Google Pay", icon: "smartphone", color: "#4285F4" },
  { id: "phonepe", name: "PhonePe", icon: "zap", color: "#6739B7" },
  { id: "paytm", name: "Paytm", icon: "credit-card", color: "#00BAF2" },
  { id: "bhim", name: "BHIM", icon: "shield", color: "#00A859" },
];

export default function UpiScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [upiId, setUpiId] = useState("rahul.delivery@okaxis");
  const [selectedApp, setSelectedApp] = useState("gpay");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(true);

  const handleVerify = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setVerified(true);
    Alert.alert("✓ Verified", "UPI ID verified successfully!");
  };

  const handleSave = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    Alert.alert("Saved", "UPI details updated successfully.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="UPI Details" showBack />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 20 : 0 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(50).duration(400)}>
          <Card style={styles.infoCard}>
            <View style={[styles.infoIcon, { backgroundColor: colors.accentTealLight }]}>
              <Feather name="zap" size={24} color={colors.accentTeal} />
            </View>
            <View style={styles.infoText}>
              <Text style={[styles.infoTitle, { color: colors.foreground }]}>
                Instant Payments
              </Text>
              <Text style={[styles.infoSub, { color: colors.mutedForeground }]}>
                Receive payments directly to your UPI ID within seconds
              </Text>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>UPI App</Text>
          <View style={styles.appGrid}>
            {UPI_APPS.map((app) => (
              <Pressable
                key={app.id}
                onPress={() => setSelectedApp(app.id)}
                style={[
                  styles.appCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: selectedApp === app.id ? app.color : colors.border,
                    borderWidth: selectedApp === app.id ? 2 : 1,
                    borderRadius: colors.radiusSm,
                  },
                ]}
              >
                <View style={[styles.appIcon, { backgroundColor: app.color + "18" }]}>
                  <Feather name={app.icon as any} size={20} color={app.color} />
                </View>
                <Text style={[styles.appName, { color: colors.foreground }]}>{app.name}</Text>
                {selectedApp === app.id && (
                  <View style={[styles.appCheck, { backgroundColor: app.color }]}>
                    <Feather name="check" size={10} color="#FFF" />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>UPI ID</Text>
          <Card style={styles.upiCard}>
            <Input
              label="Enter UPI ID"
              value={upiId}
              onChangeText={setUpiId}
              placeholder="yourname@upi"
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Feather name="at-sign" size={18} color={colors.mutedForeground} />}
            />
            {verified && (
              <View style={[styles.verifiedRow, { backgroundColor: colors.successLight, borderRadius: 12 }]}>
                <Feather name="check-circle" size={16} color={colors.success} />
                <Text style={[styles.verifiedText, { color: colors.success }]}>UPI ID verified</Text>
              </View>
            )}
            <Button
              title={verified ? "Re-verify UPI ID" : "Verify UPI ID"}
              onPress={handleVerify}
              variant={verified ? "outline" : "primary"}
              loading={loading}
              size="lg"
            />
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Card style={[styles.noteCard, { backgroundColor: colors.infoLight }]}>
            <Feather name="info" size={16} color={colors.info} />
            <Text style={[styles.noteText, { color: colors.info }]}>
              Your UPI ID is used for instant payment transfers. Ensure it is linked to an active bank account.
            </Text>
          </Card>
        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <Button title="Save UPI Details" onPress={handleSave} size="xl" loading={loading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  infoCard: { flexDirection: "row", alignItems: "center", gap: 16 },
  infoIcon: { width: 56, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  infoText: { flex: 1, gap: 4 },
  infoTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  infoSub: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4, marginBottom: 12 },
  appGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  appCard: {
    width: "47%",
    alignItems: "center",
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
    position: "relative",
  },
  appIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  appName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  appCheck: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  upiCard: { gap: 16 },
  verifiedRow: { flexDirection: "row", alignItems: "center", gap: 8, padding: 10 },
  verifiedText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  noteCard: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 14 },
  noteText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});

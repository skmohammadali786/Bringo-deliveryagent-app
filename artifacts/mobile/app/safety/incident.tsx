import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const INCIDENT_TYPES = [
  { id: "harassment", label: "Harassment", icon: "user-x", color: "#FF4D4F" },
  { id: "theft", label: "Theft / Robbery", icon: "alert-triangle", color: "#FF9A3D" },
  { id: "accident", label: "Road Accident", icon: "truck", color: "#7C5CFF" },
  { id: "fraud", label: "Customer Fraud", icon: "shield", color: "#4A90E2" },
  { id: "order", label: "Order Dispute", icon: "package", color: "#FF6B35" },
  { id: "other", label: "Other", icon: "more-horizontal", color: "#5B5B5B" },
];

export default function IncidentScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string>("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selected || !description.trim()) {
      Alert.alert("Missing Info", "Please select incident type and describe what happened.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    Alert.alert(
      "Incident Reported",
      "Your incident report has been submitted. Our safety team will contact you within 30 minutes.",
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScreenHeader title="Report Incident" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 16 : 16 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Banner */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)}>
          <Card style={[styles.banner, { backgroundColor: colors.destructiveLight, borderColor: colors.destructive + "30" }]}>
            <Feather name="alert-circle" size={22} color={colors.destructive} />
            <Text style={[styles.bannerText, { color: colors.foreground }]}>
              Your safety is our top priority. In immediate danger, call 112.
            </Text>
          </Card>
        </Animated.View>

        {/* Incident Type */}
        <Animated.View entering={FadeInDown.delay(60).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Incident Type</Text>
          <View style={styles.typeGrid}>
            {INCIDENT_TYPES.map((t) => (
              <Pressable
                key={t.id}
                onPress={() => setSelected(t.id)}
                style={[
                  styles.typeCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: selected === t.id ? t.color : colors.border,
                    borderWidth: selected === t.id ? 2 : 1,
                    borderRadius: colors.radiusSm,
                  },
                ]}
              >
                <View style={[styles.typeIcon, { backgroundColor: t.color + "18" }]}>
                  <Feather name={t.icon as any} size={20} color={t.color} />
                </View>
                <Text style={[styles.typeLabel, { color: colors.foreground }]}>{t.label}</Text>
                {selected === t.id && (
                  <View style={[styles.typeCheck, { backgroundColor: t.color }]}>
                    <Feather name="check" size={10} color="#FFF" />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Description */}
        <Animated.View entering={FadeInDown.delay(120).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Describe what happened</Text>
          <Card style={styles.descCard}>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              placeholder="Provide as much detail as possible — location, time, persons involved..."
              placeholderTextColor={colors.mutedForeground}
              style={[styles.descInput, { color: colors.foreground }]}
              textAlignVertical="top"
            />
          </Card>
        </Animated.View>

        {/* Attachments */}
        <Animated.View entering={FadeInDown.delay(180).duration(400)}>
          <Card style={styles.attachCard}>
            <Feather name="camera" size={18} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.attachLabel, { color: colors.foreground }]}>Add Photo Evidence</Text>
              <Text style={[styles.attachSub, { color: colors.mutedForeground }]}>Optional — helps us investigate faster</Text>
            </View>
            <Feather name="plus" size={20} color={colors.primary} />
          </Card>
        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <Button
          title="Submit Incident Report"
          onPress={handleSubmit}
          loading={loading}
          disabled={!selected || !description.trim()}
          size="xl"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 20 },
  banner: { flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1 },
  bannerText: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium", lineHeight: 20 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4, marginBottom: 12 },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  typeCard: {
    width: "47%",
    alignItems: "center",
    padding: 16,
    gap: 8,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  typeIcon: { width: 52, height: 52, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  typeLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  typeCheck: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  descCard: { padding: 14 },
  descInput: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22, minHeight: 120 },
  attachCard: { flexDirection: "row", alignItems: "center", gap: 14 },
  attachLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  attachSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});

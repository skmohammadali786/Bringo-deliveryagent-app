import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { fadeInDown, fadeInDownDelay } from "@/constants/animations";

const ISSUE_TYPES = [
  { id: "payment", label: "Payment Issue", icon: "credit-card", color: "#34C759" },
  { id: "order", label: "Order Problem", icon: "package", color: "#FF6B35" },
  { id: "app", label: "App / Technical", icon: "smartphone", color: "#4A90E2" },
  { id: "account", label: "Account Issue", icon: "user", color: "#7C5CFF" },
  { id: "safety", label: "Safety Concern", icon: "shield", color: "#FF4D4F" },
  { id: "other", label: "Other", icon: "more-horizontal", color: "#5B5B5B" },
];

const PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const;

export default function IssueScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [issueType, setIssueType] = useState("");
  const [priority, setPriority] = useState<typeof PRIORITIES[number]>("Medium");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationModal, setValidationModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [ticketNum] = useState(() => Math.floor(Math.random() * 90000 + 10000));

  const handleSubmit = async () => {
    if (!issueType || !description.trim()) {
      setValidationModal(true);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSuccessModal(true);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ConfirmModal
        visible={validationModal}
        onClose={() => setValidationModal(false)}
        title="Fill All Fields"
        body="Please select an issue type and describe the problem before submitting."
        confirmText="OK"
        onConfirm={() => setValidationModal(false)}
        cancelText=""
        variant="warning"
        icon="alert-triangle"
      />
      <ConfirmModal
        visible={successModal}
        onClose={() => { setSuccessModal(false); router.back(); }}
        title="Ticket Created"
        body={`Your support ticket #BRG-${ticketNum} has been created. We'll respond within 24 hours.`}
        confirmText="Done"
        onConfirm={() => router.back()}
        cancelText=""
        variant="success"
        icon="check-circle"
      />
      <ScreenHeader title="Raise Issue" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 16 : 16 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Issue Type */}
        <Animated.View entering={fadeInDown(0)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Issue Type</Text>
          <View style={styles.issueGrid}>
            {ISSUE_TYPES.map((t) => (
              <Pressable
                key={t.id}
                onPress={() => setIssueType(t.id)}
                style={[
                  styles.issueCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: issueType === t.id ? t.color : colors.border,
                    borderWidth: issueType === t.id ? 2 : 1,
                    borderRadius: colors.radiusSm,
                  },
                ]}
              >
                <View style={[styles.issueIcon, { backgroundColor: t.color + "18" }]}>
                  <Feather name={t.icon as any} size={18} color={t.color} />
                </View>
                <Text style={[styles.issueLabel, { color: colors.foreground }]}>{t.label}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Priority */}
        <Animated.View entering={fadeInDownDelay(80)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Priority</Text>
          <View style={styles.priorityRow}>
            {PRIORITIES.map((p) => {
              const pColors: Record<string, string> = { Low: colors.success, Medium: colors.warning, High: colors.primary, Urgent: colors.destructive };
              return (
                <Pressable
                  key={p}
                  onPress={() => setPriority(p)}
                  style={[
                    styles.priorityChip,
                    {
                      backgroundColor: priority === p ? pColors[p] : colors.card,
                      borderColor: priority === p ? pColors[p] : colors.border,
                      borderRadius: 12,
                    },
                  ]}
                >
                  <Text style={[styles.priorityText, { color: priority === p ? "#FFF" : colors.foreground }]}>{p}</Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Description */}
        <Animated.View entering={fadeInDownDelay(160)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Describe the issue</Text>
          <Card style={styles.descCard}>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              placeholder="Explain what happened, when it happened, and any relevant order numbers..."
              placeholderTextColor={colors.mutedForeground}
              style={[styles.descInput, { color: colors.foreground }]}
              textAlignVertical="top"
            />
            <Text style={[styles.charCount, { color: colors.mutedForeground }]}>{description.length}/500</Text>
          </Card>
        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <Button
          title="Submit Ticket"
          onPress={handleSubmit}
          loading={loading}
          disabled={!issueType || !description.trim()}
          size="xl"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 20 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold", letterSpacing: -0.3, marginBottom: 12 },
  issueGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  issueCard: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  issueIcon: { width: 36, height: 36, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  issueLabel: { flex: 1, fontSize: 12, fontFamily: "Inter_600SemiBold" },
  priorityRow: { flexDirection: "row", gap: 10 },
  priorityChip: { flex: 1, alignItems: "center", paddingVertical: 12, borderWidth: 1 },
  priorityText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  descCard: { gap: 8 },
  descInput: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22, minHeight: 120 },
  charCount: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "right" },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});

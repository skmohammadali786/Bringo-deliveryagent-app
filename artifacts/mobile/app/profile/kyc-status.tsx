import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/store/authStore";
import { fadeInDown, fadeInDownDelay } from "@/constants/animations";

const KYC_STEPS = [
  { id: "personal", label: "Personal Information", icon: "user", route: "/profile/personal" },
  { id: "vehicle", label: "Vehicle Details", icon: "truck", route: "/profile/vehicle" },
  { id: "documents", label: "Documents Upload", icon: "file-text", route: "/profile/documents" },
  { id: "bank", label: "Bank Account", icon: "credit-card", route: "/profile/bank" },
  { id: "review", label: "Under Review", icon: "clock", route: null },
  { id: "approved", label: "KYC Approved", icon: "shield", route: null },
];

export default function KycStatusScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { kycStatus } = useAuthStore();

  const completedSteps = 4;
  const statusConfig = {
    approved: { color: colors.success, label: "Verified ✓", bg: colors.successLight, icon: "check-circle" as const },
    under_review: { color: colors.warning, label: "Under Review", bg: colors.warningLight, icon: "clock" as const },
    rejected: { color: colors.destructive, label: "Action Required", bg: colors.destructiveLight, icon: "alert-circle" as const },
    pending: { color: colors.info, label: "Pending Submission", bg: colors.infoLight, icon: "info" as const },
    not_started: { color: colors.mutedForeground, label: "Not Started", bg: colors.muted, icon: "circle" as const },
  };
  const cfg = statusConfig[kycStatus] ?? statusConfig.pending;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="KYC Status" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 16 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Banner */}
        <Animated.View entering={fadeInDown(0)}>
          <Card style={[styles.statusBanner, { backgroundColor: cfg.bg, borderColor: cfg.color + "30" }]}>
            <View style={[styles.statusIcon, { backgroundColor: cfg.color + "20" }]}>
              <Feather name={cfg.icon} size={28} color={cfg.color} />
            </View>
            <View style={styles.statusInfo}>
              <Text style={[styles.statusLabel, { color: colors.foreground }]}>KYC Status</Text>
              <Text style={[styles.statusValue, { color: cfg.color }]}>{cfg.label}</Text>
              {kycStatus === "under_review" && (
                <Text style={[styles.statusSub, { color: colors.mutedForeground }]}>
                  Expected approval in 1-2 business days
                </Text>
              )}
            </View>
          </Card>
        </Animated.View>

        {/* Progress */}
        <Animated.View entering={fadeInDownDelay(60)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Verification Steps</Text>
          <Card padding={0}>
            {KYC_STEPS.map((step, i) => {
              const isCompleted = i < completedSteps;
              const isCurrent = i === completedSteps;
              return (
                <Pressable
                  key={step.id}
                  onPress={() => step.route ? router.push(step.route as any) : null}
                  style={[
                    styles.stepRow,
                    { borderBottomColor: colors.border, borderBottomWidth: i < KYC_STEPS.length - 1 ? 1 : 0 },
                  ]}
                >
                  <View
                    style={[
                      styles.stepCircle,
                      {
                        backgroundColor: isCompleted ? colors.success : isCurrent ? colors.primaryLight : colors.muted,
                        borderColor: isCompleted ? colors.success : isCurrent ? colors.primary : colors.border,
                        borderWidth: 2,
                      },
                    ]}
                  >
                    {isCompleted ? (
                      <Feather name="check" size={14} color="#FFF" />
                    ) : (
                      <Feather name={step.icon as any} size={14} color={isCurrent ? colors.primary : colors.mutedForeground} />
                    )}
                  </View>
                  <Text style={[styles.stepLabel, { color: isCompleted || isCurrent ? colors.foreground : colors.mutedForeground }]}>
                    {step.label}
                  </Text>
                  {isCompleted && (
                    <View style={[styles.completedBadge, { backgroundColor: colors.successLight }]}>
                      <Text style={[styles.completedText, { color: colors.success }]}>Done</Text>
                    </View>
                  )}
                  {step.route && !isCompleted && (
                    <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                  )}
                </Pressable>
              );
            })}
          </Card>
        </Animated.View>

        {/* Action */}
        {kycStatus === "rejected" && (
          <Animated.View entering={fadeInDownDelay(120)}>
            <Card style={[styles.rejectedCard, { backgroundColor: colors.destructiveLight, borderColor: colors.destructive + "30" }]}>
              <Feather name="alert-triangle" size={18} color={colors.destructive} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.rejectedTitle, { color: colors.foreground }]}>Action Required</Text>
                <Text style={[styles.rejectedSub, { color: colors.mutedForeground }]}>
                  Your documents were rejected. Please re-upload valid documents.
                </Text>
              </View>
            </Card>
            <Button title="Re-upload Documents" onPress={() => router.push("/profile/documents" as any)} size="xl" style={{ marginTop: 12 }} />
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  statusBanner: { flexDirection: "row", alignItems: "center", gap: 16, borderWidth: 1 },
  statusIcon: { width: 60, height: 60, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  statusInfo: { flex: 1, gap: 3 },
  statusLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  statusValue: { fontSize: 20, fontFamily: "Inter_700Bold" },
  statusSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16 },
  stepCircle: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  stepLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_600SemiBold" },
  completedBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  completedText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  rejectedCard: { flexDirection: "row", alignItems: "flex-start", gap: 12, borderWidth: 1 },
  rejectedTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  rejectedSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
});

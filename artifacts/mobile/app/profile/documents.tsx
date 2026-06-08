import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const DOCUMENTS = [
  { id: "aadhar", label: "Aadhaar Card", icon: "credit-card", status: "verified", required: true },
  { id: "pan", label: "PAN Card", icon: "file-text", status: "verified", required: true },
  { id: "dl", label: "Driving License", icon: "truck", status: "verified", required: true },
  { id: "photo", label: "Profile Photo", icon: "camera", status: "verified", required: true },
  { id: "rc", label: "Vehicle RC Book", icon: "package", status: "pending", required: true },
  { id: "insurance", label: "Vehicle Insurance", icon: "shield", status: "expired", required: true },
  { id: "bank", label: "Bank Statement / Passbook", icon: "home", status: "not_uploaded", required: false },
];

const STATUS_CONFIG = {
  verified: { label: "Verified", color: "#34C759", icon: "check-circle" as const },
  pending: { label: "Under Review", color: "#FF9A3D", icon: "clock" as const },
  expired: { label: "Expired", color: "#FF4D4F", icon: "alert-circle" as const },
  not_uploaded: { label: "Not Uploaded", color: "#5B5B5B", icon: "upload" as const },
};

export default function DocumentsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [uploading, setUploading] = useState<string | null>(null);

  const handleUpload = async (docId: string) => {
    setUploading(docId);
    await new Promise((r) => setTimeout(r, 1500));
    setUploading(null);
    Alert.alert("Uploaded", "Document uploaded successfully. It will be reviewed within 24 hours.");
  };

  const verified = DOCUMENTS.filter((d) => d.status === "verified").length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Documents" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 16 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)}>
          <Card style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressTitle, { color: colors.foreground }]}>Verification Progress</Text>
              <Text style={[styles.progressCount, { color: colors.success }]}>
                {verified}/{DOCUMENTS.length} Verified
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: colors.muted }]}>
              <View
                style={[
                  styles.progressFill,
                  { backgroundColor: colors.success, width: `${(verified / DOCUMENTS.length) * 100}%` },
                ]}
              />
            </View>
          </Card>
        </Animated.View>

        {/* Documents List */}
        <Card padding={0}>
          {DOCUMENTS.map((doc, i) => {
            const cfg = STATUS_CONFIG[doc.status as keyof typeof STATUS_CONFIG];
            return (
              <View
                key={doc.id}
                style={[
                  styles.docRow,
                  {
                    borderBottomColor: colors.border,
                    borderBottomWidth: i < DOCUMENTS.length - 1 ? 1 : 0,
                  },
                ]}
              >
                <View style={[styles.docIcon, { backgroundColor: cfg.color + "14" }]}>
                  <Feather name={doc.icon as any} size={18} color={cfg.color} />
                </View>
                <View style={styles.docInfo}>
                  <View style={styles.docTop}>
                    <Text style={[styles.docLabel, { color: colors.foreground }]}>{doc.label}</Text>
                    {!doc.required && (
                      <View style={[styles.optionalTag, { backgroundColor: colors.muted }]}>
                        <Text style={[styles.optionalText, { color: colors.mutedForeground }]}>Optional</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.docStatus}>
                    <Feather name={cfg.icon} size={12} color={cfg.color} />
                    <Text style={[styles.docStatusText, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>
                </View>
                {["not_uploaded", "expired"].includes(doc.status) && (
                  <Pressable
                    onPress={() => handleUpload(doc.id)}
                    style={[styles.uploadBtn, { backgroundColor: colors.primaryLight, borderRadius: 10 }]}
                  >
                    {uploading === doc.id ? (
                      <Text style={[styles.uploadText, { color: colors.primary }]}>...</Text>
                    ) : (
                      <>
                        <Feather name="upload" size={14} color={colors.primary} />
                        <Text style={[styles.uploadText, { color: colors.primary }]}>Upload</Text>
                      </>
                    )}
                  </Pressable>
                )}
              </View>
            );
          })}
        </Card>

        {/* Info */}
        <Card style={[styles.infoCard, { backgroundColor: colors.infoLight }]}>
          <Feather name="info" size={16} color={colors.info} />
          <Text style={[styles.infoText, { color: colors.info }]}>
            All documents are securely encrypted and processed in compliance with data protection laws.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  progressCard: { gap: 12 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  progressTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  progressCount: { fontSize: 14, fontFamily: "Inter_700Bold" },
  progressBar: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  docRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14 },
  docIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  docInfo: { flex: 1, gap: 4 },
  docTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  docLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  optionalTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  optionalText: { fontSize: 10, fontFamily: "Inter_500Medium" },
  docStatus: { flexDirection: "row", alignItems: "center", gap: 4 },
  docStatusText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  uploadBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 8 },
  uploadText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  infoCard: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 14 },
  infoText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
});

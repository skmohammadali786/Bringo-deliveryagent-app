import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Input } from "@/components/ui/Input";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/store/authStore";

const VEHICLE_TYPES = [
  { id: "bike",    label: "Bike",    icon: "truck" },
  { id: "scooter", label: "Scooter", icon: "truck" },
  { id: "cycle",   label: "Cycle",   icon: "truck" },
  { id: "car",     label: "Car",     icon: "truck" },
] as const;

type DocKey = "RC Book" | "Pollution Certificate";

const REQUIRED_DOCS: { key: DocKey; label: string; defaultStatus: string }[] = [
  { key: "RC Book",               label: "RC Book",               defaultStatus: "Uploaded" },
  { key: "Pollution Certificate", label: "Pollution Certificate", defaultStatus: "Expired"  },
];

export default function VehicleScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { agent } = useAuthStore();
  const [vehicleType, setVehicleType] = useState(agent?.vehicleType ?? "bike");
  const [regNumber, setRegNumber]     = useState(agent?.vehicleNumber ?? "KA01AB1234");
  const [loading, setLoading]         = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  /* Per-document uploaded file name (null = not yet picked) */
  const [docFiles, setDocFiles] = useState<Record<DocKey, string | null>>({
    "RC Book":               "rc_book.pdf",
    "Pollution Certificate": null,
  });
  const [uploadingDoc, setUploadingDoc] = useState<DocKey | null>(null);

  const pickDoc = async (key: DocKey) => {
    if (Platform.OS === "web") {
      setDocFiles((prev) => ({ ...prev, [key]: `${key.toLowerCase().replace(/ /g, "_")}_new.jpg` }));
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    setUploadingDoc(key);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.85,
      });
      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        const filename = uri.split("/").pop() ?? "document.jpg";
        setDocFiles((prev) => ({ ...prev, [key]: filename }));
      }
    } finally {
      setUploadingDoc(null);
    }
  };

  const getDocColor = (key: DocKey) => {
    const file = docFiles[key];
    if (!file) return colors.mutedForeground;
    if (key === "Pollution Certificate" && file === null) return colors.destructive;
    return colors.success;
  };

  const getDocLabel = (key: DocKey) => {
    const file = docFiles[key];
    if (!file) return key === "Pollution Certificate" ? "Expired" : "Not uploaded";
    return file.length > 22 ? `${file.slice(0, 20)}…` : file;
  };

  const handleSave = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSuccessModal(true);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ConfirmModal
        visible={successModal}
        onClose={() => setSuccessModal(false)}
        title="Saved"
        body="Vehicle details updated successfully."
        confirmText="OK"
        onConfirm={() => router.back()}
        variant="success"
        icon="check-circle"
      />
      <ScreenHeader title="Vehicle Details" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: 16 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Vehicle type */}
        <Card style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>VEHICLE TYPE</Text>
          <View style={styles.vehicleGrid}>
            {VEHICLE_TYPES.map((v) => (
              <Pressable
                key={v.id}
                onPress={() => setVehicleType(v.id)}
                style={[
                  styles.vehicleOption,
                  {
                    backgroundColor: vehicleType === v.id ? colors.primaryLight : colors.muted,
                    borderColor:     vehicleType === v.id ? colors.primary      : colors.border,
                    borderRadius: colors.radiusSm,
                  },
                ]}
              >
                <Feather
                  name="truck"
                  size={22}
                  color={vehicleType === v.id ? colors.primary : colors.mutedForeground}
                />
                <Text style={[styles.vehicleLabel, { color: vehicleType === v.id ? colors.primary : colors.foreground }]}>
                  {v.label}
                </Text>
                {vehicleType === v.id && (
                  <View style={[styles.checkDot, { backgroundColor: colors.primary }]}>
                    <Feather name="check" size={10} color="#FFF" />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </Card>

        {/* Vehicle details */}
        <Card style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>VEHICLE DETAILS</Text>
          <Input
            label="Registration Number"
            value={regNumber}
            onChangeText={setRegNumber}
            placeholder="e.g. KA01AB1234"
            autoCapitalize="characters"
            icon={<Feather name="hash" size={18} color={colors.mutedForeground} />}
          />
        </Card>

        {/* Required documents */}
        <Card style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>DOCUMENTS</Text>

          {REQUIRED_DOCS.map((doc) => {
            const uploaded = !!docFiles[doc.key];
            const uploading = uploadingDoc === doc.key;
            const statusColor = uploaded ? colors.success : colors.destructive;
            return (
              <Pressable
                key={doc.key}
                onPress={() => pickDoc(doc.key)}
                style={({ pressed }) => [
                  styles.docRow,
                  {
                    borderBottomColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <View style={[styles.docIconWrap, { backgroundColor: statusColor + "18" }]}>
                  <Feather name="file-text" size={16} color={statusColor} />
                </View>
                <View style={styles.docInfo}>
                  <Text style={[styles.docLabel, { color: colors.foreground }]}>{doc.label}</Text>
                  <Text style={[styles.docFile, { color: uploaded ? colors.success : colors.mutedForeground }]}>
                    {uploading ? "Uploading…" : getDocLabel(doc.key)}
                  </Text>
                </View>
                <View style={[styles.uploadBtn, { backgroundColor: colors.primaryLight, borderRadius: 10 }]}>
                  <Feather
                    name={uploading ? "loader" : uploaded ? "refresh-cw" : "upload"}
                    size={14}
                    color={colors.primary}
                  />
                  <Text style={[styles.uploadBtnText, { color: colors.primary }]}>
                    {uploading ? "…" : uploaded ? "Replace" : "Upload"}
                  </Text>
                </View>
              </Pressable>
            );
          })}

          {/* Insurance — optional, no upload required */}
          <View style={[styles.docRow, { borderBottomWidth: 0, opacity: 0.65 }]}>
            <View style={[styles.docIconWrap, { backgroundColor: colors.muted }]}>
              <Feather name="shield" size={16} color={colors.mutedForeground} />
            </View>
            <View style={styles.docInfo}>
              <View style={styles.docLabelRow}>
                <Text style={[styles.docLabel, { color: colors.foreground }]}>Insurance Certificate</Text>
                <View style={[styles.optionalBadge, { backgroundColor: colors.muted }]}>
                  <Text style={[styles.optionalText, { color: colors.mutedForeground }]}>Optional</Text>
                </View>
              </View>
              <Text style={[styles.docFile, { color: colors.mutedForeground }]}>Not required to deliver</Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <Button title="Save Vehicle Details" onPress={handleSave} loading={loading} size="xl" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 16 },
  section: { gap: 16 },
  sectionLabel: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.8 },
  vehicleGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  vehicleOption: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderWidth: 1.5,
    position: "relative",
  },
  vehicleLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  checkDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  docRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  docIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  docInfo: { flex: 1, gap: 2 },
  docLabelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  docLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  docFile: { fontSize: 11, fontFamily: "Inter_400Regular" },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  uploadBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  optionalBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  optionalText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});

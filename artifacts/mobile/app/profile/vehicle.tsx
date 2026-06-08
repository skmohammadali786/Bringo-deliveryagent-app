import { Feather } from "@expo/vector-icons";
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
  { id: "bike", label: "Bike", icon: "tool" },
  { id: "scooter", label: "Scooter", icon: "tool" },
  { id: "cycle", label: "Cycle", icon: "tool" },
  { id: "car", label: "Car", icon: "tool" },
] as const;

export default function VehicleScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { agent } = useAuthStore();
  const [vehicleType, setVehicleType] = useState(agent?.vehicleType ?? "bike");
  const [regNumber, setRegNumber] = useState(agent?.vehicleNumber ?? "KA01AB1234");
  const [rcBook, setRcBook] = useState("Uploaded");
  const [insurance, setInsurance] = useState("Valid till Dec 2025");
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

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
                    borderColor: vehicleType === v.id ? colors.primary : colors.border,
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
          <Input
            label="Insurance Status"
            value={insurance}
            onChangeText={setInsurance}
            placeholder="Insurance validity"
            icon={<Feather name="shield" size={18} color={colors.mutedForeground} />}
          />
        </Card>

        <Card style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>DOCUMENTS</Text>
          {[
            { label: "RC Book", status: "Uploaded", color: colors.success },
            { label: "Insurance Certificate", status: "Uploaded", color: colors.success },
            { label: "Pollution Certificate", status: "Expired", color: colors.destructive },
          ].map((doc) => (
            <View key={doc.label} style={[styles.docRow, { borderBottomColor: colors.border }]}>
              <Feather name="file-text" size={16} color={colors.mutedForeground} />
              <Text style={[styles.docLabel, { color: colors.foreground }]}>{doc.label}</Text>
              <View style={[styles.docStatus, { backgroundColor: doc.color + "18" }]}>
                <Text style={[styles.docStatusText, { color: doc.color }]}>{doc.status}</Text>
              </View>
              <Feather name="upload" size={16} color={colors.primary} />
            </View>
          ))}
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
  docLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  docStatus: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  docStatusText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});

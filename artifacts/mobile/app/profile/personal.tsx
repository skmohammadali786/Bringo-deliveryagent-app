import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Input } from "@/components/ui/Input";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/store/authStore";

export default function PersonalScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { agent } = useAuthStore();
  const [name, setName] = useState(agent?.name ?? "Rahul Sharma");
  const [email, setEmail] = useState(agent?.email ?? "rahul@example.com");
  const [phone, setPhone] = useState(agent?.phone ?? "9876543210");
  const [emergency, setEmergency] = useState("9123456789");
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
        body="Personal details updated successfully."
        confirmText="OK"
        onConfirm={() => router.back()}
        variant="success"
        icon="check-circle"
      />
      <ScreenHeader title="Personal Details" showBack />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 16 : 16 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar */}
        <Card style={styles.avatarCard}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.avatarInitial, { color: colors.primary }]}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.avatarInfo}>
            <Text style={[styles.avatarName, { color: colors.foreground }]}>{name}</Text>
            <Text style={[styles.avatarPhone, { color: colors.mutedForeground }]}>+91 {phone}</Text>
          </View>
          <View style={[styles.editBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="camera" size={16} color={colors.foreground} />
          </View>
        </Card>

        {/* Form */}
        <Card style={styles.formCard}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>BASIC INFORMATION</Text>
          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            icon={<Feather name="user" size={18} color={colors.mutedForeground} />}
          />
          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Feather name="mail" size={18} color={colors.mutedForeground} />}
          />
          <Input
            label="Mobile Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="10-digit mobile"
            keyboardType="phone-pad"
            icon={<Feather name="phone" size={18} color={colors.mutedForeground} />}
            editable={false}
          />
        </Card>

        <Card style={styles.formCard}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>EMERGENCY CONTACT</Text>
          <Input
            label="Emergency Contact Number"
            value={emergency}
            onChangeText={setEmergency}
            placeholder="Emergency contact"
            keyboardType="phone-pad"
            icon={<Feather name="alert-circle" size={18} color={colors.destructive} />}
          />
          <View style={[styles.noticeBox, { backgroundColor: colors.infoLight, borderRadius: 12 }]}>
            <Feather name="info" size={14} color={colors.info} />
            <Text style={[styles.noticeText, { color: colors.info }]}>
              This number will be used in emergency situations
            </Text>
          </View>
        </Card>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <Button title="Save Changes" onPress={handleSave} loading={loading} size="xl" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 16 },
  avatarCard: { flexDirection: "row", alignItems: "center", gap: 16 },
  avatarCircle: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  avatarInitial: { fontSize: 30, fontFamily: "Inter_700Bold" },
  avatarInfo: { flex: 1, gap: 4 },
  avatarName: { fontSize: 18, fontFamily: "Inter_700Bold" },
  avatarPhone: { fontSize: 14, fontFamily: "Inter_400Regular" },
  editBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  formCard: { gap: 16 },
  sectionLabel: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.8 },
  noticeBox: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12 },
  noticeText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});

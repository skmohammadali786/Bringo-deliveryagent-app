import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { fadeInDown, fadeInDownDelay } from "@/constants/animations";

const TIME_SLOTS = [
  { id: "1", label: "Today, 2:00 PM – 4:00 PM" },
  { id: "2", label: "Today, 4:00 PM – 6:00 PM" },
  { id: "3", label: "Today, 6:00 PM – 8:00 PM" },
  { id: "4", label: "Tomorrow, 10:00 AM – 12:00 PM" },
  { id: "5", label: "Tomorrow, 12:00 PM – 2:00 PM" },
  { id: "6", label: "Tomorrow, 2:00 PM – 4:00 PM" },
];

const REASONS = [
  "Customer requested later delivery",
  "Traffic / road block",
  "Shop delay",
  "Personal emergency",
  "Other",
];

export default function RescheduleScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [validationModal, setValidationModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const handleConfirm = async () => {
    if (!selectedSlot || !selectedReason) {
      setValidationModal(true);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSuccessModal(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ConfirmModal
        visible={validationModal}
        onClose={() => setValidationModal(false)}
        title="Missing Selection"
        body="Please select a time slot and a reason for rescheduling."
        confirmText="OK"
        onConfirm={() => setValidationModal(false)}
        cancelText=""
        variant="warning"
        icon="alert-triangle"
      />
      <ConfirmModal
        visible={successModal}
        onClose={() => { setSuccessModal(false); router.replace("/(tabs)/" as any); }}
        title="Rescheduled"
        body="Delivery has been rescheduled and the customer has been notified."
        confirmText="Done"
        onConfirm={() => router.replace("/(tabs)/" as any)}
        cancelText=""
        variant="success"
        icon="check-circle"
      />
      <ScreenHeader title="Reschedule Delivery" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 16 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Warning */}
        <Animated.View entering={fadeInDown(0)}>
          <Card style={[styles.warnCard, { backgroundColor: colors.warningLight, borderColor: colors.warning + "30" }]}>
            <Feather name="clock" size={20} color={colors.warning} />
            <Text style={[styles.warnText, { color: colors.foreground }]}>
              Rescheduling may affect your completion rate. Customer will be notified immediately.
            </Text>
          </Card>
        </Animated.View>

        {/* Time Slots */}
        <Animated.View entering={fadeInDownDelay(60)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Select New Time Slot</Text>
          <Card padding={0}>
            {TIME_SLOTS.map((slot, i) => (
              <Pressable
                key={slot.id}
                onPress={() => setSelectedSlot(slot.id)}
                style={[
                  styles.slotRow,
                  { borderBottomColor: colors.border, borderBottomWidth: i < TIME_SLOTS.length - 1 ? 1 : 0 },
                ]}
              >
                <Feather name="clock" size={16} color={selectedSlot === slot.id ? colors.primary : colors.mutedForeground} />
                <Text style={[styles.slotLabel, { color: colors.foreground }]}>{slot.label}</Text>
                {selectedSlot === slot.id ? (
                  <View style={[styles.radioFilled, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
                    <View style={styles.radioDot} />
                  </View>
                ) : (
                  <View style={[styles.radioEmpty, { borderColor: colors.border }]} />
                )}
              </Pressable>
            ))}
          </Card>
        </Animated.View>

        {/* Reason */}
        <Animated.View entering={fadeInDownDelay(120)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Reason for Rescheduling</Text>
          <Card padding={0}>
            {REASONS.map((reason, i) => (
              <Pressable
                key={reason}
                onPress={() => setSelectedReason(reason)}
                style={[
                  styles.slotRow,
                  { borderBottomColor: colors.border, borderBottomWidth: i < REASONS.length - 1 ? 1 : 0 },
                ]}
              >
                <Text style={[styles.slotLabel, { color: colors.foreground }]}>{reason}</Text>
                {selectedReason === reason ? (
                  <View style={[styles.radioFilled, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
                    <View style={styles.radioDot} />
                  </View>
                ) : (
                  <View style={[styles.radioEmpty, { borderColor: colors.border }]} />
                )}
              </Pressable>
            ))}
          </Card>
        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <Button
          title="Confirm Reschedule"
          onPress={handleConfirm}
          loading={loading}
          disabled={!selectedSlot || !selectedReason}
          size="xl"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  warnCard: { flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1 },
  warnText: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium", lineHeight: 20 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4, marginBottom: 4 },
  slotRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  slotLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  radioFilled: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#FFF" },
  radioEmpty: { width: 22, height: 22, borderRadius: 11, borderWidth: 2 },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});

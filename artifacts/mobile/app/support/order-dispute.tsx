import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";

const DISPUTE_TYPES = [
  { id: "missing", label: "Missing Item", icon: "package" },
  { id: "wrong", label: "Wrong Item", icon: "x-circle" },
  { id: "damaged", label: "Damaged Item", icon: "alert-triangle" },
  { id: "not_delivered", label: "Order Not Delivered", icon: "navigation" },
  { id: "payment", label: "Payment Issue", icon: "credit-card" },
  { id: "other", label: "Other", icon: "more-horizontal" },
];

export default function OrderDisputeScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders } = useOrderStore();
  const [disputeType, setDisputeType] = useState("");
  const [orderId, setOrderId] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationModal, setValidationModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const completedOrders = orders.filter((o) => ["delivered", "cancelled", "failed"].includes(o.status));

  const handleSubmit = async () => {
    if (!disputeType || !description.trim()) {
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
        title="Missing Information"
        body="Please select a dispute type and describe the issue before submitting."
        confirmText="OK"
        onConfirm={() => setValidationModal(false)}
        cancelText=""
        variant="warning"
        icon="alert-triangle"
      />
      <ConfirmModal
        visible={successModal}
        onClose={() => { setSuccessModal(false); router.back(); }}
        title="Dispute Filed"
        body="We've received your dispute and will review it within 24 hours. You'll receive a notification with the resolution."
        confirmText="Done"
        onConfirm={() => router.back()}
        cancelText=""
        variant="success"
        icon="check-circle"
      />
      <ScreenHeader title="Order Dispute" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 16 : 16 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Select Order */}
        <Card style={styles.section}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>SELECT ORDER</Text>
          {completedOrders.slice(0, 3).map((order) => (
            <Pressable
              key={order.id}
              onPress={() => setOrderId(order.id)}
              style={[
                styles.orderRow,
                {
                  backgroundColor: orderId === order.id ? colors.primaryLight : colors.muted,
                  borderColor: orderId === order.id ? colors.primary : colors.border,
                  borderRadius: colors.radiusXs,
                },
              ]}
            >
              <Feather name="package" size={16} color={orderId === order.id ? colors.primary : colors.mutedForeground} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.orderNum, { color: colors.foreground }]}>{order.orderNumber}</Text>
                <Text style={[styles.orderShop, { color: colors.mutedForeground }]}>{order.shop.name}</Text>
              </View>
              {orderId === order.id && <Feather name="check" size={16} color={colors.primary} />}
            </Pressable>
          ))}
        </Card>

        {/* Dispute Type */}
        <Card style={styles.section}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>DISPUTE TYPE</Text>
          <View style={styles.typeGrid}>
            {DISPUTE_TYPES.map((t) => (
              <Pressable
                key={t.id}
                onPress={() => setDisputeType(t.id)}
                style={[
                  styles.typeCard,
                  {
                    backgroundColor: disputeType === t.id ? colors.warningLight : colors.muted,
                    borderColor: disputeType === t.id ? colors.warning : colors.border,
                    borderWidth: disputeType === t.id ? 1.5 : 1,
                    borderRadius: 12,
                  },
                ]}
              >
                <Feather name={t.icon as any} size={16} color={disputeType === t.id ? colors.warning : colors.mutedForeground} />
                <Text style={[styles.typeLabel, { color: colors.foreground }]}>{t.label}</Text>
              </Pressable>
            ))}
          </View>
        </Card>

        {/* Description */}
        <Card style={styles.section}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>DESCRIBE THE ISSUE</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            placeholder="Explain what went wrong with this order..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.descInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
            textAlignVertical="top"
          />
        </Card>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <Button
          title="Submit Dispute"
          onPress={handleSubmit}
          loading={loading}
          disabled={!disputeType || !description.trim()}
          size="xl"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 16 },
  section: { gap: 12 },
  label: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.8 },
  orderRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderWidth: 1.5 },
  orderNum: { fontSize: 14, fontFamily: "Inter_700Bold" },
  orderShop: { fontSize: 12, fontFamily: "Inter_400Regular" },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  typeCard: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1 },
  typeLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  descInput: { borderWidth: 1, borderRadius: 14, padding: 14, fontSize: 14, fontFamily: "Inter_400Regular", minHeight: 110 },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});

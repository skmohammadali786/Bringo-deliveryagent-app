import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";
import { fadeInDown, fadeInDownDelay } from "@/constants/animations";

const FAILURE_REASONS = [
  { id: "not_home", label: "Customer not at home", icon: "home" },
  { id: "wrong_address", label: "Wrong address", icon: "map-pin" },
  { id: "refused", label: "Customer refused delivery", icon: "x-circle" },
  { id: "unsafe", label: "Unsafe delivery location", icon: "alert-triangle" },
  { id: "no_cod", label: "Customer unable to pay COD", icon: "credit-card" },
  { id: "other", label: "Other reason", icon: "more-horizontal" },
];

export default function DeliveryFailedScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders, updateOrderStatus } = useOrderStore();
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const activeOrder = orders.find((o) => o.status === "delivering");

  const handleSubmit = async () => {
    if (!selected) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    if (activeOrder) updateOrderStatus(activeOrder.id, "failed");
    setLoading(false);
    router.replace("/(tabs)/" as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Delivery Issue" showBack />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 16 : 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Warning Banner */}
        <Animated.View entering={fadeInDown(0)}>
          <Card style={[styles.warnCard, { backgroundColor: colors.destructiveLight, borderColor: colors.destructive + "30" }]}>
            <View style={[styles.warnIcon, { backgroundColor: colors.destructive + "18" }]}>
              <Feather name="alert-circle" size={28} color={colors.destructive} />
            </View>
            <View style={styles.warnText}>
              <Text style={[styles.warnTitle, { color: colors.foreground }]}>Unable to Deliver</Text>
              <Text style={[styles.warnSub, { color: colors.mutedForeground }]}>
                Please select a reason for the failed delivery attempt
              </Text>
            </View>
          </Card>
        </Animated.View>

        {/* Reason Selection */}
        <Animated.View entering={fadeInDownDelay(80)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Reason for failure</Text>
          {FAILURE_REASONS.map((reason, i) => (
            <Pressable
              key={reason.id}
              onPress={() => setSelected(reason.id)}
              style={[
                styles.reasonCard,
                {
                  backgroundColor: colors.card,
                  borderColor: selected === reason.id ? colors.destructive : colors.border,
                  borderWidth: selected === reason.id ? 2 : 1,
                  borderRadius: colors.radiusSm,
                },
              ]}
            >
              <View style={[styles.reasonIcon, { backgroundColor: selected === reason.id ? colors.destructiveLight : colors.muted }]}>
                <Feather name={reason.icon as any} size={18} color={selected === reason.id ? colors.destructive : colors.mutedForeground} />
              </View>
              <Text style={[styles.reasonLabel, { color: colors.foreground }]}>{reason.label}</Text>
              {selected === reason.id && (
                <View style={[styles.reasonCheck, { backgroundColor: colors.destructive }]}>
                  <Feather name="check" size={12} color="#FFF" />
                </View>
              )}
            </Pressable>
          ))}
        </Animated.View>

        {/* Tip */}
        <Animated.View entering={fadeInDownDelay(200)}>
          <Card style={[styles.tipCard, { backgroundColor: colors.infoLight }]}>
            <Feather name="info" size={16} color={colors.info} />
            <Text style={[styles.tipText, { color: colors.info }]}>
              Repeated failed deliveries may affect your rating. Contact support if you need help.
            </Text>
          </Card>
        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <Button
          title="Report Failed Delivery"
          onPress={handleSubmit}
          loading={loading}
          disabled={!selected}
          variant="destructive"
          size="xl"
        />
        <Button
          title="Try again"
          onPress={() => router.back()}
          variant="outline"
          size="lg"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  warnCard: { flexDirection: "row", alignItems: "center", gap: 14, borderWidth: 1 },
  warnIcon: { width: 56, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  warnText: { flex: 1, gap: 3 },
  warnTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  warnSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4, marginBottom: 4 },
  reasonCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  reasonIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  reasonLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_600SemiBold" },
  reasonCheck: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  tipCard: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14 },
  tipText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1, gap: 10 },
});

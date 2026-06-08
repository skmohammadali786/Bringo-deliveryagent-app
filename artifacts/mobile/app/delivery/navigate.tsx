import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";

export default function DeliveryNavigateScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders, activeOrderId } = useOrderStore();
  const order = orders.find((o) => o.id === activeOrderId) ?? orders[1];

  const openMaps = () => {
    const addr = encodeURIComponent(order?.customer.address ?? "");
    Linking.openURL(`https://maps.google.com/?q=${addr}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Map placeholder */}
      <View style={[styles.mapPlaceholder, { backgroundColor: colors.muted }]}>
        <Feather name="map" size={48} color={colors.mutedForeground} />
        <Text style={[styles.mapText, { color: colors.mutedForeground }]}>Tap below to open navigation</Text>
        <Pressable onPress={openMaps} style={[styles.openMaps, { backgroundColor: colors.primary, borderRadius: 20 }]}>
          <Feather name="navigation" size={16} color="#FFF" />
          <Text style={styles.openMapsText}>Open in Google Maps</Text>
        </Pressable>
      </View>

      {/* Delivery Info Sheet */}
      <View style={[styles.sheet, { backgroundColor: colors.card, paddingBottom: insets.bottom + 20, borderTopColor: colors.border }]}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />
        <Card style={{ marginHorizontal: 0 }}>
          <Text style={[styles.cardTitle, { color: colors.mutedForeground }]}>DELIVERING TO</Text>
          <Text style={[styles.customerName, { color: colors.foreground }]}>{order?.customer.name}</Text>
          <Text style={[styles.addr, { color: colors.mutedForeground }]}>{order?.customer.address}</Text>
          <View style={styles.metaRow}>
            <View style={styles.meta}>
              <Feather name="navigation" size={14} color={colors.primary} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{order?.distance}</Text>
            </View>
            <View style={styles.meta}>
              <Feather name="clock" size={14} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{order?.estimatedTime}</Text>
            </View>
          </View>
        </Card>
        <View style={styles.actions}>
          <Pressable onPress={() => Linking.openURL(`tel:${order?.customer.phone}`)} style={[styles.actionBtn, { backgroundColor: colors.successLight, borderRadius: colors.radiusSm }]}>
            <Feather name="phone" size={18} color={colors.success} />
            <Text style={[styles.actionText, { color: colors.success }]}>Call</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/delivery/chat" as any)} style={[styles.actionBtn, { backgroundColor: colors.primaryLight, borderRadius: colors.radiusSm }]}>
            <Feather name="message-circle" size={18} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.primary }]}>Chat</Text>
          </Pressable>
          <Button title="Arrived at Location" onPress={() => router.push("/delivery/otp" as any)} style={{ flex: 2 }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapPlaceholder: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  mapText: { fontSize: 15, fontFamily: "Inter_500Medium" },
  openMaps: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 20, paddingVertical: 10 },
  openMapsText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#FFF" },
  sheet: { paddingHorizontal: 20, paddingTop: 16, gap: 14, borderTopWidth: 1 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 8 },
  cardTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8, marginBottom: 8 },
  customerName: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4, marginBottom: 4 },
  addr: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  metaRow: { flexDirection: "row", gap: 16, marginTop: 10 },
  meta: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  actions: { flexDirection: "row", gap: 10, alignItems: "center" },
  actionBtn: { paddingHorizontal: 16, paddingVertical: 14, flexDirection: "row", alignItems: "center", gap: 6 },
  actionText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});

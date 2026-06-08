import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";

const MAP_APPS = [
  { id: "google", name: "Google Maps", icon: "map" as const, color: "#4285F4", url: "https://maps.google.com" },
  { id: "waze", name: "Waze", icon: "navigation" as const, color: "#33CCFF", url: "https://waze.com" },
  { id: "apple", name: "Apple Maps", icon: "map-pin" as const, color: "#007AFF", url: "https://maps.apple.com" },
];

export default function NavigateScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders } = useOrderStore();
  const [selectedMap, setSelectedMap] = useState("google");

  const activeOrder = orders.find((o) =>
    ["accepted", "at_shop", "picked_up", "delivering"].includes(o.status)
  );

  const handleNavigate = () => {
    const app = MAP_APPS.find((a) => a.id === selectedMap);
    if (app) {
      Linking.openURL(app.url).catch(() => {});
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Navigation" showBack />

      {/* Map Placeholder */}
      <View style={[styles.mapArea, { backgroundColor: colors.muted }]}>
        <View style={styles.mapContent}>
          <View style={[styles.mapIcon, { backgroundColor: colors.card }]}>
            <Feather name="map" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.mapTitle, { color: colors.foreground }]}>Live Navigation</Text>
          <Text style={[styles.mapSub, { color: colors.mutedForeground }]}>
            Open in your preferred map app
          </Text>
        </View>

        {/* Floating Route Card */}
        {activeOrder && (
          <Animated.View
            entering={FadeInUp.delay(200).duration(500)}
            style={[styles.routeCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={styles.routeRow}>
              <View style={[styles.routeDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.routeName, { color: colors.foreground }]} numberOfLines={1}>
                {activeOrder.shop.name}
              </Text>
            </View>
            <View style={[styles.routeLine, { backgroundColor: colors.border }]} />
            <View style={styles.routeRow}>
              <View style={[styles.routeDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.routeName, { color: colors.foreground }]} numberOfLines={1}>
                {activeOrder.customer.address}
              </Text>
            </View>
          </Animated.View>
        )}
      </View>

      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />

        {/* ETA Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Card style={styles.etaCard}>
            <View style={styles.etaItem}>
              <Feather name="clock" size={20} color={colors.primary} />
              <View>
                <Text style={[styles.etaValue, { color: colors.foreground }]}>
                  {activeOrder?.estimatedTime ?? "—"}
                </Text>
                <Text style={[styles.etaLabel, { color: colors.mutedForeground }]}>ETA</Text>
              </View>
            </View>
            <View style={[styles.etaDivider, { backgroundColor: colors.border }]} />
            <View style={styles.etaItem}>
              <Feather name="navigation" size={20} color={colors.success} />
              <View>
                <Text style={[styles.etaValue, { color: colors.foreground }]}>
                  {activeOrder?.distance ?? "—"}
                </Text>
                <Text style={[styles.etaLabel, { color: colors.mutedForeground }]}>Distance</Text>
              </View>
            </View>
            <View style={[styles.etaDivider, { backgroundColor: colors.border }]} />
            <View style={styles.etaItem}>
              <Feather name="trending-up" size={20} color={colors.accent} />
              <View>
                <Text style={[styles.etaValue, { color: colors.foreground }]}>
                  ₹{activeOrder?.deliveryFee ?? "—"}
                </Text>
                <Text style={[styles.etaLabel, { color: colors.mutedForeground }]}>Earning</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Map App Selector */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Open Navigation In</Text>
          <View style={styles.mapApps}>
            {MAP_APPS.map((app) => (
              <Pressable
                key={app.id}
                onPress={() => setSelectedMap(app.id)}
                style={[
                  styles.mapApp,
                  {
                    backgroundColor: colors.card,
                    borderColor: selectedMap === app.id ? app.color : colors.border,
                    borderWidth: selectedMap === app.id ? 2 : 1,
                    borderRadius: colors.radiusSm,
                  },
                ]}
              >
                <View style={[styles.mapAppIcon, { backgroundColor: app.color + "18" }]}>
                  <Feather name={app.icon} size={20} color={app.color} />
                </View>
                <Text style={[styles.mapAppName, { color: colors.foreground }]}>{app.name}</Text>
                {selectedMap === app.id && (
                  <View style={[styles.selectedCheck, { backgroundColor: app.color }]}>
                    <Feather name="check" size={10} color="#FFF" />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Open Navigation"
            onPress={handleNavigate}
            size="xl"
            icon={<Feather name="external-link" size={18} color="#FFF" />}
          />
          {activeOrder && (
            <Pressable
              onPress={() => router.push(`/order/${activeOrder.id}` as any)}
              style={[styles.orderLink, { borderColor: colors.border, borderRadius: colors.radiusSm }]}
            >
              <Text style={[styles.orderLinkText, { color: colors.foreground }]}>View Order Details</Text>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapArea: {
    height: 280,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  mapContent: { alignItems: "center", gap: 12 },
  mapIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  mapTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  mapSub: { fontSize: 14, fontFamily: "Inter_400Regular" },
  routeCard: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  routeRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  routeDot: { width: 10, height: 10, borderRadius: 5 },
  routeLine: { width: 1.5, height: 12, marginLeft: 4 },
  routeName: { flex: 1, fontSize: 13, fontFamily: "Inter_600SemiBold" },
  sheet: { flex: 1, padding: 20, gap: 20 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 4 },
  etaCard: { flexDirection: "row", alignItems: "center", padding: 16 },
  etaItem: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  etaDivider: { width: 1, height: 36, marginHorizontal: 4 },
  etaValue: { fontSize: 16, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  etaLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold", letterSpacing: -0.3, marginBottom: 12 },
  mapApps: { flexDirection: "row", gap: 10 },
  mapApp: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    gap: 8,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  mapAppIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  mapAppName: { fontSize: 11, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  selectedCheck: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: { gap: 10 },
  orderLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    borderWidth: 1,
  },
  orderLinkText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});

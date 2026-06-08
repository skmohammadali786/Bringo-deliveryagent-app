import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/store/authStore";

const HOTSPOTS = [
  { id: "1", name: "Koramangala Hub", orders: 24, earnings: "₹1200/hr", distance: "0.8 km", surge: "2.1×" },
  { id: "2", name: "Indiranagar Area", orders: 18, earnings: "₹950/hr", distance: "2.1 km", surge: "1.6×" },
  { id: "3", name: "BTM Layout", orders: 31, earnings: "₹1400/hr", distance: "3.5 km", surge: "2.4×" },
  { id: "4", name: "HSR Layout", orders: 12, earnings: "₹700/hr", distance: "4.2 km", surge: "1.2×" },
];

const MAP_FILTERS = ["All", "Surge", "Restaurants", "Grocery", "Pharmacy"] as const;
type Filter = typeof MAP_FILTERS[number];

export default function MapScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isOnline } = useAuthStore();
  const [filter, setFilter] = useState<Filter>("All");
  const [viewMode, setViewMode] = useState<"heatmap" | "orders">("heatmap");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16),
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.headerTop}>
          <Text style={[styles.title, { color: colors.foreground }]}>Heatmap</Text>
          <View style={styles.headerRight}>
            <View style={[styles.liveIndicator, { backgroundColor: isOnline ? colors.successLight : colors.muted }]}>
              <View style={[styles.liveDot, { backgroundColor: isOnline ? colors.success : colors.mutedForeground }]} />
              <Text style={[styles.liveText, { color: isOnline ? colors.success : colors.mutedForeground }]}>
                {isOnline ? "Live" : "Offline"}
              </Text>
            </View>
            <Pressable
              onPress={() => setViewMode((v) => v === "heatmap" ? "orders" : "heatmap")}
              style={[styles.modeBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Feather name={viewMode === "heatmap" ? "list" : "map"} size={18} color={colors.foreground} />
            </Pressable>
          </View>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow} contentContainerStyle={styles.filtersContent}>
          {MAP_FILTERS.map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: filter === f ? colors.primary : colors.card,
                  borderColor: filter === f ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[styles.filterText, { color: filter === f ? "#FFF" : colors.foreground }]}>{f}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Map Placeholder */}
      <View style={[styles.mapArea, { backgroundColor: colors.muted }]}>
        <View style={styles.mapPlaceholder}>
          <View style={[styles.mapIconWrap, { backgroundColor: colors.card }]}>
            <Feather name="map" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.mapTitle, { color: colors.foreground }]}>Live Demand Map</Text>
          <Text style={[styles.mapSub, { color: colors.mutedForeground }]}>
            See where orders are happening in real-time
          </Text>
        </View>

        {/* Surge overlay */}
        <View style={[styles.surgeOverlay, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.surgeDot, { backgroundColor: "#FF4D4F" }]} />
          <Text style={[styles.surgeText, { color: colors.foreground }]}>Surge ×2.4 near BTM</Text>
        </View>
      </View>

      {/* Hotspots */}
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Top Hotspots</Text>
          <View style={[styles.updatedBadge, { backgroundColor: colors.successLight }]}>
            <View style={[styles.updatedDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.updatedText, { color: colors.success }]}>Live</Text>
          </View>
        </View>

        {HOTSPOTS.map((spot, i) => (
          <Animated.View key={spot.id} entering={FadeInDown.delay(i * 70).duration(400)}>
            <Card style={styles.hotspotCard}>
              <View style={[styles.surgeTag, { backgroundColor: spot.surge >= "2.0×" ? "#FF4D4F18" : colors.primaryLight }]}>
                <Text style={[styles.surgeVal, { color: spot.surge >= "2.0×" ? "#FF4D4F" : colors.primary }]}>
                  {spot.surge}
                </Text>
              </View>
              <View style={styles.hotspotInfo}>
                <Text style={[styles.hotspotName, { color: colors.foreground }]}>{spot.name}</Text>
                <View style={styles.hotspotMeta}>
                  <Feather name="package" size={12} color={colors.mutedForeground} />
                  <Text style={[styles.hotspotMetaText, { color: colors.mutedForeground }]}>
                    {spot.orders} orders
                  </Text>
                  <Text style={[styles.dot, { color: colors.border }]}>·</Text>
                  <Feather name="navigation" size={12} color={colors.mutedForeground} />
                  <Text style={[styles.hotspotMetaText, { color: colors.mutedForeground }]}>
                    {spot.distance}
                  </Text>
                </View>
              </View>
              <View style={styles.hotspotRight}>
                <Text style={[styles.hotspotEarning, { color: colors.success }]}>{spot.earnings}</Text>
                <Pressable
                  onPress={() => router.push("/delivery/navigate" as any)}
                  style={[styles.goBtn, { backgroundColor: colors.primary, borderRadius: 10 }]}
                >
                  <Feather name="navigation" size={14} color="#FFF" />
                </Pressable>
              </View>
            </Card>
          </Animated.View>
        ))}

        {/* Nearby Shops */}
        <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 8 }]}>Nearby Active Shops</Text>
        {[
          { name: "Green Mart", type: "Grocery", orders: 8, wait: "~5 min", color: "#34C759" },
          { name: "Quick Bites", type: "Restaurant", orders: 15, wait: "~12 min", color: "#FF6B35" },
          { name: "MedPlus", type: "Pharmacy", orders: 3, wait: "~3 min", color: "#4A90E2" },
        ].map((shop, i) => (
          <Animated.View key={shop.name} entering={FadeInDown.delay(300 + i * 70).duration(400)}>
            <Card style={styles.shopCard}>
              <View style={[styles.shopDot, { backgroundColor: shop.color + "20" }]}>
                <MaterialCommunityIcons
                  name={shop.type === "Restaurant" ? "food" : shop.type === "Pharmacy" ? "pill" : "shopping"}
                  size={18}
                  color={shop.color}
                />
              </View>
              <View style={styles.shopInfo}>
                <Text style={[styles.shopName, { color: colors.foreground }]}>{shop.name}</Text>
                <Text style={[styles.shopType, { color: colors.mutedForeground }]}>{shop.type} · {shop.orders} active</Text>
              </View>
              <View style={[styles.waitBadge, { backgroundColor: colors.muted }]}>
                <Feather name="clock" size={12} color={colors.mutedForeground} />
                <Text style={[styles.waitText, { color: colors.mutedForeground }]}>{shop.wait}</Text>
              </View>
            </Card>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 32, fontFamily: "Inter_700Bold", letterSpacing: -1 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  liveDot: { width: 7, height: 7, borderRadius: 3.5 },
  liveText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  modeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  filtersRow: { marginHorizontal: -4 },
  filtersContent: { gap: 8, paddingHorizontal: 4 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  mapArea: { height: 220, justifyContent: "center", alignItems: "center", position: "relative" },
  mapPlaceholder: { alignItems: "center", gap: 10 },
  mapIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  mapTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  mapSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  surgeOverlay: {
    position: "absolute",
    top: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  surgeDot: { width: 8, height: 8, borderRadius: 4 },
  surgeText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  content: { paddingHorizontal: 20, paddingTop: 16, gap: 10 },
  contentHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  sectionTitle: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  updatedBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  updatedDot: { width: 6, height: 6, borderRadius: 3 },
  updatedText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  hotspotCard: { flexDirection: "row", alignItems: "center", gap: 12 },
  surgeTag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  surgeVal: { fontSize: 14, fontFamily: "Inter_700Bold" },
  hotspotInfo: { flex: 1, gap: 4 },
  hotspotName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  hotspotMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  hotspotMetaText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  dot: { fontSize: 12 },
  hotspotRight: { alignItems: "flex-end", gap: 8 },
  hotspotEarning: { fontSize: 13, fontFamily: "Inter_700Bold" },
  goBtn: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  shopCard: { flexDirection: "row", alignItems: "center", gap: 12 },
  shopDot: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  shopInfo: { flex: 1, gap: 2 },
  shopName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  shopType: { fontSize: 12, fontFamily: "Inter_400Regular" },
  waitBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  waitText: { fontSize: 11, fontFamily: "Inter_500Medium" },
});

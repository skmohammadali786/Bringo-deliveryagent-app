import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Marker, Polyline } from "react-native-maps";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";

const HOTSPOTS = [
  { id: "1", name: "Koramangala Hub",  orders: 24, earnings: "₹1200/hr", distance: "0.8 km", surge: "2.1×" },
  { id: "2", name: "Indiranagar Area", orders: 18, earnings: "₹950/hr",  distance: "2.1 km", surge: "1.6×" },
  { id: "3", name: "BTM Layout",       orders: 31, earnings: "₹1400/hr", distance: "3.5 km", surge: "2.4×" },
  { id: "4", name: "HSR Layout",       orders: 12, earnings: "₹700/hr",  distance: "4.2 km", surge: "1.2×" },
];

const MAP_FILTERS = ["All", "Surge", "Restaurants", "Grocery", "Pharmacy"] as const;
type Filter = typeof MAP_FILTERS[number];

const ORDER_STATUS_LABEL: Record<string, string> = {
  accepted:   "On the way to shop",
  at_shop:    "At shop — collecting items",
  picked_up:  "Heading to customer",
  delivering: "Out for delivery",
};

// Demo coordinates — Bangalore (Koramangala → Indiranagar)
const PICKUP_COORD  = { latitude: 12.9350, longitude: 77.6243 };
const DROPOFF_COORD = { latitude: 12.9716, longitude: 77.6406 };
const ORDER_MAP_REGION = {
  latitude: 12.9533,
  longitude: 77.6325,
  latitudeDelta: 0.065,
  longitudeDelta: 0.065,
};

export default function MapScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isOnline } = useAuthStore();
  const { orders } = useOrderStore();
  const [filter, setFilter] = useState<Filter>("All");
  const [viewMode, setViewMode] = useState<"heatmap" | "orders">("heatmap");

  const activeOrder = orders.find((o) =>
    ["accepted", "at_shop", "picked_up", "delivering"].includes(o.status)
  ) ?? null;

  useEffect(() => {
    if (activeOrder) setViewMode("orders");
    else setViewMode("heatmap");
  }, [activeOrder?.id]);

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
          <Text style={[styles.title, { color: colors.foreground }]}>
            {viewMode === "orders" && activeOrder ? "Active Order" : "Heatmap"}
          </Text>
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

        {/* Filters — only shown in heatmap mode */}
        {viewMode === "heatmap" && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersRow}
            contentContainerStyle={styles.filtersContent}
          >
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
        )}
      </View>

      {/* Map Area */}
      {viewMode === "orders" && activeOrder ? (
        <View style={[styles.mapArea, { backgroundColor: colors.card }]}>
          {Platform.OS !== "web" ? (
            /* Native: real MapView with markers, polyline, and callouts */
            <MapView
              style={StyleSheet.absoluteFill}
              initialRegion={ORDER_MAP_REGION}
              scrollEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
            >
              {/* Pickup marker */}
              <Marker coordinate={PICKUP_COORD} pinColor="#FF6B35" title={activeOrder.shop.name}>
                <Callout tooltip={false}>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>{activeOrder.shop.name}</Text>
                    <Text style={styles.calloutSub} numberOfLines={2}>{activeOrder.shop.address}</Text>
                    <Text style={styles.calloutTag}>📦 Pickup</Text>
                  </View>
                </Callout>
              </Marker>

              {/* Dropoff marker */}
              <Marker coordinate={DROPOFF_COORD} title={activeOrder.customer.name}>
                <Callout tooltip={false}>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>{activeOrder.customer.name}</Text>
                    <Text style={styles.calloutSub} numberOfLines={2}>{activeOrder.customer.address}</Text>
                    <Text style={styles.calloutTag}>🏠 Dropoff</Text>
                  </View>
                </Callout>
              </Marker>

              {/* Route polyline */}
              <Polyline
                coordinates={[PICKUP_COORD, DROPOFF_COORD]}
                strokeColor="#FF6B35"
                strokeWidth={3}
                lineDashPattern={[8, 5]}
              />
            </MapView>
          ) : (
            /* Web fallback: styled route card */
            <View style={[styles.routeCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={styles.routeStop}>
                <View style={[styles.routePin, { backgroundColor: colors.primary }]}>
                  <Feather name="shopping-bag" size={13} color="#FFF" />
                </View>
                <View style={styles.routeStopInfo}>
                  <Text style={[styles.routeStopLabel, { color: colors.mutedForeground }]}>Pickup</Text>
                  <Text style={[styles.routeStopName, { color: colors.foreground }]} numberOfLines={1}>
                    {activeOrder.shop.name}
                  </Text>
                  <Text style={[styles.routeStopAddr, { color: colors.mutedForeground }]} numberOfLines={1}>
                    {activeOrder.shop.address}
                  </Text>
                </View>
              </View>

              <View style={styles.routeConnectorRow}>
                <View style={[styles.routeConnectorLine, { backgroundColor: colors.border }]} />
                <View style={[styles.routeDistanceBadge, { backgroundColor: colors.muted }]}>
                  <Feather name="navigation" size={10} color={colors.mutedForeground} />
                  <Text style={[styles.routeDistanceText, { color: colors.mutedForeground }]}>~3.2 km</Text>
                </View>
                <View style={[styles.routeConnectorLine, { backgroundColor: colors.border }]} />
              </View>

              <View style={styles.routeStop}>
                <View style={[styles.routePin, { backgroundColor: colors.success }]}>
                  <Feather name="home" size={13} color="#FFF" />
                </View>
                <View style={styles.routeStopInfo}>
                  <Text style={[styles.routeStopLabel, { color: colors.mutedForeground }]}>Dropoff</Text>
                  <Text style={[styles.routeStopName, { color: colors.foreground }]} numberOfLines={1}>
                    {activeOrder.customer.name}
                  </Text>
                  <Text style={[styles.routeStopAddr, { color: colors.mutedForeground }]} numberOfLines={1}>
                    {activeOrder.customer.address}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Status badge — shown on both platforms */}
          <View style={[styles.activeOrderBadge, { backgroundColor: colors.primaryLight, borderColor: colors.primary + "30" }]}>
            <View style={[styles.activeOrderDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.activeOrderText, { color: colors.primary }]}>
              {ORDER_STATUS_LABEL[activeOrder.status] ?? activeOrder.status}
            </Text>
          </View>
        </View>
      ) : (
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
          <View style={[styles.surgeOverlay, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.surgeDot, { backgroundColor: "#FF4D4F" }]} />
            <Text style={[styles.surgeText, { color: colors.foreground }]}>Surge ×2.4 near BTM</Text>
          </View>
        </View>
      )}

      {/* Content list */}
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {viewMode === "orders" && activeOrder ? (
          /* Order detail tiles */
          <>
            <View style={styles.contentHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Order #{activeOrder.id}</Text>
              <View style={[styles.updatedBadge, { backgroundColor: colors.primaryLight }]}>
                <View style={[styles.updatedDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.updatedText, { color: colors.primary }]}>In Progress</Text>
              </View>
            </View>

            {[
              { label: "Items",      value: `${activeOrder.items.length} items`,      icon: "package"  },
              { label: "Customer",   value: activeOrder.customer.name,                icon: "user"     },
              { label: "Value",      value: `₹${activeOrder.totalAmount ?? activeOrder.items.reduce((s, i) => s + i.price * i.quantity, 0)}`, icon: "dollar-sign" },
              { label: "ETA",        value: "~12 min",                                icon: "clock"    },
            ].map((tile, i) => (
              <Animated.View key={tile.label} entering={FadeInDown.delay(i * 60).duration(400)}>
                <Card style={styles.orderTile}>
                  <View style={[styles.orderTileIcon, { backgroundColor: colors.primaryLight }]}>
                    <Feather name={tile.icon as any} size={18} color={colors.primary} />
                  </View>
                  <View style={styles.orderTileInfo}>
                    <Text style={[styles.orderTileLabel, { color: colors.mutedForeground }]}>{tile.label}</Text>
                    <Text style={[styles.orderTileValue, { color: colors.foreground }]} numberOfLines={1}>{tile.value}</Text>
                  </View>
                </Card>
              </Animated.View>
            ))}

            <Pressable
              onPress={() => router.push("/delivery/navigate" as any)}
              style={[styles.navigateBtn, { backgroundColor: colors.primary, borderRadius: 16 }]}
            >
              <Feather name="navigation" size={18} color="#FFF" />
              <Text style={styles.navigateBtnText}>Open Navigation</Text>
            </Pressable>
          </>
        ) : (
          /* Heatmap / hotspots list */
          <>
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

            <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 8 }]}>Nearby Active Shops</Text>
            {[
              { name: "Green Mart",  type: "Grocery",    orders: 8,  wait: "~5 min",  color: "#34C759" },
              { name: "Quick Bites", type: "Restaurant", orders: 15, wait: "~12 min", color: "#FF6B35" },
              { name: "MedPlus",     type: "Pharmacy",   orders: 3,  wait: "~3 min",  color: "#4A90E2" },
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
          </>
        )}
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
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
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
  /* Route card in order mode */
  routeCard: {
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  routeStop: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  routePin: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center", marginTop: 2 },
  routeStopInfo: { flex: 1, gap: 1 },
  routeStopLabel: { fontSize: 10, fontFamily: "Inter_500Medium" },
  routeStopName: { fontSize: 14, fontFamily: "Inter_700Bold" },
  routeStopAddr: { fontSize: 11, fontFamily: "Inter_400Regular" },
  routeConnectorRow: { flexDirection: "row", alignItems: "center", gap: 6, paddingLeft: 15 },
  routeConnectorLine: { flex: 1, height: 1 },
  routeDistanceBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  routeDistanceText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  activeOrderBadge: {
    position: "absolute",
    bottom: 10,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  activeOrderDot: { width: 7, height: 7, borderRadius: 3.5 },
  activeOrderText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  content: { paddingHorizontal: 20, paddingTop: 16, gap: 10 },
  contentHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  sectionTitle: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  updatedBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  updatedDot: { width: 6, height: 6, borderRadius: 3 },
  updatedText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  /* Order tiles */
  orderTile: { flexDirection: "row", alignItems: "center", gap: 14 },
  orderTileIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  orderTileInfo: { flex: 1, gap: 2 },
  orderTileLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  orderTileValue: { fontSize: 15, fontFamily: "Inter_700Bold" },
  navigateBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, padding: 16, marginTop: 4 },
  navigateBtnText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#FFF" },
  /* Hotspot cards */
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
  callout: { padding: 10, maxWidth: 200, gap: 2 },
  calloutTitle: { fontSize: 13, fontWeight: "700" },
  calloutSub: { fontSize: 11, color: "#666", marginTop: 2 },
  calloutTag: { fontSize: 11, marginTop: 4, color: "#888" },
});

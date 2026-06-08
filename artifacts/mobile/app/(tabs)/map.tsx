import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/store/authStore";

// Conditional map import for web compatibility
let MapView: any;
let Marker: any;
let PROVIDER_GOOGLE: any;

if (Platform.OS !== "web") {
  const Maps = require("react-native-maps");
  MapView = Maps.default;
  Marker = Maps.Marker;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
}

const NEARBY_ORDERS = [
  { id: "1", lat: 12.9716, lng: 77.5946, earnings: 45, distance: "0.5 km" },
  { id: "2", lat: 12.9800, lng: 77.6000, earnings: 65, distance: "1.2 km" },
  { id: "3", lat: 12.9650, lng: 77.5900, earnings: 38, distance: "0.8 km" },
];

export default function MapScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isOnline } = useAuthStore();
  const [filter, setFilter] = useState<"orders" | "shops" | "heatmap">("orders");

  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 67 }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Live Map</Text>
        </View>
        <View style={[styles.webPlaceholder, { backgroundColor: colors.muted }]}>
          <Feather name="map" size={48} color={colors.mutedForeground} />
          <Text style={[styles.webPlaceholderText, { color: colors.mutedForeground }]}>
            Map view available on mobile device
          </Text>
          <Text style={[styles.webSub, { color: colors.mutedForeground }]}>
            Scan the QR code with Expo Go to see the live map
          </Text>
        </View>
        <MapBottomSheet colors={colors} filter={filter} setFilter={setFilter} insets={insets} router={router} isOnline={isOnline} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 12.9716,
          longitude: 77.5946,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {NEARBY_ORDERS.map((o) => (
          <Marker key={o.id} coordinate={{ latitude: o.lat, longitude: o.lng }}>
            <View style={[styles.markerBubble, { backgroundColor: colors.primary }]}>
              <Text style={styles.markerText}>₹{o.earnings}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Top Controls */}
      <View style={[styles.mapHeader, { paddingTop: insets.top + 12 }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <Text style={[styles.searchText, { color: colors.mutedForeground }]}>Search area...</Text>
        </View>
        <Pressable style={[styles.locateBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="navigation" size={18} color={colors.primary} />
        </Pressable>
      </View>

      <MapBottomSheet colors={colors} filter={filter} setFilter={setFilter} insets={insets} router={router} isOnline={isOnline} />
    </View>
  );
}

function MapBottomSheet({ colors, filter, setFilter, insets, router, isOnline }: any) {
  return (
    <View style={[styles.bottomSheet, { backgroundColor: colors.card, borderColor: colors.border, paddingBottom: insets.bottom + 80 }]}>
      <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
      <View style={styles.filterRow}>
        {(["orders", "shops", "heatmap"] as const).map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterChip, { backgroundColor: filter === f ? colors.primary : colors.muted, borderRadius: 20 }]}
          >
            <Text style={[styles.filterText, { color: filter === f ? "#FFF" : colors.mutedForeground }]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.nearbySection}>
        <Text style={[styles.nearbyTitle, { color: colors.foreground }]}>Nearby Orders</Text>
        {!isOnline ? (
          <Text style={[styles.offlineText, { color: colors.mutedForeground }]}>Go online to see nearby orders</Text>
        ) : (
          NEARBY_ORDERS.map((o) => (
            <Pressable
              key={o.id}
              onPress={() => router.push(`/order/${o.id}` as any)}
              style={[styles.nearbyCard, { backgroundColor: colors.background, borderColor: colors.border, borderRadius: colors.radiusSm }]}
            >
              <View style={styles.nearbyLeft}>
                <View style={[styles.nearbyDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.nearbyDist, { color: colors.mutedForeground }]}>{o.distance}</Text>
              </View>
              <Text style={[styles.nearbyEarning, { color: colors.success }]}>₹{o.earnings}</Text>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </Pressable>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  mapHeader: { position: "absolute", top: 0, left: 16, right: 16, flexDirection: "row", gap: 10 },
  searchBar: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, height: 44, borderRadius: 22, borderWidth: 1 },
  searchText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  locateBtn: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  markerBubble: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  markerText: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#FFF" },
  bottomSheet: { position: "absolute", bottom: 0, left: 0, right: 0, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, borderWidth: 1 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 16 },
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7 },
  filterText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  nearbySection: { gap: 10 },
  nearbyTitle: { fontSize: 16, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  offlineText: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", paddingVertical: 8 },
  nearbyCard: { flexDirection: "row", alignItems: "center", padding: 12, borderWidth: 1 },
  nearbyLeft: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  nearbyDot: { width: 10, height: 10, borderRadius: 5 },
  nearbyDist: { fontSize: 13, fontFamily: "Inter_500Medium" },
  nearbyEarning: { fontSize: 16, fontFamily: "Inter_700Bold", letterSpacing: -0.3, marginRight: 8 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.8 },
  webPlaceholder: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, margin: 20, borderRadius: 24 },
  webPlaceholderText: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  webSub: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", paddingHorizontal: 24 },
});

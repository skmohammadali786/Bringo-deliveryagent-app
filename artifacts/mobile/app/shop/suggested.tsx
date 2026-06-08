import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "@/components/ui/Badge";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const SHOPS = [
  { id: "s1", name: "Green Mart", category: "Grocery", distance: "0.3 km", rating: 4.8, open: true },
  { id: "s2", name: "Daily Fresh", category: "Grocery", distance: "0.7 km", rating: 4.5, open: true },
  { id: "s3", name: "Super Bazar", category: "Supermarket", distance: "1.1 km", rating: 4.2, open: false },
];

export default function SuggestedShopsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Nearby Shops" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          Select an alternate shop to collect the missing items
        </Text>
        {SHOPS.map((shop) => (
          <Pressable
            key={shop.id}
            onPress={() => shop.open && router.push(`/shop/${shop.id}` as any)}
            style={[styles.shopCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm, opacity: shop.open ? 1 : 0.6 }]}
          >
            <View style={[styles.shopIcon, { backgroundColor: colors.primaryLight }]}>
              <Feather name="shopping-bag" size={24} color={colors.primary} />
            </View>
            <View style={styles.shopInfo}>
              <View style={styles.shopTop}>
                <Text style={[styles.shopName, { color: colors.foreground }]}>{shop.name}</Text>
                <Badge label={shop.open ? "Open" : "Closed"} variant={shop.open ? "success" : "destructive"} />
              </View>
              <View style={styles.shopMeta}>
                <Feather name="star" size={12} color={colors.accent} />
                <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{shop.rating}</Text>
                <Text style={[styles.metaText, { color: colors.mutedForeground }]}>•</Text>
                <Feather name="map-pin" size={12} color={colors.mutedForeground} />
                <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{shop.distance}</Text>
                <Badge label={shop.category} size="sm" />
              </View>
            </View>
            <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 16, gap: 12 },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22, marginBottom: 4 },
  shopCard: { flexDirection: "row", alignItems: "center", padding: 14, borderWidth: 1, gap: 12 },
  shopIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  shopInfo: { flex: 1, gap: 6 },
  shopTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  shopName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  shopMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, fontFamily: "Inter_400Regular" },
});

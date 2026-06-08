import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { fadeInDown, fadeInDownDelay } from "@/constants/animations";

const REVIEWS = [
  { id: "1", customer: "Priya S.", rating: 5, text: "Super fast delivery! Very professional.", date: "2h ago" },
  { id: "2", customer: "Rahul V.", rating: 5, text: "Delivered on time. Great service!", date: "5h ago" },
  { id: "3", customer: "Ananya P.", rating: 4, text: "Good delivery but a bit late.", date: "Yesterday" },
  { id: "4", customer: "Vikram S.", rating: 5, text: "All items intact, very happy!", date: "2 days ago" },
  { id: "5", customer: "Deepika R.", rating: 4, text: "Called before arriving. Helpful agent.", date: "3 days ago" },
];

function StarRow({ rating }: { rating: number }) {
  const colors = useColors();
  return (
    <View style={{ flexDirection: "row", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Feather key={s} name="star" size={14} color={s <= rating ? "#FFB800" : colors.border} />
      ))}
    </View>
  );
}

export default function RatingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const avgRating = 4.85;
  const distribution = [
    { stars: 5, count: 142, pct: 88 },
    { stars: 4, count: 16, pct: 10 },
    { stars: 3, count: 3, pct: 2 },
    { stars: 2, count: 0, pct: 0 },
    { stars: 1, count: 0, pct: 0 },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Ratings & Reviews" showBack />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 16 : 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <Animated.View entering={fadeInDown(0)}>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryLeft}>
              <Text style={[styles.avgRating, { color: colors.foreground }]}>{avgRating}</Text>
              <View style={{ flexDirection: "row", gap: 3 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Feather key={s} name="star" size={22} color="#FFB800" />
                ))}
              </View>
              <Text style={[styles.totalReviews, { color: colors.mutedForeground }]}>161 reviews</Text>
            </View>
            <View style={styles.summaryRight}>
              {distribution.map((d) => (
                <View key={d.stars} style={styles.distRow}>
                  <Text style={[styles.distLabel, { color: colors.mutedForeground }]}>{d.stars}★</Text>
                  <View style={[styles.distBarBg, { backgroundColor: colors.muted }]}>
                    <View style={[styles.distBarFill, { backgroundColor: "#FFB800", width: `${d.pct}%` }]} />
                  </View>
                  <Text style={[styles.distCount, { color: colors.mutedForeground }]}>{d.count}</Text>
                </View>
              ))}
            </View>
          </Card>
        </Animated.View>

        {/* Category Scores */}
        <Animated.View entering={fadeInDownDelay(60)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Category Scores</Text>
          <View style={styles.categoryGrid}>
            {[
              { label: "Punctuality", score: 4.9, color: colors.primary },
              { label: "Professionalism", score: 4.8, color: colors.accentPurple },
              { label: "Communication", score: 4.7, color: colors.success },
              { label: "Handling", score: 4.9, color: colors.accent },
            ].map((c) => (
              <Card key={c.label} style={styles.categoryCard} shadow>
                <Text style={[styles.categoryScore, { color: c.color }]}>{c.score}</Text>
                <Text style={[styles.categoryLabel, { color: colors.mutedForeground }]}>{c.label}</Text>
                <Feather name="star" size={14} color="#FFB800" />
              </Card>
            ))}
          </View>
        </Animated.View>

        {/* Recent Reviews */}
        <Animated.View entering={fadeInDownDelay(120)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Reviews</Text>
          <Card padding={0}>
            {REVIEWS.map((r, i) => (
              <View
                key={r.id}
                style={[
                  styles.reviewRow,
                  { borderBottomColor: colors.border, borderBottomWidth: i < REVIEWS.length - 1 ? 1 : 0 },
                ]}
              >
                <View style={styles.reviewTop}>
                  <View style={[styles.reviewAvatar, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.reviewInitial, { color: colors.primary }]}>
                      {r.customer.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.reviewInfo}>
                    <Text style={[styles.reviewName, { color: colors.foreground }]}>{r.customer}</Text>
                    <Text style={[styles.reviewDate, { color: colors.mutedForeground }]}>{r.date}</Text>
                  </View>
                  <StarRow rating={r.rating} />
                </View>
                {r.text && (
                  <Text style={[styles.reviewText, { color: colors.mutedForeground }]}>{r.text}</Text>
                )}
              </View>
            ))}
          </Card>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  summaryCard: { flexDirection: "row", alignItems: "center", gap: 20 },
  summaryLeft: { alignItems: "center", gap: 6 },
  avgRating: { fontSize: 52, fontFamily: "Inter_700Bold", letterSpacing: -2 },
  totalReviews: { fontSize: 13, fontFamily: "Inter_400Regular" },
  summaryRight: { flex: 1, gap: 6 },
  distRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  distLabel: { width: 22, fontSize: 12, fontFamily: "Inter_500Medium", textAlign: "right" },
  distBarBg: { flex: 1, height: 6, borderRadius: 3, overflow: "hidden" },
  distBarFill: { height: "100%", borderRadius: 3 },
  distCount: { width: 28, fontSize: 12, fontFamily: "Inter_500Medium" },
  sectionTitle: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  categoryCard: { width: "47%", alignItems: "center", gap: 6, padding: 16 },
  categoryScore: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.8 },
  categoryLabel: { fontSize: 12, fontFamily: "Inter_500Medium", textAlign: "center" },
  reviewRow: { padding: 16, gap: 10 },
  reviewTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  reviewAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  reviewInitial: { fontSize: 17, fontFamily: "Inter_700Bold" },
  reviewInfo: { flex: 1, gap: 2 },
  reviewName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  reviewDate: { fontSize: 12, fontFamily: "Inter_400Regular" },
  reviewText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20, marginLeft: 52 },
});

import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const REVIEWS = [
  { id: "1", customer: "Priya S.", rating: 5, comment: "Super fast delivery! Very professional.", date: "2h ago" },
  { id: "2", customer: "Rahul V.", rating: 5, comment: "Excellent service, handled items with care.", date: "5h ago" },
  { id: "3", customer: "Anjali M.", rating: 4, comment: "Good delivery, slightly late but communicated well.", date: "Yesterday" },
  { id: "4", customer: "Kiran P.", rating: 5, comment: "Very polite and professional. Will recommend.", date: "2 days ago" },
];

export default function RatingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Ratings & Reviews" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        <Card style={styles.overallCard}>
          <Text style={[styles.overallNum, { color: colors.foreground }]}>4.87</Text>
          <View style={styles.stars}>{[1,2,3,4,5].map((s) => <Feather key={s} name="star" size={22} color={s <= 5 ? colors.accent : colors.muted} />)}</View>
          <Text style={[styles.totalRatings, { color: colors.mutedForeground }]}>Based on 152 ratings</Text>
          {[5,4,3,2,1].map((star) => (
            <View key={star} style={styles.ratingBar}>
              <Text style={[styles.ratingStarLabel, { color: colors.mutedForeground }]}>{star}★</Text>
              <View style={[styles.ratingBarBg, { backgroundColor: colors.muted }]}>
                <View style={[styles.ratingBarFill, { backgroundColor: colors.accent, width: star === 5 ? "82%" : star === 4 ? "12%" : star === 3 ? "4%" : "1%" }]} />
              </View>
              <Text style={[styles.ratingPct, { color: colors.mutedForeground }]}>{star === 5 ? "82%" : star === 4 ? "12%" : star === 3 ? "4%" : "1%"}</Text>
            </View>
          ))}
        </Card>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Reviews</Text>
        {REVIEWS.map((r) => (
          <Card key={r.id} style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.avatarText, { color: colors.primary }]}>{r.customer.charAt(0)}</Text>
              </View>
              <View style={styles.reviewInfo}>
                <Text style={[styles.reviewCustomer, { color: colors.foreground }]}>{r.customer}</Text>
                <View style={styles.stars}>{[1,2,3,4,5].map((s) => <Feather key={s} name="star" size={12} color={s <= r.rating ? colors.accent : colors.muted} />)}</View>
              </View>
              <Text style={[styles.reviewDate, { color: colors.mutedForeground }]}>{r.date}</Text>
            </View>
            <Text style={[styles.reviewComment, { color: colors.foreground }]}>{r.comment}</Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  overallCard: { alignItems: "center", gap: 10 },
  overallNum: { fontSize: 56, fontFamily: "Inter_700Bold", letterSpacing: -2 },
  stars: { flexDirection: "row", gap: 4 },
  totalRatings: { fontSize: 13, fontFamily: "Inter_400Regular" },
  ratingBar: { flexDirection: "row", alignItems: "center", gap: 8, width: "100%" },
  ratingStarLabel: { fontSize: 12, fontFamily: "Inter_500Medium", width: 24 },
  ratingBarBg: { flex: 1, height: 6, borderRadius: 3, overflow: "hidden" },
  ratingBarFill: { height: "100%", borderRadius: 3 },
  ratingPct: { fontSize: 11, fontFamily: "Inter_400Regular", width: 32, textAlign: "right" },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  reviewCard: { gap: 10 },
  reviewTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  reviewInfo: { flex: 1, gap: 4 },
  reviewCustomer: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  reviewDate: { fontSize: 12, fontFamily: "Inter_400Regular" },
  reviewComment: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
});

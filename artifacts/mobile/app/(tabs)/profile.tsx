import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";

const MENU = [
  {
    title: "Account",
    items: [
      { icon: "user", label: "Personal Details", sub: "Name, phone, email", route: "/profile/personal" },
      { icon: "truck", label: "Vehicle Details", sub: "Bike, registration, insurance", route: "/profile/vehicle" },
      { icon: "file-text", label: "Documents", sub: "Aadhaar, PAN, DL", route: "/profile/documents" },
      { icon: "shield", label: "KYC Status", sub: "Verification status", route: "/profile/kyc-status" },
    ],
  },
  {
    title: "Finance",
    items: [
      { icon: "credit-card", label: "Bank Account", sub: "For payouts & transfers", route: "/profile/bank" },
      { icon: "smartphone", label: "UPI Details", sub: "Quick payments", route: "/profile/upi" },
    ],
  },
  {
    title: "Performance",
    items: [
      { icon: "star", label: "Ratings & Reviews", sub: "Customer feedback", route: "/performance/ratings" },
      { icon: "bar-chart-2", label: "Performance Analytics", sub: "Trends & insights", route: "/performance/analytics" },
      { icon: "award", label: "Badges & Rewards", sub: `Achievements unlocked`, route: "/performance/badges" },
    ],
  },
  {
    title: "Growth",
    items: [
      { icon: "users", label: "Refer an Agent", sub: "Earn ₹500 per referral", route: "/referral/" },
      { icon: "gift", label: "Referral Rewards", sub: "Track your earnings", route: "/referral/rewards" },
    ],
  },
  {
    title: "Support & Safety",
    items: [
      { icon: "headphones", label: "Help Center", sub: "FAQs & live support", route: "/support/" },
      { icon: "alert-triangle", label: "SOS & Safety", sub: "Emergency contacts", route: "/safety/sos" },
      { icon: "bell", label: "Notifications", sub: "Alerts & updates", route: "/notifications/" },
      { icon: "activity", label: "Safety Tips", sub: "Stay safe on the road", route: "/safety/tips" },
    ],
  },
  {
    title: "Settings",
    items: [
      { icon: "settings", label: "App Settings", sub: "Theme, language, preferences", route: "/profile/settings" },
      { icon: "globe", label: "Language", sub: "English, हिंदी, தமிழ்", route: "/profile/language" },
      { icon: "bell-off", label: "Notification Settings", sub: "Manage alerts", route: "/profile/notification-settings" },
      { icon: "lock", label: "Privacy & Security", sub: "Data & permissions", route: "/profile/privacy" },
    ],
  },
];

const ICON_COLORS: Record<string, string> = {
  "user": "#4A90E2",
  "truck": "#FF9A3D",
  "file-text": "#7C5CFF",
  "shield": "#34C759",
  "credit-card": "#00BFA6",
  "smartphone": "#FF6B35",
  "star": "#FFB800",
  "bar-chart-2": "#4A90E2",
  "award": "#FF6B35",
  "users": "#7C5CFF",
  "gift": "#FF9A3D",
  "headphones": "#34C759",
  "alert-triangle": "#FF4D4F",
  "bell": "#FFB800",
  "activity": "#00BFA6",
  "settings": "#5B5B5B",
  "globe": "#4A90E2",
  "bell-off": "#FF9A3D",
  "lock": "#7C5CFF",
};

export default function ProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { agent, kycStatus, logout } = useAuthStore();
  const { avgRating, totalBadges } = useAppStore();

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/(auth)/");
        },
      },
    ]);
  };

  const kycColor = kycStatus === "approved" ? colors.success : kycStatus === "rejected" ? colors.destructive : colors.warning;
  const kycLabel = kycStatus === "approved" ? "Verified Agent" : kycStatus === "rejected" ? "KYC Rejected" : kycStatus === "under_review" ? "KYC Under Review" : "Complete KYC";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16), paddingBottom: insets.bottom + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Hero */}
      <Animated.View entering={FadeInDown.delay(0).duration(500)}>
        <LinearGradient
          colors={["#FF6B35", "#E8501C"]}
          style={[styles.profileHero, { borderRadius: colors.radius }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroTop}>
            <View style={styles.avatarWrap}>
              {agent?.photo ? (
                <Image source={{ uri: agent.photo }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>
                    {(agent?.name || "A").charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <Pressable
                style={styles.editAvatarBtn}
                onPress={() => router.push("/profile/personal" as any)}
              >
                <Feather name="camera" size={12} color="#FFF" />
              </Pressable>
            </View>
            <View style={styles.heroInfo}>
              <Text style={styles.heroName}>{agent?.name || "Delivery Partner"}</Text>
              <Text style={styles.heroPhone}>+91 {agent?.phone || "—"}</Text>
              <View style={[styles.kycBadge, { backgroundColor: kycColor + "25", borderColor: kycColor + "40" }]}>
                <View style={[styles.kycDot, { backgroundColor: kycColor }]} />
                <Text style={[styles.kycText, { color: kycColor }]}>{kycLabel}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.heroStats, { borderTopColor: "rgba(255,255,255,0.2)" }]}>
            {[
              { label: "Rating", value: avgRating.toFixed(2) },
              { label: "Deliveries", value: (agent?.totalDeliveries ?? 152).toLocaleString() },
              { label: "Badges", value: totalBadges.toString() },
              { label: "Since", value: agent?.joinedDate ? new Date(agent.joinedDate).getFullYear().toString() : "2024" },
            ].map((s, i) => (
              <View
                key={s.label}
                style={[
                  styles.heroStat,
                  i > 0 && { borderLeftWidth: 1, borderLeftColor: "rgba(255,255,255,0.2)" },
                ]}
              >
                <Text style={styles.heroStatVal}>{s.value}</Text>
                <Text style={styles.heroStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Menu Sections */}
      {MENU.map((section, si) => (
        <Animated.View key={section.title} entering={FadeInDown.delay(60 + si * 50).duration(400)}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            {section.title.toUpperCase()}
          </Text>
          <Card padding={0} style={styles.menuCard}>
            {section.items.map((item, i) => {
              const iconColor = ICON_COLORS[item.icon] || colors.foreground;
              return (
                <Pressable
                  key={item.label}
                  onPress={() => router.push(item.route as any)}
                  style={({ pressed }) => [
                    styles.menuItem,
                    {
                      borderBottomColor: colors.border,
                      borderBottomWidth: i < section.items.length - 1 ? 1 : 0,
                      backgroundColor: pressed ? colors.muted + "60" : "transparent",
                    },
                  ]}
                >
                  <View style={[styles.menuIcon, { backgroundColor: iconColor + "14" }]}>
                    <Feather name={item.icon as any} size={16} color={iconColor} />
                  </View>
                  <View style={styles.menuText}>
                    <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
                    <Text style={[styles.menuSub, { color: colors.mutedForeground }]}>{item.sub}</Text>
                  </View>
                  <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                </Pressable>
              );
            })}
          </Card>
        </Animated.View>
      ))}

      {/* Logout */}
      <Pressable
        onPress={handleLogout}
        style={[styles.logoutBtn, { backgroundColor: colors.destructiveLight, borderRadius: colors.radiusSm, borderColor: colors.destructive + "30", borderWidth: 1 }]}
      >
        <Feather name="log-out" size={18} color={colors.destructive} />
        <Text style={[styles.logoutText, { color: colors.destructive }]}>Log Out</Text>
      </Pressable>

      <Text style={[styles.version, { color: colors.mutedForeground }]}>Bringo Agent v1.0.0 · Made with ❤️ in India</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 16 },
  profileHero: { overflow: "hidden" },
  heroTop: { flexDirection: "row", gap: 16, alignItems: "center", padding: 24, paddingBottom: 20 },
  avatarWrap: { position: "relative" },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: "rgba(255,255,255,0.5)" },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.4)",
  },
  avatarInitial: { fontSize: 32, fontFamily: "Inter_700Bold", color: "#FFF" },
  editAvatarBtn: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
  },
  heroInfo: { flex: 1, gap: 6 },
  heroName: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#FFF", letterSpacing: -0.5 },
  heroPhone: { fontSize: 14, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.8)" },
  kycBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  kycDot: { width: 6, height: 6, borderRadius: 3 },
  kycText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  heroStats: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  heroStat: { flex: 1, alignItems: "center", gap: 3 },
  heroStatVal: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#FFF", letterSpacing: -0.5 },
  heroStatLabel: { fontSize: 10, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)" },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: { overflow: "hidden" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: { flex: 1, gap: 2 },
  menuLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  menuSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 16,
  },
  logoutText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  version: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingBottom: 8,
  },
});

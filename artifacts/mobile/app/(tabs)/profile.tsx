import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";

const MENU_SECTIONS = [
  {
    title: "Account",
    items: [
      { icon: "user", label: "Personal Details", route: "/profile/personal" },
      { icon: "truck", label: "Vehicle Details", route: "/profile/vehicle" },
      { icon: "file-text", label: "Documents", route: "/profile/documents" },
      { icon: "shield", label: "KYC Status", route: "/profile/kyc-status" },
    ],
  },
  {
    title: "Finance",
    items: [
      { icon: "credit-card", label: "Bank Details", route: "/profile/bank" },
      { icon: "dollar-sign", label: "UPI Details", route: "/profile/upi" },
    ],
  },
  {
    title: "Performance",
    items: [
      { icon: "star", label: "Ratings & Reviews", route: "/performance/" },
      { icon: "bar-chart-2", label: "Performance Analytics", route: "/performance/analytics" },
      { icon: "award", label: "Badges & Rewards", route: "/performance/badges" },
    ],
  },
  {
    title: "Growth",
    items: [
      { icon: "users", label: "Refer an Agent", route: "/referral/" },
      { icon: "gift", label: "Referral Rewards", route: "/referral/rewards" },
    ],
  },
  {
    title: "Support & Safety",
    items: [
      { icon: "headphones", label: "Help Center", route: "/support/" },
      { icon: "alert-triangle", label: "SOS & Safety", route: "/safety/sos" },
      { icon: "bell", label: "Notifications", route: "/notifications/" },
    ],
  },
  {
    title: "Settings",
    items: [
      { icon: "settings", label: "App Settings", route: "/profile/settings" },
      { icon: "globe", label: "Language", route: "/profile/language" },
      { icon: "lock", label: "Privacy", route: "/profile/privacy" },
    ],
  },
];

export default function ProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { agent, kycStatus, logout } = useAuthStore();
  const { avgRating, totalBadges } = useAppStore();

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: () => { logout(); router.replace("/(auth)/"); } },
    ]);
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16), paddingBottom: insets.bottom + 100 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <Card style={styles.profileCard}>
        <View style={styles.profileTop}>
          <View style={styles.avatarWrap}>
            {agent?.photo ? (
              <Image source={{ uri: agent.photo }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primaryLight }]}>
                <Feather name="user" size={32} color={colors.primary} />
              </View>
            )}
            <Pressable style={[styles.editAvatar, { backgroundColor: colors.primary }]} onPress={() => router.push("/profile/personal" as any)}>
              <Feather name="camera" size={12} color="#FFF" />
            </Pressable>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.agentName, { color: colors.foreground }]}>{agent?.name || "Delivery Partner"}</Text>
            <Text style={[styles.agentPhone, { color: colors.mutedForeground }]}>+91 {agent?.phone || "—"}</Text>
            <Badge label={kycStatus === "approved" ? "Verified Agent" : "KYC Pending"} variant={kycStatus === "approved" ? "success" : "warning"} dot />
          </View>
        </View>
        <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
          <View style={styles.stat}>
            <Text style={[styles.statVal, { color: colors.foreground }]}>{avgRating}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Rating</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statVal, { color: colors.foreground }]}>{agent?.totalDeliveries ?? 0}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Deliveries</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statVal, { color: colors.foreground }]}>{totalBadges}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Badges</Text>
          </View>
        </View>
      </Card>

      {/* Menu Sections */}
      {MENU_SECTIONS.map((section) => (
        <View key={section.title}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{section.title}</Text>
          <Card padding={0}>
            {section.items.map((item, i) => (
              <Pressable
                key={item.label}
                onPress={() => router.push(item.route as any)}
                style={[styles.menuItem, { borderBottomColor: colors.border, borderBottomWidth: i < section.items.length - 1 ? 1 : 0 }]}
              >
                <View style={[styles.menuIcon, { backgroundColor: colors.muted }]}>
                  <Feather name={item.icon as any} size={16} color={colors.foreground} />
                </View>
                <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </Pressable>
            ))}
          </Card>
        </View>
      ))}

      {/* Logout */}
      <Pressable onPress={handleLogout} style={[styles.logoutBtn, { backgroundColor: colors.destructiveLight, borderRadius: colors.radiusSm }]}>
        <Feather name="log-out" size={18} color={colors.destructive} />
        <Text style={[styles.logoutText, { color: colors.destructive }]}>Log Out</Text>
      </Pressable>

      <Text style={[styles.version, { color: colors.mutedForeground }]}>Bringo Agent v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 16 },
  profileCard: { gap: 0 },
  profileTop: { flexDirection: "row", gap: 16, alignItems: "center", marginBottom: 16 },
  avatarWrap: { position: "relative" },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  avatarPlaceholder: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  editAvatar: { position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  profileInfo: { flex: 1, gap: 6 },
  agentName: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  agentPhone: { fontSize: 13, fontFamily: "Inter_400Regular" },
  statsRow: { flexDirection: "row", borderTopWidth: 1, paddingTop: 16 },
  stat: { flex: 1, alignItems: "center", gap: 2 },
  statVal: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  statDivider: { width: 1, height: 36, alignSelf: "center" },
  sectionTitle: { fontSize: 12, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  menuLabel: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, padding: 16 },
  logoutText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  version: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center", paddingBottom: 8 },
});

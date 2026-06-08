import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/store/authStore";
import { fadeInDown, fadeInDownDelay, fadeInDownIndexed } from "@/constants/animations";

const SECTIONS = [
  {
    title: "Account",
    items: [
      { id: "personal", label: "Personal Info", icon: "user", route: "/profile/personal" },
      { id: "vehicle", label: "Vehicle", icon: "truck", route: "/profile/vehicle" },
      { id: "kyc", label: "KYC Status", icon: "shield", route: "/profile/kyc-status" },
      { id: "documents", label: "Documents", icon: "file-text", route: "/profile/documents" },
    ],
  },
  {
    title: "Payment",
    items: [
      { id: "bank", label: "Bank Account", icon: "credit-card", route: "/profile/bank" },
      { id: "upi", label: "UPI Details", icon: "zap", route: "/profile/upi" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { id: "language", label: "Language", icon: "globe", route: "/profile/language" },
      { id: "notifications", label: "Notifications", icon: "bell", route: "/profile/notification-settings" },
      { id: "privacy", label: "Privacy & Data", icon: "lock", route: "/profile/privacy" },
    ],
  },
  {
    title: "Support",
    items: [
      { id: "help", label: "Help Center", icon: "help-circle", route: "/support/index" },
      { id: "faq", label: "FAQ", icon: "book-open", route: "/support/faq" },
    ],
  },
];

export default function SettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { logout } = useAuthStore();
  const [locationSharing, setLocationSharing] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = () => setLogoutModalVisible(true);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Settings" showBack />
      <ConfirmModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        title="Log Out"
        body="Are you sure you want to log out of your account?"
        confirmText="Log Out"
        onConfirm={() => {
          logout();
          router.replace("/(auth)/welcome" as any);
        }}
        variant="destructive"
        icon="log-out"
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 16 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Toggles */}
        <Animated.View entering={fadeInDown(0)}>
          <Card style={styles.toggleCard}>
            <View style={styles.toggleRow}>
              <View style={[styles.toggleIcon, { backgroundColor: colors.primaryLight }]}>
                <Feather name="map-pin" size={18} color={colors.primary} />
              </View>
              <View style={styles.toggleInfo}>
                <Text style={[styles.toggleLabel, { color: colors.foreground }]}>Live Location</Text>
                <Text style={[styles.toggleSub, { color: colors.mutedForeground }]}>Share location while on shift</Text>
              </View>
              <Switch
                value={locationSharing}
                onValueChange={setLocationSharing}
                trackColor={{ false: colors.muted, true: colors.primary }}
                thumbColor="#FFF"
              />
            </View>
          </Card>
        </Animated.View>

        {/* Menu Sections */}
        {SECTIONS.map((section, si) => (
          <Animated.View key={section.title} entering={fadeInDownIndexed(60, si)}>
            <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{section.title.toUpperCase()}</Text>
            <Card padding={0}>
              {section.items.map((item, ii) => (
                <Pressable
                  key={item.id}
                  onPress={() => router.push(item.route as any)}
                  style={({ pressed }) => [
                    styles.menuRow,
                    {
                      borderBottomColor: colors.border,
                      borderBottomWidth: ii < section.items.length - 1 ? 1 : 0,
                      backgroundColor: pressed ? colors.muted + "40" : "transparent",
                    },
                  ]}
                >
                  <View style={[styles.menuIcon, { backgroundColor: colors.primaryLight }]}>
                    <Feather name={item.icon as any} size={16} color={colors.primary} />
                  </View>
                  <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
                  <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                </Pressable>
              ))}
            </Card>
          </Animated.View>
        ))}

        {/* Logout */}
        <Animated.View entering={fadeInDownDelay(280)}>
          <Pressable
            onPress={handleLogout}
            style={[styles.logoutBtn, { backgroundColor: colors.destructiveLight, borderColor: colors.destructive + "30", borderRadius: colors.radiusSm }]}
          >
            <Feather name="log-out" size={18} color={colors.destructive} />
            <Text style={[styles.logoutText, { color: colors.destructive }]}>Logout</Text>
          </Pressable>
        </Animated.View>

        <Text style={[styles.version, { color: colors.mutedForeground }]}>
          Bringo Agent v2.4.1 · Built with ❤️
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  toggleCard: { gap: 0 },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  toggleIcon: { width: 40, height: 40, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  toggleInfo: { flex: 1, gap: 2 },
  toggleLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  toggleSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  sectionTitle: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.8, marginBottom: 8 },
  menuRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14 },
  menuIcon: { width: 36, height: 36, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  menuLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 16,
    borderWidth: 1,
  },
  logoutText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  version: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center" },
});

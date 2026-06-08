import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";

const PERMS = [
  {
    icon: "map-pin" as const,
    title: "Location",
    desc: "Required to find orders near you and navigate to shops and customers",
    color: "#007AFF",
    key: "location",
  },
  {
    icon: "bell" as const,
    title: "Notifications",
    desc: "Get instant alerts for new orders, bonuses, and important updates",
    color: "#FF9F0A",
    key: "notification",
  },
  {
    icon: "camera" as const,
    title: "Camera",
    desc: "Upload delivery photos, documents, and proof of delivery",
    color: "#34C759",
    key: "camera",
  },
];

export default function PermissionsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);

  const requestAll = async () => {
    setLoading(true);
    if (Platform.OS !== "web") {
      await Location.requestForegroundPermissionsAsync().catch(() => {});
      await Notifications.requestPermissionsAsync().catch(() => {});
    }
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    router.replace("/(onboarding)/");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.content, { paddingTop: insets.top + (Platform.OS === "web" ? 60 : 60) }]}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
          <View style={[styles.iconBig, { backgroundColor: colors.primaryLight }]}>
            <Feather name="shield" size={36} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>Allow Permissions</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            We need a few permissions to give you the best delivery experience
          </Text>
        </Animated.View>

        <View style={styles.perms}>
          {PERMS.map((p, i) => (
            <Animated.View
              key={p.key}
              entering={FadeInDown.delay(200 + i * 100).duration(500)}
              style={[
                styles.permCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: colors.radiusSm,
                },
              ]}
            >
              <View style={[styles.permIcon, { backgroundColor: p.color + "18" }]}>
                <Feather name={p.icon} size={22} color={p.color} />
              </View>
              <View style={styles.permText}>
                <Text style={[styles.permTitle, { color: colors.foreground }]}>{p.title}</Text>
                <Text style={[styles.permDesc, { color: colors.mutedForeground }]}>{p.desc}</Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </View>

      <Animated.View
        entering={FadeInDown.delay(600).duration(500)}
        style={[styles.footer, { paddingBottom: insets.bottom + 32 }]}
      >
        <Button title="Allow All Permissions" onPress={requestAll} loading={loading} size="xl" />
        <Button
          title="Skip for now"
          onPress={() => router.replace("/(onboarding)/")}
          variant="ghost"
          size="md"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, gap: 32 },
  header: { alignItems: "center", gap: 12 },
  iconBig: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.8, textAlign: "center" },
  subtitle: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 24 },
  perms: { gap: 12 },
  permCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    padding: 16,
    borderWidth: 1,
  },
  permIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  permText: { flex: 1, gap: 4 },
  permTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", letterSpacing: -0.2 },
  permDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  footer: { paddingHorizontal: 24, gap: 8 },
});

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { StepIndicator } from "@/components/common/StepIndicator";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/store/authStore";
import { fadeInDownDelay, fadeInDownIndexed } from "@/constants/animations";

const VEHICLES = [
  { id: "bike", label: "Bike", icon: "motorbike", desc: "Up to 20 kg", popular: true },
  { id: "cycle", label: "Cycle", icon: "bicycle", desc: "Up to 10 kg", popular: false },
  { id: "scooter", label: "Scooter", icon: "scooter", desc: "Up to 15 kg", popular: false },
  { id: "car", label: "Car", icon: "car", desc: "Up to 50 kg", popular: false },
  { id: "van", label: "Van", icon: "van-passenger", desc: "Up to 200 kg", popular: false },
] as const;

export default function VehicleTypeScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setAgent = useAuthStore((s) => s.setAgent);
  const [selected, setSelected] = useState<string | null>(null);

  const handleNext = () => {
    if (!selected) return;
    setAgent({ vehicleType: selected as any });
    router.push("/(onboarding)/personal-info");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Vehicle Type" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        <Animated.View entering={fadeInDownDelay(100)}>
          <StepIndicator current={0} total={4} label="Step 1 of 4" />
        </Animated.View>
        <Animated.View entering={fadeInDownDelay(150)} style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Choose your vehicle</Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            This determines the type of orders you receive
          </Text>
        </Animated.View>
        <View style={styles.grid}>
          {VEHICLES.map((v, i) => (
            <Animated.View key={v.id} entering={fadeInDownIndexed(250, i)} style={styles.gridItem}>
              <Pressable
                onPress={() => setSelected(v.id)}
                style={[
                  styles.vehicleCard,
                  {
                    backgroundColor: selected === v.id ? colors.primaryLight : colors.card,
                    borderColor: selected === v.id ? colors.primary : colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                {v.popular && (
                  <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.popularText}>Popular</Text>
                  </View>
                )}
                <MaterialCommunityIcons
                  name={v.icon as any}
                  size={40}
                  color={selected === v.id ? colors.primary : colors.mutedForeground}
                />
                <Text style={[styles.vehicleLabel, { color: colors.foreground }]}>{v.label}</Text>
                <Text style={[styles.vehicleDesc, { color: colors.mutedForeground }]}>{v.desc}</Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.background }]}>
        <Button title="Continue" onPress={handleNext} disabled={!selected} size="xl" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, gap: 24 },
  header: { gap: 6 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.8 },
  sub: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 22 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  gridItem: { width: "47%" },
  vehicleCard: {
    alignItems: "center",
    padding: 20,
    gap: 8,
    borderWidth: 1.5,
    position: "relative",
  },
  popularBadge: {
    position: "absolute",
    top: -1,
    right: -1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 10,
  },
  popularText: { fontSize: 10, fontFamily: "Inter_600SemiBold", color: "#FFF" },
  vehicleLabel: { fontSize: 16, fontFamily: "Inter_600SemiBold", letterSpacing: -0.2 },
  vehicleDesc: { fontSize: 12, fontFamily: "Inter_400Regular" },
  footer: { paddingHorizontal: 24, paddingTop: 12 },
});

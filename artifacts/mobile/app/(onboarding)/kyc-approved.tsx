import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";

export default function KycApprovedScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 150 });
  }, []);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.successLight, colors.background]} style={styles.gradient} />
      <View style={[styles.content, { paddingTop: insets.top + (Platform.OS === "web" ? 80 : 100) }]}>
        <Animated.View style={[styles.iconWrap, { backgroundColor: colors.success }, iconStyle]}>
          <Feather name="check" size={56} color="#FFFFFF" />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.textSection}>
          <Text style={[styles.title, { color: colors.foreground }]}>KYC Approved!</Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            Congratulations! You're now a verified Bringo delivery partner. Start earning today.
          </Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.benefits}>
          {["Start accepting delivery orders", "Earn up to ₹1,500 per day", "Daily payouts to your account", "Performance bonuses & rewards"].map((b) => (
            <View key={b} style={[styles.benefit, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}>
              <View style={[styles.benefitDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.benefitText, { color: colors.foreground }]}>{b}</Text>
            </View>
          ))}
        </Animated.View>
      </View>
      <Animated.View entering={FadeInUp.delay(700).duration(500)} style={[styles.footer, { paddingBottom: insets.bottom + 32 }]}>
        <Button title="Start Delivering" onPress={() => router.replace("/(tabs)/")} size="xl" variant="success" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { position: "absolute", top: 0, left: 0, right: 0, height: 300 },
  content: { flex: 1, paddingHorizontal: 24, alignItems: "center", gap: 32 },
  iconWrap: { width: 120, height: 120, borderRadius: 60, alignItems: "center", justifyContent: "center" },
  textSection: { alignItems: "center", gap: 10 },
  title: { fontSize: 32, fontFamily: "Inter_700Bold", letterSpacing: -1, textAlign: "center" },
  sub: { fontSize: 16, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 26 },
  benefits: { width: "100%", gap: 10 },
  benefit: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderWidth: 1 },
  benefitDot: { width: 8, height: 8, borderRadius: 4 },
  benefitText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  footer: { paddingHorizontal: 24 },
});

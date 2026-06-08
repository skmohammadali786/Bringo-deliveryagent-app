import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export default function SosScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activated, setActivated] = useState(false);
  const pulse = useSharedValue(1);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: pulse.value,
  }));

  const activateSOS = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    pulse.value = withRepeat(
      withSequence(withTiming(1.2, { duration: 400 }), withTiming(1, { duration: 400 })),
      -1, false
    );
    setActivated(true);
    // Auto-call emergency after 3 sec
    setTimeout(() => Linking.openURL("tel:112"), 3000);
  };

  return (
    <View style={[styles.container, { backgroundColor: activated ? "#FF3B3010" : colors.background }]}>
      <ScreenHeader title="Safety & SOS" showBack />
      <View style={[styles.content, { paddingTop: Platform.OS === "web" ? 40 : 40 }]}>
        {/* SOS Button */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.sosSection}>
          {activated && (
            <Animated.View style={[styles.sosPulse, { backgroundColor: colors.destructive }, pulseStyle]} />
          )}
          <Pressable
            onPress={activateSOS}
            style={[styles.sosBtn, { backgroundColor: activated ? colors.destructive : colors.destructiveLight, borderColor: colors.destructive }]}
          >
            <Feather name="alert-triangle" size={48} color={activated ? "#FFF" : colors.destructive} />
            <Text style={[styles.sosBtnText, { color: activated ? "#FFF" : colors.destructive }]}>
              {activated ? "SOS ACTIVE" : "HOLD FOR SOS"}
            </Text>
          </Pressable>
          {activated ? (
            <Text style={[styles.sosStatus, { color: colors.destructive }]}>
              Alert sent! Emergency services notified. Calling 112...
            </Text>
          ) : (
            <Text style={[styles.sosHint, { color: colors.mutedForeground }]}>
              Tap to send SOS alert to emergency contacts and support team
            </Text>
          )}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.quickActions}>
          <Pressable onPress={() => Linking.openURL("tel:112")} style={[styles.actionCard, { backgroundColor: colors.destructiveLight, borderRadius: colors.radiusSm }]}>
            <Feather name="phone" size={24} color={colors.destructive} />
            <Text style={[styles.actionLabel, { color: colors.destructive }]}>Call Police (112)</Text>
          </Pressable>
          <Pressable onPress={() => Linking.openURL("tel:108")} style={[styles.actionCard, { backgroundColor: colors.warningLight, borderRadius: colors.radiusSm }]}>
            <Feather name="heart" size={24} color={colors.warning} />
            <Text style={[styles.actionLabel, { color: colors.warning }]}>Ambulance (108)</Text>
          </Pressable>
        </Animated.View>

        {/* Safety Tips */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.tipsSection}>
          <Pressable onPress={() => router.push("/safety/tips" as any)} style={[styles.tipsBtn, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}>
            <Feather name="book-open" size={18} color={colors.foreground} />
            <Text style={[styles.tipsBtnText, { color: colors.foreground }]}>Safety Tips & Guidelines</Text>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Pressable>
          <Pressable onPress={() => router.push("/safety/incident" as any)} style={[styles.tipsBtn, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}>
            <Feather name="file-text" size={18} color={colors.foreground} />
            <Text style={[styles.tipsBtnText, { color: colors.foreground }]}>Report an Incident</Text>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, gap: 32 },
  sosSection: { alignItems: "center", gap: 16, position: "relative" },
  sosPulse: { position: "absolute", width: 200, height: 200, borderRadius: 100, top: 0 },
  sosBtn: {
    width: 180, height: 180, borderRadius: 90,
    alignItems: "center", justifyContent: "center", gap: 8,
    borderWidth: 4, zIndex: 1,
  },
  sosBtnText: { fontSize: 14, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  sosStatus: { fontSize: 14, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  sosHint: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
  quickActions: { flexDirection: "row", gap: 12 },
  actionCard: { flex: 1, alignItems: "center", padding: 16, gap: 10 },
  actionLabel: { fontSize: 13, fontFamily: "Inter_700Bold", textAlign: "center" },
  tipsSection: { gap: 10 },
  tipsBtn: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderWidth: 1 },
  tipsBtnText: { flex: 1, fontSize: 15, fontFamily: "Inter_500Medium" },
});

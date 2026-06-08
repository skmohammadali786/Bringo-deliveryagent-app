import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { fadeInDownDelay } from "@/constants/animations";

export default function SelfieScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [photo, setPhoto] = useState<string | null>(null);

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.9, cameraType: ImagePicker.CameraType.front });
    if (!result.canceled && result.assets[0]) setPhoto(result.assets[0].uri);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Selfie Verification" showBack />
      <View style={[styles.content, { paddingTop: Platform.OS === "web" ? 40 : 40 }]}>
        <Animated.View entering={fadeInDownDelay(100)} style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Live Selfie</Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>Take a live selfie to verify your identity. Must match your Aadhaar photo.</Text>
        </Animated.View>
        <Animated.View entering={fadeInDownDelay(200)} style={styles.selfieSection}>
          <Pressable onPress={takePhoto} style={[styles.selfieBox, { backgroundColor: photo ? "transparent" : colors.muted, borderColor: photo ? colors.success : colors.primary, borderRadius: colors.radius * 2 }]}>
            {photo ? (
              <Image source={{ uri: photo }} style={[styles.selfieImg, { borderRadius: colors.radius * 2 }]} />
            ) : (
              <View style={styles.placeholder}>
                <Feather name="camera" size={40} color={colors.primary} />
                <Text style={[styles.tapText, { color: colors.primary }]}>Tap to take selfie</Text>
              </View>
            )}
          </Pressable>
          <View style={styles.instructions}>
            {["Look directly at camera", "Good lighting on face", "Remove glasses", "Neutral expression"].map((t) => (
              <View key={t} style={styles.instruction}>
                <Feather name="check-circle" size={14} color={colors.success} />
                <Text style={[styles.instructionText, { color: colors.foreground }]}>{t}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <Button title="Continue" onPress={() => router.push("/(onboarding)/background-verify")} disabled={!photo} size="xl" />
        {photo && <Button title="Retake" onPress={takePhoto} variant="outline" size="md" />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, gap: 28 },
  header: { gap: 8 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.8 },
  sub: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 22 },
  selfieSection: { alignItems: "center", gap: 24 },
  selfieBox: { width: 200, height: 200, borderWidth: 2, borderStyle: "dashed", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  selfieImg: { width: 200, height: 200 },
  placeholder: { alignItems: "center", gap: 8 },
  tapText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  instructions: { gap: 10, width: "100%" },
  instruction: { flexDirection: "row", alignItems: "center", gap: 8 },
  instructionText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  footer: { paddingHorizontal: 24, gap: 8 },
});

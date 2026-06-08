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
import { useAuthStore } from "@/store/authStore";
import { fadeInDownDelay } from "@/constants/animations";

export default function ProfilePhotoScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setAgent = useAuthStore((s) => s.setAgent);
  const [photo, setPhoto] = useState<string | null>(null);

  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
      setAgent({ photo: result.assets[0].uri });
    }
  };

  const camera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
      setAgent({ photo: result.assets[0].uri });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Profile Photo" showBack />
      <View style={[styles.content, { paddingTop: Platform.OS === "web" ? 40 : 40 }]}>
        <Animated.View entering={fadeInDownDelay(100)} style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Add your photo</Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            A clear photo helps customers trust you. Use a recent, clear selfie.
          </Text>
        </Animated.View>
        <Animated.View entering={fadeInDownDelay(200)} style={styles.photoSection}>
          <Pressable onPress={camera} style={[styles.photoCircle, { backgroundColor: photo ? "transparent" : colors.muted, borderColor: photo ? colors.success : colors.border }]}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.photoImg} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Feather name="user" size={48} color={colors.mutedForeground} />
              </View>
            )}
            <View style={[styles.cameraBtn, { backgroundColor: colors.primary }]}>
              <Feather name="camera" size={16} color="#FFF" />
            </View>
          </Pressable>
          <View style={styles.photoActions}>
            <Pressable onPress={camera} style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}>
              <Feather name="camera" size={18} color={colors.foreground} />
              <Text style={[styles.actionText, { color: colors.foreground }]}>Take Selfie</Text>
            </Pressable>
            <Pressable onPress={pick} style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}>
              <Feather name="image" size={18} color={colors.foreground} />
              <Text style={[styles.actionText, { color: colors.foreground }]}>From Gallery</Text>
            </Pressable>
          </View>
          <View style={[styles.tips, { backgroundColor: colors.primaryLight, borderRadius: colors.radiusSm }]}>
            {["Good lighting on your face", "Clear, unblurred photo", "No sunglasses or hat"].map((t) => (
              <View key={t} style={styles.tip}>
                <Feather name="check" size={13} color={colors.primary} />
                <Text style={[styles.tipText, { color: colors.primary }]}>{t}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <Button title="Continue" onPress={() => router.push("/(onboarding)/aadhaar-front")} disabled={!photo} size="xl" />
        <Button title="Skip for now" onPress={() => router.push("/(onboarding)/aadhaar-front")} variant="ghost" size="md" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, gap: 32 },
  header: { gap: 8 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.8 },
  sub: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 22 },
  photoSection: { alignItems: "center", gap: 24 },
  photoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "visible",
  },
  photoImg: { width: 140, height: 140, borderRadius: 70 },
  photoPlaceholder: { alignItems: "center", justifyContent: "center" },
  cameraBtn: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  photoActions: { flexDirection: "row", gap: 12, width: "100%" },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderWidth: 1 },
  actionText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  tips: { padding: 14, width: "100%", gap: 8 },
  tip: { flexDirection: "row", alignItems: "center", gap: 8 },
  tipText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  footer: { paddingHorizontal: 24, gap: 8 },
});

import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export default function ProductPhotoScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [photos, setPhotos] = useState<string[]>([]);

  const addPhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: false, quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      setPhotos((p) => [...p, result.assets[0].uri]);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Product Photos" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Capture Products</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          Take photos of each product before pickup. This helps resolve disputes.
        </Text>
        <View style={styles.photosGrid}>
          {photos.map((uri, i) => (
            <View key={i} style={styles.photoItem}>
              <Image source={{ uri }} style={[styles.photo, { borderRadius: colors.radiusSm }]} />
              <Pressable onPress={() => setPhotos((p) => p.filter((_, idx) => idx !== i))} style={[styles.removeBtn, { backgroundColor: colors.destructive }]}>
                <Feather name="x" size={12} color="#FFF" />
              </Pressable>
            </View>
          ))}
          <Pressable onPress={addPhoto} style={[styles.addPhoto, { backgroundColor: colors.muted, borderColor: colors.border, borderRadius: colors.radiusSm }]}>
            <Feather name="camera" size={28} color={colors.mutedForeground} />
            <Text style={[styles.addText, { color: colors.mutedForeground }]}>Add Photo</Text>
          </Pressable>
        </View>
        <View style={[styles.tip, { backgroundColor: colors.primaryLight, borderRadius: colors.radiusSm }]}>
          <Feather name="info" size={14} color={colors.primary} />
          <Text style={[styles.tipText, { color: colors.primary }]}>
            Take clear photos showing quantity, condition, and brand
          </Text>
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.background }]}>
        <Button title="Continue to Price Entry" onPress={() => router.push("/product/price" as any)} disabled={photos.length === 0} size="xl" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.6, marginTop: 8 },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  photosGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  photoItem: { width: "48%", aspectRatio: 1, position: "relative" },
  photo: { width: "100%", height: "100%" },
  removeBtn: { position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  addPhoto: { width: "48%", aspectRatio: 1, alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 1.5, borderStyle: "dashed" },
  addText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  tip: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12 },
  tipText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 20 },
  footer: { paddingHorizontal: 20, paddingTop: 12 },
});

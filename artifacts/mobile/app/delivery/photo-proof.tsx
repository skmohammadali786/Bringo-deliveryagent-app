import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";

export default function DeliveryPhotoProofScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders, activeOrderId, updateOrderStatus } = useOrderStore();
  const order = orders.find((o) => o.id === activeOrderId) ?? orders[1];
  const [photo, setPhoto] = useState<string | null>(null);

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: false, quality: 0.8 });
    if (!result.canceled && result.assets[0]) setPhoto(result.assets[0].uri);
  };

  const complete = () => {
    if (order) updateOrderStatus(order.id, "delivered");
    router.push("/delivery/success" as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Delivery Proof" showBack />
      <View style={[styles.content, { paddingTop: Platform.OS === "web" ? 40 : 32 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Proof of Delivery</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          Take a photo at the customer's doorstep showing the delivered order
        </Text>
        <Pressable onPress={takePhoto} style={[styles.photoBox, { backgroundColor: colors.muted, borderColor: photo ? colors.success : colors.border, borderRadius: colors.radius }]}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <View style={styles.placeholder}>
              <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
                <Feather name="camera" size={32} color={colors.primary} />
              </View>
              <Text style={[styles.tapText, { color: colors.foreground }]}>Take Photo</Text>
              <Text style={[styles.tapSub, { color: colors.mutedForeground }]}>At customer doorstep</Text>
            </View>
          )}
        </Pressable>
      </View>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <Button title="Complete Delivery" onPress={complete} disabled={!photo} size="xl" variant="success" />
        {photo && <Button title="Retake Photo" onPress={takePhoto} variant="outline" />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, gap: 24, alignItems: "center" },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.8, textAlign: "center" },
  sub: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 24 },
  photoBox: { width: "100%", height: 240, borderWidth: 2, borderStyle: "dashed", overflow: "hidden", alignItems: "center", justifyContent: "center" },
  photo: { width: "100%", height: "100%", resizeMode: "cover" },
  placeholder: { alignItems: "center", gap: 10 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  tapText: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  tapSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  footer: { paddingHorizontal: 24, gap: 10 },
});

import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";
import { fadeInDown, fadeInDownDelay, fadeInUpDelay, zoomInDelay } from "@/constants/animations";

export default function PickupProofScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders, updateOrderStatus } = useOrderStore();
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);

  const activeOrder = orders.find((o) => ["at_shop", "accepted"].includes(o.status));

  const takePhoto = async () => {
    if (Platform.OS === "web") {
      setPhoto("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400");
      return;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setPermissionModal(true);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    if (!photo) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    if (activeOrder) updateOrderStatus(activeOrder.id, "picked_up");
    setLoading(false);
    router.push("/pickup/instructions" as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ConfirmModal
        visible={permissionModal}
        onClose={() => setPermissionModal(false)}
        title="Permission Required"
        body="Camera access is needed to take pickup proof. Please enable it in your device settings."
        confirmText="OK"
        onConfirm={() => setPermissionModal(false)}
        variant="warning"
        icon="camera"
      />
      <ScreenHeader title="Pickup Proof" showBack />
      <View style={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
        {/* Info */}
        <Animated.View entering={fadeInDown(0)}>
          <Card style={[styles.infoCard, { backgroundColor: colors.primaryLight }]}>
            <Feather name="camera" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.foreground }]}>
              Take a photo of the collected items before leaving the shop
            </Text>
          </Card>
        </Animated.View>

        {/* Camera Area */}
        <Animated.View entering={fadeInDownDelay(80)} style={{ flex: 1 }}>
          {photo ? (
            <Animated.View entering={zoomInDelay(0)} style={styles.photoWrap}>
              <Image source={{ uri: photo }} style={styles.photo} resizeMode="cover" />
              <View style={[styles.photoOverlay, { borderRadius: colors.radius }]}>
                <Pressable
                  onPress={() => setPhoto(null)}
                  style={[styles.retakeBtn, { backgroundColor: "rgba(0,0,0,0.6)" }]}
                >
                  <Feather name="refresh-cw" size={16} color="#FFF" />
                  <Text style={styles.retakeTxt}>Retake</Text>
                </Pressable>
              </View>
              <Animated.View entering={fadeInUpDelay(200)} style={[styles.successBanner, { backgroundColor: colors.success }]}>
                <Feather name="check-circle" size={18} color="#FFF" />
                <Text style={styles.successText}>Photo captured!</Text>
              </Animated.View>
            </Animated.View>
          ) : (
            <Pressable onPress={takePhoto} style={[styles.cameraBox, { backgroundColor: colors.muted, borderColor: colors.border, borderRadius: colors.radius }]}>
              <View style={[styles.cameraIcon, { backgroundColor: colors.card }]}>
                <Feather name="camera" size={44} color={colors.primary} />
              </View>
              <Text style={[styles.cameraTxt, { color: colors.foreground }]}>Tap to take photo</Text>
              <Text style={[styles.cameraHint, { color: colors.mutedForeground }]}>
                Include all items in the frame
              </Text>
            </Pressable>
          )}
        </Animated.View>

        {/* Order Summary */}
        {activeOrder && (
          <Card style={styles.orderCard}>
            <Feather name="package" size={16} color={colors.primary} />
            <View>
              <Text style={[styles.orderNum, { color: colors.foreground }]}>{activeOrder.orderNumber}</Text>
              <Text style={[styles.orderItems, { color: colors.mutedForeground }]}>
                {activeOrder.items.length} items · {activeOrder.shop.name}
              </Text>
            </View>
          </Card>
        )}

        {/* Submit */}
        <View style={[styles.footer, { paddingBottom: 0 }]}>
          <Button
            title={photo ? "Confirm Pickup" : "Take Photo First"}
            onPress={photo ? handleSubmit : takePhoto}
            loading={loading}
            size="xl"
            icon={<Feather name={photo ? "check" : "camera"} size={18} color="#FFF" />}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 20, gap: 16, paddingTop: 16 },
  infoCard: { flexDirection: "row", alignItems: "center", gap: 12 },
  infoText: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium", lineHeight: 20 },
  photoWrap: { flex: 1, borderRadius: 20, overflow: "hidden", position: "relative" },
  photo: { flex: 1 },
  photoOverlay: { position: "absolute", top: 12, right: 12 },
  retakeBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  retakeTxt: { color: "#FFF", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  successBanner: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 14 },
  successText: { color: "#FFF", fontSize: 15, fontFamily: "Inter_700Bold" },
  cameraBox: { flex: 1, alignItems: "center", justifyContent: "center", borderWidth: 2, borderStyle: "dashed", gap: 12 },
  cameraIcon: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  cameraTxt: { fontSize: 18, fontFamily: "Inter_700Bold" },
  cameraHint: { fontSize: 13, fontFamily: "Inter_400Regular" },
  orderCard: { flexDirection: "row", alignItems: "center", gap: 12 },
  orderNum: { fontSize: 14, fontFamily: "Inter_700Bold" },
  orderItems: { fontSize: 12, fontFamily: "Inter_400Regular" },
  footer: {},
});

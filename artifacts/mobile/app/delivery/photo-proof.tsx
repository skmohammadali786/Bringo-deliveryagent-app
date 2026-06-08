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
import { fadeInDownDelay, fadeInUpDelay, zoomInDelay } from "@/constants/animations";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useOrderStore } from "@/store/orderStore";

export default function PhotoProofScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders, updateOrderStatus } = useOrderStore();
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);

  const activeOrder = orders.find((o) => o.status === "delivering");

  const takePhoto = async () => {
    if (Platform.OS === "web") {
      setPhoto("https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400");
      return;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setPermissionModal(true);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const handleConfirm = async () => {
    if (!photo) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    if (activeOrder) updateOrderStatus(activeOrder.id, "delivered");
    setLoading(false);
    router.replace("/delivery/success" as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ConfirmModal
        visible={permissionModal}
        onClose={() => setPermissionModal(false)}
        title="Permission Needed"
        body="Camera access is required to take delivery proof. Please enable it in your device settings."
        confirmText="OK"
        onConfirm={() => setPermissionModal(false)}
        variant="warning"
        icon="camera"
      />
      <ScreenHeader title="Delivery Proof" showBack />
      <View style={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
        {/* Instruction */}
        <Card style={[styles.infoCard, { backgroundColor: colors.primaryLight }]}>
          <Feather name="camera" size={20} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoTitle, { color: colors.foreground }]}>Photo Required</Text>
            <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
              Take a clear photo showing the delivered items at the door
            </Text>
          </View>
        </Card>

        {/* Camera / Photo Area */}
        <View style={{ flex: 1 }}>
          {photo ? (
            <Animated.View entering={zoomInDelay(0)} style={[styles.photoContainer, { borderRadius: colors.radius }]}>
              <Image source={{ uri: photo }} style={styles.photo} resizeMode="cover" />
              <Pressable
                onPress={() => setPhoto(null)}
                style={[styles.retakeOverlay, { backgroundColor: "rgba(0,0,0,0.55)" }]}
              >
                <Feather name="refresh-cw" size={18} color="#FFF" />
                <Text style={styles.retakeTxt}>Retake Photo</Text>
              </Pressable>
              <Animated.View entering={fadeInUpDelay(200)} style={[styles.successBadge, { backgroundColor: colors.success }]}>
                <Feather name="check-circle" size={16} color="#FFF" />
                <Text style={styles.successTxt}>Photo Captured!</Text>
              </Animated.View>
            </Animated.View>
          ) : (
            <Pressable
              onPress={takePhoto}
              style={[styles.cameraArea, { backgroundColor: colors.muted, borderColor: colors.border, borderRadius: colors.radius }]}
            >
              <View style={[styles.cameraIconWrap, { backgroundColor: colors.card }]}>
                <Feather name="camera" size={48} color={colors.primary} />
              </View>
              <Text style={[styles.cameraTxt, { color: colors.foreground }]}>Tap to take photo</Text>
              <Text style={[styles.cameraHint, { color: colors.mutedForeground }]}>
                Include the door, mailbox or any landmark
              </Text>
            </Pressable>
          )}
        </View>

        {/* Order Info */}
        {activeOrder && (
          <Card style={styles.orderInfo}>
            <Feather name="map-pin" size={16} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.orderNum, { color: colors.foreground }]}>{activeOrder.orderNumber}</Text>
              <Text style={[styles.orderAddr, { color: colors.mutedForeground }]} numberOfLines={1}>
                {activeOrder.customer.address}
              </Text>
            </View>
          </Card>
        )}
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <Button
          title={photo ? "Confirm Delivery" : "Take Photo First"}
          onPress={photo ? handleConfirm : takePhoto}
          loading={loading}
          size="xl"
          icon={<Feather name={photo ? "check" : "camera"} size={18} color="#FFF" />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 20, gap: 16, paddingTop: 16 },
  infoCard: { flexDirection: "row", alignItems: "center", gap: 12 },
  infoTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  infoText: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  photoContainer: { flex: 1, overflow: "hidden" },
  photo: { flex: 1 },
  retakeOverlay: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  retakeTxt: { color: "#FFF", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  successBadge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
  },
  successTxt: { color: "#FFF", fontSize: 15, fontFamily: "Inter_700Bold" },
  cameraArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    borderWidth: 2,
    borderStyle: "dashed",
  },
  cameraIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cameraTxt: { fontSize: 18, fontFamily: "Inter_700Bold" },
  cameraHint: { fontSize: 13, fontFamily: "Inter_400Regular" },
  orderInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  orderNum: { fontSize: 14, fontFamily: "Inter_700Bold" },
  orderAddr: { fontSize: 12, fontFamily: "Inter_400Regular" },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});

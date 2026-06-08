import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useColors } from "@/hooks/useColors";

interface DocumentUploadProps {
  label: string;
  hint?: string;
  onSelect?: (uri: string) => void;
  style?: ViewStyle;
}

export function DocumentUpload({ label, hint, onSelect, style }: DocumentUploadProps) {
  const colors = useColors();
  const [uri, setUri] = useState<string | null>(null);

  const handlePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const selectedUri = result.assets[0].uri;
      setUri(selectedUri);
      onSelect?.(selectedUri);
    }
  };

  const handleCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const selectedUri = result.assets[0].uri;
      setUri(selectedUri);
      onSelect?.(selectedUri);
    }
  };

  return (
    <View style={style}>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
      {hint && (
        <Text style={[styles.hint, { color: colors.mutedForeground }]}>{hint}</Text>
      )}
      <Pressable
        onPress={handleCamera}
        style={[
          styles.uploadBox,
          {
            backgroundColor: uri ? "transparent" : colors.muted,
            borderColor: uri ? colors.success : colors.border,
            borderRadius: colors.radiusSm,
          },
        ]}
      >
        {uri ? (
          <>
            <Image source={{ uri }} style={styles.preview} />
            <View style={[styles.retake, { backgroundColor: colors.overlay }]}>
              <Feather name="camera" size={16} color="#fff" />
              <Text style={styles.retakeText}>Retake</Text>
            </View>
          </>
        ) : (
          <View style={styles.placeholder}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
              <Feather name="camera" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.uploadText, { color: colors.foreground }]}>Take Photo</Text>
            <Text style={[styles.uploadHint, { color: colors.mutedForeground }]}>
              or tap to upload from gallery
            </Text>
          </View>
        )}
      </Pressable>
      {uri && (
        <Pressable onPress={handlePick} style={styles.gallery}>
          <Feather name="image" size={14} color={colors.primary} />
          <Text style={[styles.galleryText, { color: colors.primary }]}>
            Choose from gallery
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  hint: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginBottom: 12,
  },
  uploadBox: {
    height: 180,
    borderWidth: 1.5,
    borderStyle: "dashed",
    overflow: "hidden",
  },
  preview: { width: "100%", height: "100%", resizeMode: "cover" },
  retake: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
  },
  retakeText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  uploadText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  uploadHint: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  gallery: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  galleryText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
});

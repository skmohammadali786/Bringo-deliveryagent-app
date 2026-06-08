import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { fadeInDown, fadeInDownDelay } from "@/constants/animations";

const LANGUAGES = [
  { code: "en", name: "English", native: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", native: "मराठी", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", native: "বাংলা", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳" },
];

export default function LanguageScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState("en");
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSuccessModal(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ConfirmModal
        visible={successModal}
        onClose={() => setSuccessModal(false)}
        title="Language Updated"
        body="App language has been changed. Please restart for the full effect."
        confirmText="OK"
        onConfirm={() => router.back()}
        variant="info"
        icon="globe"
      />
      <ScreenHeader title="Language" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 16 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={fadeInDown(0)}>
          <Card style={[styles.infoBanner, { backgroundColor: colors.infoLight }]}>
            <Feather name="globe" size={18} color={colors.info} />
            <Text style={[styles.infoText, { color: colors.info }]}>
              Select your preferred language for the app interface
            </Text>
          </Card>
        </Animated.View>

        <Animated.View entering={fadeInDownDelay(60)}>
          <Card padding={0}>
            {LANGUAGES.map((lang, i) => (
              <Pressable
                key={lang.code}
                onPress={() => setSelected(lang.code)}
                style={({ pressed }) => [
                  styles.langRow,
                  {
                    borderBottomColor: colors.border,
                    borderBottomWidth: i < LANGUAGES.length - 1 ? 1 : 0,
                    backgroundColor: pressed ? colors.muted + "40" : "transparent",
                  },
                ]}
              >
                <Text style={styles.flag}>{lang.flag}</Text>
                <View style={styles.langInfo}>
                  <Text style={[styles.langName, { color: colors.foreground }]}>{lang.name}</Text>
                  <Text style={[styles.langNative, { color: colors.mutedForeground }]}>{lang.native}</Text>
                </View>
                {selected === lang.code ? (
                  <View style={[styles.checkCircle, { backgroundColor: colors.success }]}>
                    <Feather name="check" size={14} color="#FFF" />
                  </View>
                ) : (
                  <View style={[styles.emptyCircle, { borderColor: colors.border }]} />
                )}
              </Pressable>
            ))}
          </Card>
        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, borderTopColor: colors.border, backgroundColor: colors.background }]}>
        <Button title="Apply Language" onPress={handleSave} loading={loading} size="xl" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  infoBanner: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 14 },
  infoText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  langRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16 },
  flag: { fontSize: 28 },
  langInfo: { flex: 1, gap: 2 },
  langName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  langNative: { fontSize: 13, fontFamily: "Inter_400Regular" },
  checkCircle: { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  emptyCircle: { width: 26, height: 26, borderRadius: 13, borderWidth: 2 },
  footer: { paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
});

import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const LANGUAGES = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिंदी" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
];

export default function LanguageScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState("en");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Language" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        {LANGUAGES.map((lang) => (
          <Pressable
            key={lang.code}
            onPress={() => setSelected(lang.code)}
            style={[styles.langCard, { backgroundColor: selected === lang.code ? colors.primaryLight : colors.card, borderColor: selected === lang.code ? colors.primary : colors.border, borderRadius: colors.radiusSm }]}
          >
            <View style={styles.langText}>
              <Text style={[styles.langName, { color: colors.foreground }]}>{lang.name}</Text>
              <Text style={[styles.langNative, { color: colors.mutedForeground }]}>{lang.native}</Text>
            </View>
            {selected === lang.code && <Feather name="check" size={18} color={colors.primary} />}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 10 },
  langCard: { flexDirection: "row", alignItems: "center", padding: 16, borderWidth: 1.5 },
  langText: { flex: 1, gap: 2 },
  langName: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  langNative: { fontSize: 14, fontFamily: "Inter_400Regular" },
});

import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export default function EmergencySupportScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Emergency Support" showBack />
      <View style={styles.content}>
        <View style={[styles.iconWrap, { backgroundColor: colors.destructiveLight }]}>
          <Feather name="alert-triangle" size={48} color={colors.destructive} />
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>Emergency Support</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          If you're in danger or need immediate assistance, use the options below
        </Text>
        <View style={styles.btns}>
          <Button title="Call Emergency Helpline" onPress={() => Linking.openURL("tel:+911800274646")} variant="destructive" size="xl" />
          <Button title="SOS Alert" onPress={() => router.push("/safety/sos" as any)} variant="outline" size="xl" />
          <Button title="Contact Police (112)" onPress={() => Linking.openURL("tel:112")} variant="ghost" size="lg" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, alignItems: "center", justifyContent: "center", gap: 16 },
  iconWrap: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.8, textAlign: "center" },
  sub: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 24 },
  btns: { width: "100%", gap: 10 },
});

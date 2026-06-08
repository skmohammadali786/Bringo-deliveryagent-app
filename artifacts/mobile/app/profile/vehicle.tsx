import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/store/authStore";

export default function VehicleProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { agent } = useAuthStore();
  const [regNum, setRegNum] = useState(agent?.vehicleNumber ?? "");
  const [model, setModel] = useState("");

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScreenHeader title="Vehicle Details" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: colors.foreground }]}>Vehicle Information</Text>
        <View style={styles.form}>
          <Input label="Vehicle Type" value={agent?.vehicleType ? agent.vehicleType.charAt(0).toUpperCase() + agent.vehicleType.slice(1) : "Bike"} editable={false} hint="Vehicle type cannot be changed after registration" />
          <Input label="Registration Number" value={regNum} onChangeText={(t) => setRegNum(t.toUpperCase())} autoCapitalize="characters" placeholder="KA 01 AB 1234" />
          <Input label="Vehicle Model" value={model} onChangeText={setModel} placeholder="e.g. Honda Activa 6G" autoCapitalize="words" />
          <Input label="Year of Manufacture" placeholder="e.g. 2020" keyboardType="numeric" />
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.background }]}>
        <Button title="Save Vehicle Details" onPress={() => router.back()} size="xl" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, gap: 20, paddingTop: 8 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.6 },
  form: { gap: 16 },
  footer: { paddingHorizontal: 24, paddingTop: 12 },
});

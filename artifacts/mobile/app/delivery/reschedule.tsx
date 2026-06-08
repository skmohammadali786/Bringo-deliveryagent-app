import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { useColors } from "@/hooks/useColors";

export default function RescheduleScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Reschedule Delivery" showBack />
      <EmptyState icon="calendar" title="Reschedule Request Sent" subtitle="Support team has been notified. The customer will be contacted for a new delivery slot." />
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <Button title="Back to Home" onPress={() => router.replace("/(tabs)/")} size="xl" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  footer: { paddingHorizontal: 24 },
});

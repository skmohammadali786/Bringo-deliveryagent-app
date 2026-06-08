import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface StepIndicatorProps {
  current: number;
  total: number;
  label?: string;
}

export function StepIndicator({ current, total, label }: StepIndicatorProps) {
  const colors = useColors();
  return (
    <View style={styles.container}>
      <View style={styles.dots}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i < current ? colors.primary : i === current ? colors.primary : colors.muted,
                width: i === current ? 20 : 8,
                opacity: i < current ? 0.4 : 1,
              },
            ]}
          />
        ))}
      </View>
      {label && (
        <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: 8 },
  dots: { flexDirection: "row", gap: 6, alignItems: "center" },
  dot: { height: 8, borderRadius: 4 },
  label: { fontSize: 12, fontFamily: "Inter_400Regular" },
});

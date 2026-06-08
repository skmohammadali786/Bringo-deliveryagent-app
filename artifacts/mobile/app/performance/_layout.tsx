import { Stack } from "expo-router";

export default function PerformanceLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="ratings" />
      <Stack.Screen name="score" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="badges" />
      <Stack.Screen name="rewards" />
    </Stack>
  );
}

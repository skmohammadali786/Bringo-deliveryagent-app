import { Stack } from "expo-router";

export default function EarningsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="withdraw" />
      <Stack.Screen name="history" />
      <Stack.Screen name="incentives" />
    </Stack>
  );
}

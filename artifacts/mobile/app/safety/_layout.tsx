import { Stack } from "expo-router";

export default function SafetyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="sos" />
      <Stack.Screen name="incident" />
      <Stack.Screen name="tips" />
    </Stack>
  );
}

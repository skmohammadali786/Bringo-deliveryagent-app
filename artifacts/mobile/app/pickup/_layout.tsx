import { Stack } from "expo-router";

export default function PickupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="instructions" />
      <Stack.Screen name="confirm" />
      <Stack.Screen name="proof" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}

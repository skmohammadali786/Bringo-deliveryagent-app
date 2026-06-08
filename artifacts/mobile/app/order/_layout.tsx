import { Stack } from "expo-router";

export default function OrderLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_bottom" }}>
      <Stack.Screen name="[id]" />
      <Stack.Screen name="new-request" />
      <Stack.Screen name="queue" />
      <Stack.Screen name="scheduled" />
    </Stack>
  );
}

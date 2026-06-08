import { Stack } from "expo-router";

export default function DeliveryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="navigate" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="photo-proof" />
      <Stack.Screen name="success" />
      <Stack.Screen name="failed" />
      <Stack.Screen name="reschedule" />
    </Stack>
  );
}

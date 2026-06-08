import { Stack } from "expo-router";

export default function SupportLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="faq" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="issue" />
      <Stack.Screen name="order-dispute" />
      <Stack.Screen name="emergency" />
    </Stack>
  );
}

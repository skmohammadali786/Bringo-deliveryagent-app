import { Stack } from "expo-router";

export default function ShopLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="[id]" />
      <Stack.Screen name="suggested" />
      <Stack.Screen name="not-available" />
      <Stack.Screen name="alternate-product" />
    </Stack>
  );
}

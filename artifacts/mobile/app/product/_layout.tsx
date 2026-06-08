import { Stack } from "expo-router";

export default function ProductLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="photo" />
      <Stack.Screen name="price" />
      <Stack.Screen name="review" />
      <Stack.Screen name="approval-pending" />
      <Stack.Screen name="alternative" />
    </Stack>
  );
}

import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="vehicle-type" />
      <Stack.Screen name="personal-info" />
      <Stack.Screen name="profile-photo" />
      <Stack.Screen name="aadhaar-front" />
      <Stack.Screen name="aadhaar-back" />
      <Stack.Screen name="pan" />
      <Stack.Screen name="dl-front" />
      <Stack.Screen name="dl-back" />
      <Stack.Screen name="vehicle-rc" />
      <Stack.Screen name="insurance" />
      <Stack.Screen name="bank-details" />
      <Stack.Screen name="upi-details" />
      <Stack.Screen name="emergency-contact" />
      <Stack.Screen name="selfie" />
      <Stack.Screen name="background-verify" />
      <Stack.Screen name="terms" />
      <Stack.Screen name="kyc-review" />
      <Stack.Screen name="kyc-approved" />
      <Stack.Screen name="kyc-rejected" />
    </Stack>
  );
}

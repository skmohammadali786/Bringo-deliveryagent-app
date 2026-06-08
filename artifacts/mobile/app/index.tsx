import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/authStore";

export default function Root() {
  const { isAuthenticated, onboardingStep, kycStatus } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/" />;
  }

  if (onboardingStep !== "completed") {
    return <Redirect href="/(onboarding)/" />;
  }

  if (kycStatus === "under_review" || kycStatus === "not_started") {
    return <Redirect href="/(onboarding)/kyc-review" />;
  }

  if (kycStatus === "rejected") {
    return <Redirect href="/(onboarding)/kyc-rejected" />;
  }

  return <Redirect href="/(tabs)/" />;
}

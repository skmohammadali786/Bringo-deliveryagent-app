import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type KycStatus = "pending" | "under_review" | "approved" | "rejected" | "not_started";
export type OnboardingStep =
  | "not_started"
  | "vehicle_type"
  | "personal_info"
  | "documents"
  | "bank_details"
  | "kyc_submitted"
  | "completed";

interface AgentProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  photo?: string;
  vehicleType?: "bike" | "cycle" | "scooter" | "car" | "van";
  vehicleNumber?: string;
  rating: number;
  totalDeliveries: number;
  totalEarnings: number;
  joinedDate: string;
}

interface AuthState {
  isAuthenticated: boolean;
  onboardingStep: OnboardingStep;
  kycStatus: KycStatus;
  agent: AgentProfile | null;
  isOnline: boolean;
  phoneNumber: string;

  setAuthenticated: (val: boolean) => void;
  setOnboardingStep: (step: OnboardingStep) => void;
  setKycStatus: (status: KycStatus) => void;
  setAgent: (agent: Partial<AgentProfile>) => void;
  setIsOnline: (online: boolean) => void;
  setPhoneNumber: (phone: string) => void;
  completeOnboarding: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      onboardingStep: "not_started",
      kycStatus: "not_started",
      agent: null,
      isOnline: false,
      phoneNumber: "",

      setAuthenticated: (val) => set({ isAuthenticated: val }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      setKycStatus: (status) => set({ kycStatus: status }),
      setAgent: (agent) =>
        set((s) => ({
          agent: s.agent
            ? { ...s.agent, ...agent }
            : {
                id: Date.now().toString(),
                name: "",
                phone: get().phoneNumber,
                rating: 4.8,
                totalDeliveries: 0,
                totalEarnings: 0,
                joinedDate: new Date().toISOString(),
                ...agent,
              },
        })),
      setIsOnline: (online) => set({ isOnline: online }),
      setPhoneNumber: (phone) => set({ phoneNumber: phone }),
      completeOnboarding: () =>
        set({ onboardingStep: "completed", kycStatus: "under_review" }),
      logout: () =>
        set({
          isAuthenticated: false,
          onboardingStep: "not_started",
          kycStatus: "not_started",
          agent: null,
          isOnline: false,
          phoneNumber: "",
        }),
    }),
    {
      name: "bringo-agent-auth",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

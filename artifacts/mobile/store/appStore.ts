import { create } from "zustand";

interface EarningsData {
  today: number;
  todayOrders: number;
  week: number;
  weekOrders: number;
  month: number;
  monthOrders: number;
  incentives: number;
  bonuses: number;
}

interface AppState {
  earnings: EarningsData;
  shiftStartTime: string | null;
  totalHoursToday: number;
  acceptanceRate: number;
  completionRate: number;
  avgRating: number;
  totalBadges: number;
  isFirstLaunch: boolean;

  setEarnings: (data: Partial<EarningsData>) => void;
  startShift: () => void;
  endShift: () => void;
  setFirstLaunch: (val: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  earnings: {
    today: 847,
    todayOrders: 7,
    week: 4230,
    weekOrders: 38,
    month: 17850,
    monthOrders: 152,
    incentives: 500,
    bonuses: 200,
  },
  shiftStartTime: null,
  totalHoursToday: 4.5,
  acceptanceRate: 94,
  completionRate: 98,
  avgRating: 4.87,
  totalBadges: 8,
  isFirstLaunch: false,

  setEarnings: (data) =>
    set((s) => ({ earnings: { ...s.earnings, ...data } })),
  startShift: () => set({ shiftStartTime: new Date().toISOString() }),
  endShift: () => set({ shiftStartTime: null }),
  setFirstLaunch: (val) => set({ isFirstLaunch: val }),
}));

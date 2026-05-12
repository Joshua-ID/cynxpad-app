/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

interface UserState {
  profile: any | null;
  setProfile: (profile: any) => void;
  role: "reader" | "writer" | "ghostwriter" | "admin" | null;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  role: null,
  setProfile: (profile) => set({ profile, role: profile?.role }),
}));

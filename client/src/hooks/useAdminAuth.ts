import { apiClient } from "@/api/api-client";
import axios from "axios";
import { create, SetState } from "zustand";

type Admin = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
};

type IAdminAuth = {
    admin: Admin | null;
    loading: boolean;
    setApplicant: (applicant: Admin | null) => void;
    checkAuth: () => Promise<void>;
    logout: () => void;
};

export const useAdminAuth = create<IAdminAuth>((set: SetState<IAdminAuth>) => ({

    admin: null,
    loading: true,

    setApplicant: (applicant) => set({ admin: applicant }),

    checkAuth: async () => {
        const token = localStorage.getItem('access_token');
        try {
            if (token) {
                const { data } = await apiClient.get("/auth/admin-details");
                set({ admin: data || null, loading: false });
            } else {
                set({ admin: null, loading: false })
            }
        } catch (error) {
            console.error("Failed to check authentication:", error);
            set({ loading: false });
        }
    },

    logout: async () => {
        try {
            await axios.post("http://localhost:8080/api/v1/auth/admin-logout");
            set({ admin: null });
        } catch (error) {
            console.error("Error in logout", error);
        }
    }
}));

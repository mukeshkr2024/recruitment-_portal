import { apiClient } from "@/api/api-client";
import axios from "axios";
import { create, SetState } from "zustand";

type Applicant = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
};

type IApplicantAuth = {
    applicant: Applicant | null;
    loading: boolean;
    setApplicant: (applicant: Applicant | null) => void;
    checkAuth: () => Promise<void>;
    logout: () => void;
};

export const useApplicantAuth = create<IApplicantAuth>((set: SetState<IApplicantAuth>) => ({
    applicant: null,
    loading: true,

    setApplicant: (applicant) => set({ applicant }),

    checkAuth: async () => {
        const token = localStorage.getItem('access_token');
        try {
            if (token) {
                const { data } = await apiClient.get("/auth/applicant-details");
                set({ applicant: data || null, loading: false });
            } else {
                set({ applicant: null, loading: false });
            }
        } catch (error) {
            console.error("Failed to check authentication:", error);
            set({ loading: false });
        }
    },

    logout: async () => {
        try {
            await axios.post("http://localhost:8080/api/v1/auth/applicant-logout");
            set({ applicant: null });
        } catch (error) {
            console.error("Error in logout", error);
        }
    }
}));

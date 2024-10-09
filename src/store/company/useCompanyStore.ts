import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ApiCompany } from "@/pages/api/companies/[id]";
import api from "@/utils/api";
import moment from "moment";

interface CompanyState {
  companies: ApiCompany[];
  availableCompanies: ApiCompany[];
  fetchCompanies: () => Promise<void>;
  fetchCompany: (id: number) => Promise<ApiCompany | null>;
  updateAvailability: () => Promise<void>;
  lastUpdateTime: number;
  isLoading: boolean;
}

console.log("Initializing useCompanyStore");

export const useCompanyStore = create(
  persist<CompanyState>(
    (set, get) => ({
      companies: [],
      availableCompanies: [],
      lastUpdateTime: 0,
      isLoading: false,

      fetchCompanies: async () => {
        console.log(
          "@/store/company/useCompanyStore.ts:28 fetchCompanies called",
        );
        set({ isLoading: true });

        try {
          console.log(
            "@/store/company/useCompanyStore.ts: Fetching companies from API",
          );
          const response = await api.get("/companies");
          console.log(
            "@/store/company/useCompanyStore.ts: API response received",
            response.data,
          );

          set({ companies: response.data, isLoading: false });
          console.log(
            "@/store/company/useCompanyStore.ts: Companies set in state",
          );

          // Update availability after fetching companies
          await get().updateAvailability();
        } catch (error) {
          console.error("Error fetching companies:", error);
          set({ isLoading: false });
        } finally {
          console.log(
            "@/store/company/useCompanyStore.ts: Exiting fetchCompanies",
          );
        }
      },

      fetchCompany: async (id: number) => {
        console.log(`fetchCompany called for id: ${id}`);
        const { companies } = get();
        const existingCompany = companies.find((c) => c.id === id);
        if (existingCompany) return existingCompany;

        try {
          const response = await api.get(`/companies/${id}`);
          const company = response.data;
          set((state) => ({
            companies: [...state.companies.filter((c) => c.id !== id), company],
          }));
          return company;
        } catch (error) {
          console.error("Error fetching company:", error);
          return null;
        }
      },

      updateAvailability: async () => {
        console.log(
          "@/store/company/useCompanyStore.ts: updateAvailability called",
        );
        const { companies } = get();
        const now = Date.now();

        const companyIds = companies.map((company) => Number(company.id));

        if (companyIds.length === 0) {
          console.log(
            "No companies found, setting availableCompanies to empty array",
          );
          set({ availableCompanies: [], lastUpdateTime: now });
          return;
        }

        try {
          console.log("Checking availability for companies:", companyIds);
          const response = await api.post("/companies/checkAvailability", {
            companyIds: companyIds,
            currentTime: moment().toISOString(),
          });

          const availabilityResults = response.data;
          console.log("Availability results:", availabilityResults);

          const availableCompanies = companies.filter((company: ApiCompany) => {
            const result = availabilityResults.find(
              (result: { companyId: number; isOpen: boolean }) =>
                result.companyId === Number(company.id),
            );
            console.log(`Company ${company.id} availability:`, result);
            return result && result.isOpen;
          });

          console.log("Available companies:", availableCompanies);
          set({ availableCompanies, lastUpdateTime: now });
        } catch (error) {
          console.error("Error updating availability:", error);
        }
      },
    }),
    {
      name: "company-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        console.log("Store rehydrated:", state);
      },
    },
  ),
);

console.log("useCompanyStore initialized");

export default useCompanyStore;

import { create } from "zustand";
import { ApiCompany } from "@/pages/api/companies/[id]";
import api from "@/utils/api";
import moment from "moment";

// interface BusinessHour {
//   day: string;
//   open: string;
//   close: string;
// }

// interface CompanyWithHours extends ApiCompany {
//   businessHours: BusinessHour[];
// }

interface CompanyState {
  companies: ApiCompany[];
  availableCompanies: ApiCompany[];
  fetchCompanies: () => Promise<void>;
  fetchCompany: (id: number) => Promise<ApiCompany | null>;
  updateAvailability: () => Promise<void>;
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: [],
  availableCompanies: [],
  fetchCompanies: async () => {
    const response = await api.get("/companies");
    // console.log("@/store/company/useCompanyStore.ts:29", { response });
    const companies = response.data;
    set({ companies });
    await get().updateAvailability();
  },
  fetchCompany: async (id: number) => {
    const response = await api.get(`/companies/${id}`);
    const company = response.data;
    set((state) => ({
      companies: [...state.companies.filter((c) => c.id !== id), company],
    }));
    return company;
  },
  updateAvailability: async () => {
    const { companies } = get();
    const companyIds = companies.map((company) => Number(company.id));
    console.log("Company IDs:", companyIds);

    if (companyIds.length === 0) {
      console.log("No companies found");
      set({ availableCompanies: [] });
      return;
    }

    try {
      const response = await api.post("/companies/checkAvailability", {
        companyIds: companyIds,
        currentTime: moment().toISOString(),
      });

      console.log("API Response:", response.data);

      const availabilityResults = response.data;

      const availableCompanies = companies.filter((company: ApiCompany) => {
        const result = availabilityResults.find(
          (result: { companyId: number; isOpen: boolean }) =>
            result.companyId === Number(company.id)
        );
        console.log(
          `Company ${company.id}: ${
            result
              ? result.isOpen
                ? "Open"
                : "Closed"
              : "Not found in results"
          }`
        );
        return result && result.isOpen;
      });

      console.log("Available Companies:", availableCompanies);

      set({ availableCompanies });
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  },
}));

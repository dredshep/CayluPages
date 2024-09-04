import { FC } from "react";
import { JoinedCompany } from "@/types/JoinedCompany";
import { ApiCompany } from "@/pages/api/companies/[id]";

interface CompanyHeaderProps {
  // company: JoinedCompany;
  company: ApiCompany;
  hours: string;
}

const CompanyHeader: FC<CompanyHeaderProps> = ({ company, hours }) => {
  return (
    <div className="mt-[37px] flex justify-between items-end">
      <div className="flex flex-col gap-[14px]">
        <h1 className="text-4xl font-bold">{company.name}</h1>
        <div className="text-lg text-gray-400">{company.description}</div>
      </div>
      <div className="flex flex-col gap-4 items-end">
        <div className="text-gray-400 flex gap-3 items-center text-[29px]">
          <div>{hours}</div>
        </div>
      </div>
    </div>
  );
};

export default CompanyHeader;

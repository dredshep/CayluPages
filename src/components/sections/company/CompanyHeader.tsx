import { FC } from "react";
import { JoinedCompany } from "@/types/JoinedCompany";

interface CompanyHeaderProps {
  company: JoinedCompany;
  hours: string;
}

const CompanyHeader: FC<CompanyHeaderProps> = ({ company, hours }) => {
  return (
    <div className="mt-[37px] flex justify-between items-end">
      <div className="flex flex-col gap-[14px]">
        <h1 className="text-4xl font-bold">{company.name}</h1>
        <p className="text-lg text-gray-400">{company.description}</p>
      </div>
      <div className="flex flex-col gap-4 items-end">
        <div className="text-gray-400 flex gap-3 items-center text-[29px]">
          <p>{hours}</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyHeader;

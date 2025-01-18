import React from "react";
import EditCompany from "@/components/Forms/Companies/CompanyFormEdit/EditCompany";
import { TableCell, TableRow } from "@/components/ui/table";
import { Company } from "@/types/company-types/companyTypes";
import { Eye, Upload } from "lucide-react";
import apiClient from "@/api/axiosConfig";

type CompaniesCardProps = {
  companies: Company[];
};

const CompaniesCard = ({ companies }: CompaniesCardProps) => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, companyId: string) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await apiClient.post(`/companies/${companyId}/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Logo uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading logo:", error);
    }
  };

  const handleViewLogo = (logoUrl: string) => {
    window.open(logoUrl, "_blank");
  };

  return (
    <>
      {companies &&
        companies.map(company => (
          <TableRow key={company.id}>
            <TableCell className="font-semibold">{company.name}</TableCell>
            <TableCell className="text-center font-semibold">{company.registration_number}</TableCell>
            <TableCell className="text-center font-semibold">{company.mol}</TableCell>
            <TableCell className="text-center font-semibold">
              <div className="flex justify-center items-center gap-2">
                {company.logo_url && (
                  <button
                    onClick={() => handleViewLogo(company.logo_url!)}
                    title="View Logo"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                )}
                <label className="text-green-500 hover:text-green-700 cursor-pointer">
                  <Upload className="w-5 h-5" />
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.svg"
                    className="hidden"
                    onChange={(event) => handleFileChange(event, company.id!)}
                  />
                </label>
              </div>
            </TableCell>
            <TableCell className="text-end w-[200px]">
              <EditCompany company_id={company.id!} />
            </TableCell>
          </TableRow>
        ))}
    </>
  );
};

export default CompaniesCard;
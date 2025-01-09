// src/components/tables/MeasuresTable/MeasuresTableBody.tsx
import { TableCell } from "@/components/ui/table";
import { Ruler } from "lucide-react";

import { TableRow } from "@/components/ui/table";

import MeasuresCard from "./MeasuresCard";

import ConditionalRenderer from "@/components/common/ConditionalRenderer/ConditionalRenderer";

import { Table } from "@/components/ui/table";

import { TableBody } from "@/components/ui/table";

import ErrorMessage from "@/components/common/FormMessages/ErrorMessage";
import CreateMeasure from "@/components/Forms/Measures/MeasureFormCreate/CreateMeasure";
import { useFetchDataQuery } from "@/hooks/useQueryHook";

import { Measure } from "@/types/measure-types/measureTypes";

import MeasuresLoader from "@/utils/SkeletonLoader/Measures/MeasuresLoader";
import MeasuresHeader from "./MeasuresHeader";
import { CircleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MeasureResponse {
  success: boolean;
  data: Measure[];
}
const MeasuresTableBody = () => {
  const { t } = useTranslation();
  const {
    data: measuresResponse,
    isPending,
    isError
  } = useFetchDataQuery<MeasureResponse>({
    URL: "/measures",
    queryKey: ["measures"]
  }) as { data: MeasureResponse; isPending: boolean; isError: boolean };

  console.log("📏 Measures data:", measuresResponse);

  if (isPending) {
    return <MeasuresLoader measures={measuresResponse?.data} />;
  }

  if (isError) {
    return <ErrorMessage title="Oops..." Icon={CircleAlert} />;
  }

  return (
    <div className="flex w-full flex-col flex-1 py-8 items-center md:px-0">
      <div className="flex gap-4 items-end justify-end w-full mb-4 md:w-2/3">
        <CreateMeasure />
      </div>
      <Table className="w-full min-w-full">
        <MeasuresHeader />
        <TableBody>
          <ConditionalRenderer
            data={measuresResponse?.data || []}
            renderData={data => <MeasuresCard measures={data as Measure[]} />}
            noResults={{
              title: t("No measures found"),
              description: t("It looks like you haven't added any measures yet."),
              Icon: Ruler
            }}
            wrapper={content => (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-3xl">
                  {content}
                </TableCell>
              </TableRow>
            )}
          />
        </TableBody>
      </Table>
    </div>
  );
};

export default MeasuresTableBody;

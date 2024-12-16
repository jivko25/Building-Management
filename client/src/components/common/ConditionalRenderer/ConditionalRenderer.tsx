// src/components/common/ConditionalRenderer/ConditionalRenderer.tsx
import { LucideProps } from "lucide-react";
import NoResultsFound from "../FormMessages/NoResultsFound";
import { PaginatedWorkItems } from "@/types/work-item-types/workItem";

type NoResultsFoundProps = {
  title: string;
  description: string;
  Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
};

interface ConditionalRendererProps<T> {
  data?: T[] | PaginatedWorkItems;
  renderData: (data: T[] | PaginatedWorkItems) => React.ReactNode;
  noResults: NoResultsFoundProps;
  wrapper?: (content: React.ReactNode) => React.ReactNode;
}

const ConditionalRenderer = <T,>({ data, noResults: { title, description, Icon }, renderData, wrapper }: ConditionalRendererProps<T>) => {
  console.log("🔍 ConditionalRenderer received data:", data);

  const isArrayEmpty = !data || (Array.isArray(data) ? data.length === 0 : "pages" in data ? data.pages.every(page => page.length === 0) : false);

  console.log("📊 Is array empty:", isArrayEmpty);

  const noResultsContent = <NoResultsFound title={title} description={description} Icon={Icon} />;

  const wrapperContent = wrapper ? wrapper(noResultsContent) : noResultsContent;

  return isArrayEmpty ? wrapperContent : renderData(data!);
};

export default ConditionalRenderer;

import { useFormContext, Controller } from "react-hook-form";
import { useFetchDataQuery } from "@/hooks/useQueryHook";
import { Artisan } from "@/types/artisan-types/artisanTypes";
import { TableFormSelectType } from "@/types/table-types/tableTypes";
import * as Popover from "@radix-ui/react-popover";
import { Checkbox } from "primereact/checkbox";
import { useEffect } from "react";
import "primereact/resources/themes/saga-blue/theme.css"; // или друг стил
import "primereact/resources/primereact.min.css";

const ArtisanSelector = ({ label, name, placeholder }: TableFormSelectType) => {
  const { control } = useFormContext();

  const { data: artisansArray, refetch } = useFetchDataQuery<any>({
    URL: "/artisans",
    queryKey: ["artisans"],
    options: { staleTime: Infinity },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const artisans: Artisan[] = artisansArray?.artisans?.filter((a: any) => a.status === "active") || [];

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={[]}
      render={({ field }) => (
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">{label}</label>
          <Popover.Root>
            <Popover.Trigger asChild>
              <button
                className="w-full border border-gray-300 rounded px-3 py-2 text-left text-sm bg-white"
                type="button"
              >
                {field.value.length > 0
                  ? field.value.join(", ")
                  : placeholder || "Select artisans"}
              </button>
            </Popover.Trigger>
            <Popover.Content
              sideOffset={8}
              className="bg-white border border-gray-200 shadow-lg rounded p-3 w-[250px] z-50"
            >
              <div className="flex flex-col gap-2 max-h-[200px] overflow-auto">
                {artisans.map((artisan) => {
                  console.log(field.value);
                  
                  const isChecked = field.value.includes(artisan.name);
                  return (
                    <div key={artisan.id} className="flex items-center gap-2">
                      <Checkbox
                        inputId={`artisan-${artisan.id}`}
                        onChange={(e) => {
                          const checked = e.checked;
                          if (checked) {
                            field.onChange([...field.value, artisan.name]);
                          } else {
                            field.onChange(field.value.filter((val: any) => val !== artisan.name));
                          }
                        }}
                        checked={isChecked}
                      />
                      <label htmlFor={`artisan-${artisan.id}`} className="text-sm cursor-pointer">
                        {artisan.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            </Popover.Content>
          </Popover.Root>
        </div>
      )}
    />
  );
};

export default ArtisanSelector;

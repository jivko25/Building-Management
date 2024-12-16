import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableFormSelectType } from "@/types/table-types/tableTypes";
import { User } from "@/types/user-types/userTypes";
import { useFormContext } from "react-hook-form";
import { useFetchDataQuery } from "@/hooks/useQueryHook";

const UsersSelector = ({
  label,
  name,
  placeholder,
  defaultVal,
}: TableFormSelectType) => {
  const { control } = useFormContext();

  const { data: usersResponse } = useFetchDataQuery<{
    users: User[];
    usersCount: number;
    page: number;
    limit: number;
    totalPages: number;
  }>({
    URL: "/users",
    queryKey: ["users-select"],
    options: {
      staleTime: Infinity,
    },
  });

  console.log("👥 Users response:", usersResponse);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={defaultVal}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                {usersResponse?.users
                  ?.filter((user) => user.status === "active")
                  .map((user) => (
                    <SelectItem key={user.id} value={user.full_name}>
                      {user.full_name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

export default UsersSelector;

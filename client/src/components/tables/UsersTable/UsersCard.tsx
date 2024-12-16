//client\src\components\tables\UsersTable\UsersCard.tsx
import EditUser from "@/components/Forms/User/UserFormEdit/EditUser";
import { TableCell, TableRow } from "@/components/ui/table";
import { User } from "@/types/user-types/userTypes";

type UsersCardProps = {
  users: User[];
};

const UsersCard = ({ users }: UsersCardProps) => {
  return (
    <>
      {users.map(user => (
        <TableRow key={user.id}>
          <TableCell className="font-semibold">{user.full_name}</TableCell>
          <TableCell className="text-center font-semibold">{user.username}</TableCell>
          <TableCell className="text-end font-semibold w-[200px]">
            <EditUser userId={user.id!} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default UsersCard;

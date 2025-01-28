//client\src\pages\UserProjectTaskPage.tsx
import UserProjectTaskTableBody from "@/components/tables/UserProjectTaskTable/UserProjectTaskTableBody";
import Sidebar from "../components/Sidebar/Sidebar";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useUserWorkitem } from "@/context/UserWorkitemContext";

const UserProjectTaskPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { dispatch } = useUserWorkitem();
  useEffect(() => {
    dispatch({ type: "SET_TASK_ID", payload: taskId });
  }, [taskId]);
  return (
    <div className="flex md:gap-60 min-h-screen">
      <Sidebar />

      <div className="flex flex-col w-full overflow-x-auto md:gap-8">
        <UserProjectTaskTableBody />
      </div>
    </div>
  );
};

export default UserProjectTaskPage;

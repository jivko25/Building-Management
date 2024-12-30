//client\src\AppRoutes.tsx
import { Navigate, Route, Routes } from "react-router-dom";
import UserLoginForm from "./components/Forms/User/UserFormLogin/UserLoginForm";
import TableLayout from "./layouts/Table/TableLayout";
import UsersTablePage from "./pages/UsersTablePage";
import Homepage from "./pages/Homepage";
import ActivitiesTablePage from "./pages/ActivitiesTablePage";
import MeasuresTablePage from "./pages/MeasuresTablePage";
import ProjectsTablePage from "./pages/ProjectsTablePage";
import CompaniesTablePage from "./pages/CompaniesTablePage";
import ArtisansTablePage from "./pages/ArtisansTablePage";
import ProjectTasksPage from "./pages/ProjectTasksPage";
import UserGuard from "./guards/UserGuard";
import ManagerGuard from "./guards/ManagerGuard";
import UserProjectsPage from "./pages/UserProjectsPage";
import UserProjectTaskPage from "./pages/UserProjectTaskPage";
import WorkItemsPage from "./pages/WorkItemsPage";
import UserRegisterForm from "./components/Forms/User/userFormRegister/UserRegisterForm";
import UserForgotPasswordForm from "./components/Forms/User/UserForgotPasswordForm/UserForgotPasswordForm";
import UserResetPasswordForm from "./components/Forms/User/UserResetPasswordForm/UserResetPasswordForm";
import ManagerTablePage from "./pages/ManagersTablePage";
import { InvoicesPage } from "./pages/Invoices/InvoicesPage";
import { CreateInvoicePage } from "./pages/Invoices/CreateInvoicePage";
import { InvoiceDetailsPage } from "./pages/Invoices/InvoiceDetailsPage";
import { UpdateInvoicePage } from "./pages/Invoices/UpdateInvoicePage";
import ClientsTablePage from "./pages/ClientsTablePage";
import AdminGuard from "./guards/AdminGuard";

const AppRoutes = () => {
  return (
    <Routes>
      {/*Manager/admin only routes */}
      <Route element={<ManagerGuard />}>
        <Route
          path="/users"
          element={
            <TableLayout>
              <UsersTablePage />
            </TableLayout>
          }
        />
      </Route>
      <Route element={<ManagerGuard />}>
        <Route
          path="/artisans"
          element={
            <TableLayout>
              <ArtisansTablePage />
            </TableLayout>
          }
        />
      </Route>
      <Route element={<ManagerGuard />}>
        <Route
          path="/companies"
          element={
            <TableLayout>
              <CompaniesTablePage />
            </TableLayout>
          }
        />
      </Route>
      <Route element={<ManagerGuard />}>
        <Route
          path="/activities"
          element={
            <TableLayout>
              <ActivitiesTablePage />
            </TableLayout>
          }
        />
      </Route>
      <Route element={<ManagerGuard />}>
        <Route
          path="/managers"
          element={
            <TableLayout>
              <ManagerTablePage />
            </TableLayout>
          }
        />
      </Route>
      <Route element={<ManagerGuard />}>
        <Route
          path="/measures"
          element={
            <TableLayout>
              <MeasuresTablePage />
            </TableLayout>
          }
        />
      </Route>
      <Route element={<ManagerGuard />}>
        <Route
          path="/projects"
          element={
            <TableLayout>
              <ProjectsTablePage />
            </TableLayout>
          }
        />
      </Route>
      <Route element={<ManagerGuard />}>
        <Route
          path="/projects/:id/tasks"
          element={
            <TableLayout>
              <ProjectTasksPage />
            </TableLayout>
          }
        />
      </Route>
      <Route element={<ManagerGuard />}>
        <Route
          path="/projects/:id/tasks/:taskId/work-items"
          element={
            <TableLayout>
              <WorkItemsPage />
            </TableLayout>
          }
        />
      </Route>
      <Route element={<ManagerGuard />}>
        <Route
          path="/invoices"
          element={
            <TableLayout>
              <InvoicesPage />
            </TableLayout>
          }
        />
      </Route>
      <Route element={<ManagerGuard />}>
        <Route
          path="/invoices/create"
          element={
            <TableLayout>
              <CreateInvoicePage />
            </TableLayout>
          }
        />
      </Route>
      <Route element={<ManagerGuard />}>
        <Route
          path="/invoices/:id"
          element={
            <TableLayout>
              <InvoiceDetailsPage />
            </TableLayout>
          }
        />
      </Route>
      <Route element={<ManagerGuard />}>
        <Route
          path="/invoices/:id/edit"
          element={
            <TableLayout>
              <UpdateInvoicePage />
            </TableLayout>
          }
        />
      </Route>
      <Route element={<ManagerGuard />}>
        <Route
          path="/clients"
          element={
            <TableLayout>
              <ClientsTablePage />
            </TableLayout>
          }
        />
      </Route>
      {/*Manager/admin only routes */}

      {/* User only routes */}
      <Route element={<UserGuard />}>
        <Route
          path="/my-projects"
          element={
            <TableLayout>
              <UserProjectsPage />
            </TableLayout>
          }
        />
      </Route>
      <Route element={<UserGuard />}>
        <Route
          path="/my-projects/:taskId/task"
          element={
            <TableLayout>
              <UserProjectTaskPage />
            </TableLayout>
          }
        />
      </Route>
      {/* User only routes */}

      {/* Public routes */}
      <Route path="/login" element={<UserLoginForm />} />
      <Route path="/register" element={<UserRegisterForm />} />
      <Route path="/forgot-password" element={<UserForgotPasswordForm />} />
      <Route path="/reset-password/:token" element={<UserResetPasswordForm />} />
      <Route
        path="/"
        element={
          <TableLayout>
            <Homepage />
          </TableLayout>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
      {/* Public routes */}

      {/* Admin only routes */}
      <Route element={<AdminGuard />}>
        <Route
          path="/managers"
          element={
            <TableLayout>
              <ManagerTablePage />
            </TableLayout>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

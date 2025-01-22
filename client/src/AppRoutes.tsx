//client\src\AppRoutes.tsx
import { Route, Routes } from "react-router-dom";
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
import ClientsTablePage from "./pages/ClientsTablePage";
import AdminGuard from "./guards/AdminGuard";
import { InvoicesClientPage } from "./pages/Invoices/Client/InvoicesClientPage";
import { CreateClientInvoicePage } from "./pages/Invoices/Client/CreateClientInvoicePage";
import { InvoiceClientDetailsPage } from "./pages/Invoices/Client/InvoiceClientDetailsPage";
import { UpdateClientInvoicePage } from "./pages/Invoices/Client/UpdateClientInvoicePage";
import { LanguageSettings } from "./pages/Settings/LanguageSettings";
import { InvoicesArtisanPage } from "./pages/Invoices/Artisan/InvoicesArtisanPage";
import { CreateArtisanInvoicePage } from "./pages/Invoices/Artisan/CreateArtisanInvoicePage";
import { InvoiceArtisanDetailsPage } from "./pages/Invoices/Artisan/InvoiceArtisanDetailsPage";
import { UpdateArtisanInvoicePage } from "./pages/Invoices/Artisan/UpdateArtisanInvoicePage";
import { useTranslation } from "react-i18next";
import ArtisansDetailsPage from "./pages/ArtisansDetailsPage";
import ManagerDefaultPricesPage from "./pages/ManagerDefaultPricesPage";


const AppRoutes = () => {

const { t } = useTranslation();
console.log("Current translations:", t("settings"));
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<UserLoginForm />} />
      <Route path="/register" element={<UserRegisterForm />} />
      <Route path="/forgot-password" element={<UserForgotPasswordForm />} />
      <Route path="/reset-password/:token" element={<UserResetPasswordForm />} />

      {/* Protected routes */}
      <Route element={<UserGuard />}>
        <Route
          path="/"
          element={
            <TableLayout>
              <Homepage />
            </TableLayout>
          }
        />
      </Route>

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
          path="/default-prices"
          element={
            <TableLayout>
              <ManagerDefaultPricesPage />
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
          path="/artisans/:id"
          element={
            <TableLayout>
              <ArtisansDetailsPage />
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

      {/* Protected routes */}
      <Route element={<UserGuard />}>
        <Route
          path="/settings"
          element={
            <TableLayout>
              <LanguageSettings />
            </TableLayout>
          }
        />
      </Route>

      {/* Client Invoice routes */}
      <Route element={<ManagerGuard />}>
        <Route
          path="/invoices-client"
          element={
            <TableLayout>
              <InvoicesClientPage />
            </TableLayout>
          }
        />
        <Route
          path="/invoices-client/create"
          element={
            <TableLayout>
              <CreateClientInvoicePage />
            </TableLayout>
          }
        />
        <Route
          path="/invoices-client/:id"
          element={
            <TableLayout>
              <InvoiceClientDetailsPage />
            </TableLayout>
          }
        />
        <Route
          path="/invoices-client/:id/edit"
          element={
            <TableLayout>
              <UpdateClientInvoicePage />
            </TableLayout>
          }
        />
      </Route>

      {/* Artisan Invoice routes */}
      <Route element={<ManagerGuard />}>
        <Route
          path="/invoices-artisan"
          element={
            <TableLayout>
              <InvoicesArtisanPage />
            </TableLayout>
          }
        />
        <Route
          path="/invoices-artisan/create"
          element={
            <TableLayout>
              <CreateArtisanInvoicePage />
            </TableLayout>
          }
        />
        <Route
          path="/invoices-artisan/:id"
          element={
            <TableLayout>
              <InvoiceArtisanDetailsPage />
            </TableLayout>
          }
        />
        <Route
          path="/invoices-artisan/:id/edit"
          element={
            <TableLayout>
              <UpdateArtisanInvoicePage />
            </TableLayout>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

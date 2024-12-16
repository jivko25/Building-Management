//client\src\AppRoutes.tsx
import { Navigate, Route, Routes } from 'react-router-dom';
import UserLoginForm from './components/Forms/User/UserFormLogin/UserLoginForm';
import TableLayout from './layouts/Table/TableLayout';
import UsersTablePage from './pages/UsersTablePage';
import Homepage from './pages/Homepage';
import ActivitiesTablePage from './pages/ActivitiesTablePage';
import MeasuresTablePage from './pages/MeasuresTablePage';
import ProjectsTablePage from './pages/ProjectsTablePage';
import CompaniesTablePage from './pages/CompaniesTablePage';
import ArtisansTablePage from './pages/ArtisansTablePage';
import ProjectTasksPage from './pages/ProjectTasksPage';
import UserGuard from './guards/UserGuard';
import ManagerGuard from './guards/ManagerGuard';
import UserProjectsPage from './pages/UserProjectsPage';
import UserProjectTaskPage from './pages/UserProjectTaskPage';
import WorkItemsPage from './pages/WorkItemsPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/*Manager/admin only routes */}
            <Route element={<ManagerGuard />}>
                <Route
                    path='/users'
                    element={
                        <TableLayout>
                            <UsersTablePage />
                        </TableLayout>
                    }
                />
            </Route>
            <Route element={<ManagerGuard />}>
                <Route
                    path='/artisans'
                    element={
                        <TableLayout>
                            <ArtisansTablePage />
                        </TableLayout>
                    }
                />
            </Route>
            <Route element={<ManagerGuard />}>
                <Route
                    path='/companies'
                    element={
                        <TableLayout>
                            <CompaniesTablePage />
                        </TableLayout>
                    }
                />
            </Route>
            <Route element={<ManagerGuard />}>
                <Route
                    path='/activities'
                    element={
                        <TableLayout>
                            <ActivitiesTablePage />
                        </TableLayout>
                    }
                />
            </Route>
            <Route element={<ManagerGuard />}>
                <Route
                    path='/measures'
                    element={
                        <TableLayout>
                            <MeasuresTablePage />
                        </TableLayout>
                    }
                />
            </Route>
            <Route element={<ManagerGuard />}>
                <Route
                    path='/projects'
                    element={
                        <TableLayout>
                            <ProjectsTablePage />
                        </TableLayout>
                    }
                />
            </Route>
            <Route element={<ManagerGuard />}>
                <Route
                    path='/projects/:id/tasks'
                    element={
                        <TableLayout>
                            <ProjectTasksPage />
                        </TableLayout>
                    }
                />
            </Route>
            <Route element={<ManagerGuard />}>
                <Route
                    path='/projects/:id/tasks/:taskId/work-items'
                    element={
                        <TableLayout>
                            <WorkItemsPage />
                        </TableLayout>
                    }
                />
            </Route>
            {/*Manager/admin only routes */}

            {/* User only routes */}
            <Route element={<UserGuard />}>
                <Route
                    path='/my-projects'
                    element={
                        <TableLayout>
                            <UserProjectsPage />
                        </TableLayout>
                    }
                />
            </Route>
            <Route element={<UserGuard />}>
                <Route
                    path='/my-projects/:taskId/task'
                    element={
                        <TableLayout>
                            <UserProjectTaskPage />
                        </TableLayout>
                    }
                />
            </Route>
            {/* User only routes */}

            {/* Public routes */}
            <Route path='/login' element={<UserLoginForm />} />
            <Route
                path='/'
                element={
                    <TableLayout>
                        <Homepage />
                    </TableLayout>
                }
            />
            <Route path='*' element={<Navigate to='/' />} />
            {/* Public routes */}
        </Routes>
    );
};

export default AppRoutes;

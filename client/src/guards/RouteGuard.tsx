import { useAuth } from '@/context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const RouteGuard = () => {
    const { user } = useAuth();

    if (user && user?.role === 'manager') {
        return <Outlet />
    }

    if (user && user?.role === 'user') {
        return <Outlet />
    }

    if (!user || user === null) {
        return <Navigate to='/login' replace={true} />
    }
}

export default RouteGuard
import { Navigate, Outlet } from 'react-router-dom'
import { Sidebar } from '../admin/sidebar'
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useEffect } from 'preact/hooks';
import { LoadingSpinner } from '../LoadingSpinner';

export const AdminDashboardLayout = () => {
    const { checkAuth, admin, loading } = useAdminAuth();

    useEffect(() => {
        checkAuth()
    }, [])


    if (loading) {
        return <LoadingSpinner />
    }


    return (

        <>
            {
                admin ?
                    <div>
                        <div className="flex" >
                            <Sidebar />
                            <div className="bg-[#F5F5F5] pl-16 md:pl-56 min-h-screen w-screen">
                                {/* <Header /> */}
                                <div className="pt-10">
                                    <Outlet />
                                </div>
                            </div>
                        </div >
                    </div > : <Navigate to="/" />
            }
        </>

    )
}

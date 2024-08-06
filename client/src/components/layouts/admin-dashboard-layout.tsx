import { Outlet } from 'react-router-dom'
import { Sidebar } from '../admin/sidebar'
import { Header } from '../admin/header'

export const AdminDashboardLayout = () => {
    return (
        <div>
            <div className="flex">
                <Sidebar />
                <div className="bg-[#F5F5F5] pl-16 md:pl-56 h-screen w-screen">
                    <Header />
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

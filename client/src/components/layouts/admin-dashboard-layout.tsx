import { Outlet } from 'react-router-dom'
import { Sidebar } from '../admin/sidebar'

export const AdminDashboardLayout = () => {
    return (
        <div>
            <div className="flex">
                <Sidebar />
                <div className="bg-[#F5F5F5] pl-16 md:pl-56 min-h-screen w-screen">
                    {/* <Header /> */}
                    <div className="pt-10">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}

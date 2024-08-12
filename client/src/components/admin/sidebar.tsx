import { logOutSession } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { IconType } from "react-icons";
import { FaSuitcase } from "react-icons/fa";
import { LuBox } from "react-icons/lu";
import { TbUsers } from "react-icons/tb";
import { Link, useLocation } from 'react-router-dom';
import { Button } from "../ui/button";

interface SidebarLink {
    id: number;
    path: string;
    name: string;
    icon: IconType;
}


const SIDEBAR_LINKS: SidebarLink[] = [
    { id: 0, path: "/dashboard", name: "Dashboard", icon: LuBox },
    { id: 1, path: "/positions", name: "Job Postions", icon: FaSuitcase },
    { id: 2, path: "/applicants", name: "Applicants", icon: TbUsers }
]

export const Sidebar = () => {

    const handleLogout = () => {
        logOutSession()
        window.location.href = '/';
    }

    const { pathname } = useLocation()

    return (
        <div className="w-16 md:w-56 fixed left-0 top-0 z-10 h-screen boder-r pt-8 px-4 bg-white">
            <div className="mb-8 flex items-center justify-center">
                <img src="/cp_logo.svg" alt="logo" className="" />
                <p className="text-sm font-semibold">Cloudprism Solutions</p>
            </div>

            <ul className="mt-6 space-y-6">
                {SIDEBAR_LINKS.map((link, index) => (
                    <li
                        key={index}
                        className={`font-medium rounded-md py-2 px-5 hover:bg-gray-100 hover:text-indigo-500 ${pathname === link.path ? "bg-indigo-100 text-indigo-500" : ""
                            }`}
                    >
                        <Link
                            to={link.path}
                            className="flex justify-center md:justify-start items-center md:space-x-5"
                        >
                            <link.icon />
                            <span className="text-sm text-gray-500 hidden md:flex">
                                {link.name}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="w-full absolute bottom-5 left-0 px-4 py-2 cursor-pointer text-center">
                <Button style={{ width: '100%' }} className="flex items-center px-4 rounded-3xl" variant="outline" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span className="ml-2">Logout</span>
                </Button>
            </div>
        </div>
    )
}

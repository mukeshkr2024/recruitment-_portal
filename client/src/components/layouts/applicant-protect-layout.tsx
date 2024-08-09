import { useApplicantAuth } from "@/hooks/useApplicantAuth"
import { useEffect } from "preact/hooks";
import { Outlet } from "react-router-dom"

export const ApplicantProtectLayout = () => {
    const { checkAuth, applicant } = useApplicantAuth();

    console.log(applicant);

    useEffect(() => {
        checkAuth()
    }, [])
    return (
        <>
            <Outlet />
        </>
    )
}

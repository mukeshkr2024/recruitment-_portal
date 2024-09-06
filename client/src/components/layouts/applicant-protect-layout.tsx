import { useApplicantAuth } from "@/hooks/useApplicantAuth"
import { useEffect } from "preact/hooks";
import { Navigate, Outlet } from "react-router-dom"

export const ApplicantProtectLayout = () => {
    const { checkAuth, applicant, loading } = useApplicantAuth();

    useEffect(() => {
        checkAuth()
    }, [])


    if (loading) {
        return null
    }


    return (
        <>
            {applicant ? <Outlet /> : <Navigate to="/applicant-login" />}
        </>
    )
}

import { useApplicantAuth } from "@/hooks/useApplicantAuth"
import { useEffect } from "preact/hooks";
import { Navigate, Outlet } from "react-router-dom"

export const ApplicantProtectLayout = () => {
    const { checkAuth, applicant, loading } = useApplicantAuth();

    console.log(applicant);

    useEffect(() => {
        checkAuth()
    }, [])


    if (loading) {
        return <div>Loading...</div>
    }


    return (
        <>
            {applicant ? <Outlet /> : <Navigate to="/applicant-login" />}
        </>
    )
}

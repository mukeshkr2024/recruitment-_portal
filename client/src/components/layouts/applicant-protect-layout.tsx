import { useApplicantAuth } from "@/hooks/useApplicantAuth"
import { useEffect } from "preact/hooks";
import { Navigate, Outlet } from "react-router-dom"
import { LoadingSpinner } from "../LoadingSpinner";

export const ApplicantProtectLayout = () => {
    const { checkAuth, applicant, loading } = useApplicantAuth();

    console.log(applicant);

    const token = localStorage.getItem('access_token');
    console.log("token" + token);

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

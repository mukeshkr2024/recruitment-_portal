import axios from "axios"
import { useQuery } from "react-query"

export const useGetApplicants = () => {
    return useQuery({
        queryKey: ["applicants"],
        queryFn: async () => {
            const { data } = await axios.get('http://localhost:8080/api/v1/applicants')
            return data
        }

    })
}
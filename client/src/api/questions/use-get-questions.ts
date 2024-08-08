import axios from "axios";
import { useQuery } from "react-query";

export const useGetQuestions = (positionId: string) => {
    return useQuery({
        queryKey: ["questions", positionId],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`http://localhost:8080/api/v1/questions/${positionId}`);
                return data;
            } catch (error) {
                console.error("Error fetching questions:", error);
                throw new Error("Failed to fetch questions");
            }
        },
    });
};

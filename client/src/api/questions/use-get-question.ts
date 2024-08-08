import axios from "axios";
import { useQuery } from "react-query";

export const useGetQuestion = (questionId: string) => {
    return useQuery({
        queryKey: ["question", questionId],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`http://localhost:8080/api/v1/question/${questionId}`);
                return data;
            } catch (error) {
                console.error("Error fetching question:", error);
                throw new Error("Failed to fetch question");
            }
        },
    });
};

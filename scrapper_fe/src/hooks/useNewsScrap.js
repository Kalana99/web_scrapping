import { useCallback } from "react";
import api from "../services/api";

const useNewsScrap = () => {

    const newsScrap = useCallback(async (formData) => {

        try {
            const response = await api.post(`/scanner/single-news-scan/`, formData);
            return response.data;
        } 
        catch (error) {
            console.log(error.message);
            // toast.error("An error occurred while deleting the file.");
        }
    }, []);

    return { newsScrap };
}

export default useNewsScrap;
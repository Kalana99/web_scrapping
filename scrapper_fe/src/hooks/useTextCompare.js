import { useCallback } from "react";
import api from "../services/api";

const useTextCompare = () => {

    const textCompare = useCallback(async (formData) => {

        try {
            const response = await api.post(`/scanner/text-compare/`, formData);
            return response.data;
        } 
        catch (error) {
            console.log(error.message);
            // toast.error("An error occurred while deleting the file.");
        }
    }, []);

    return { textCompare };
}

export default useTextCompare;
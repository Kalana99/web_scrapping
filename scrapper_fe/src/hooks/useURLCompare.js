import { useCallback } from "react";
import api from "../services/api";

const useURLCompare = () => {

    const urlCompare = useCallback(async (formData) => {

        try {
            const response = await api.post(`/scanner/web-compare/`, formData);
            return response.data;
        } 
        catch (error) {
            console.log(error.message);
            // toast.error("An error occurred while deleting the file.");
        }
    }, []);

    return { urlCompare };
}

export default useURLCompare;
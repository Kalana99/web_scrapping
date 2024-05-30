import { useCallback } from "react";
import api from "../services/api";

const useWebCompare = () => {

    const webCompare = useCallback(async (formData) => {

        try {
            const response = await api.post(`/scanner/single-website-scan/`, formData);
            return response.data;
        } 
        catch (error) {
            console.log(error.message);
            // toast.error("An error occurred while deleting the file.");
        }
    }, []);

    return { webCompare };
}

export default useWebCompare;
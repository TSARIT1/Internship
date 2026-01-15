import { useState, useEffect } from 'react';
import { getPricing } from '../services/studentApi';

const useCoursePricing = (courseName) => {
    const [pricing, setPricing] = useState({ 
        totalFee: 0, 
        discount: 0, 
        finalFee: 0, 
        loading: true 
    });

    useEffect(() => {
        const loadPricing = async () => {
            try {
                const response = await getPricing();
                const courseData = response.data.find(item => item.course === courseName);
                
                if (courseData) {
                    setPricing({
                        totalFee: courseData.totalFee,
                        discount: courseData.discount,
                        finalFee: courseData.totalFee - courseData.discount,
                        loading: false
                    });
                } else {
                    // Fallback to defaults or keep loading false with 0s
                    setPricing(prev => ({ ...prev, loading: false }));
                }
            } catch (error) {
                console.error("Failed to load pricing", error);
                setPricing(prev => ({ ...prev, loading: false }));
            }
        };

        if (courseName) {
            loadPricing();
        }
    }, [courseName]);

    return pricing;
};

export default useCoursePricing;

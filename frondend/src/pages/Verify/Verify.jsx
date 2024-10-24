import React, { useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios'; // Make sure to import axios
import './Verify.css'


const Verify = () => {
    const [searchParams] = useSearchParams(); // No need to setsearchParams here
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const { url } = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async () => {
        try {
            const response = await axios.post(`${url}/api/order/verify`, { success, orderId });
            if (response.data.success) {
                navigate("/myorders");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Error verifying payment:", error);
            navigate("/"); // Navigate to home on error as well
        }
    };

    useEffect(() => {
        verifyPayment(); // Call verifyPayment when the component mounts
    }, [success, orderId]); // Adding success and orderId as dependencies to avoid stale values

    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    );
};

export default Verify;  // Make sure to export it as default

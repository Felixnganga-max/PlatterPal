import { createContext, useEffect, useState } from "react";
import axios from 'axios'


export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  
    const [cartItems, setCartItems] = useState({});
    const url = "https://platterpal-backend.onrender.com"
    const [token, setToken] = useState("")
    const [food_list, setFoodList] = useState([])


    const addToCart = async (itemId) => {
        // Check if the user is adding the item for the first time in the cart
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url+"/api/cart/add", {itemId}, {headers:{token}})
        }
    };

    const removeFromCart = async (itemId) => {
        // Ensure we don't go below zero
        setCartItems((prev) => {
            const newCount = prev[itemId] - 1;
            if (newCount <= 0) {
                const { [itemId]: _, ...rest } = prev; // Remove item from cart
                return rest;
            }
            return { ...prev, [itemId]: newCount };
        });
        if (token) {
            await axios.post(url+"/api/cart/remove", {itemId},{headers:{token}})
        }
    };

    const getTotals = () => {
        let totalAmount = 0;

        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                // Correctly find the item in food_list based on itemId
                let itemInfo = food_list.find(item => item._id === itemId);
                // Check if itemInfo exists before accessing its price
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[itemId];
                }
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async (params) => {
        const response = await axios.get(url+"/api/food/list")
        setFoodList(response.data.data)
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url+"/api/cart/get",{}, {headers:{token}})
        setCartItems(response.data.cartData)
    }

    useEffect(() =>{
       
        async function loadData() {
        await fetchFoodList();
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"))
            await loadCartData(localStorage.getItem("token"))
        }
        }
        loadData();
    }, [])


    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotals, 
        url, 
        token, 
        setToken
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
}

export default StoreContextProvider;

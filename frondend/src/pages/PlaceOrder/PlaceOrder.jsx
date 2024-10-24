import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from 'axios'

const PlaceOrder = () => {
const {getTotals, token, food_list, url, cartItems} = useContext(StoreContext)
const [data, setData] = useState({
  firstName: "",
  lastName: "", 
  email:"", 
  phoneNumber:"",
  town:"",
  street:""
})

const onChangeHandler = (event) =>{
  const name = event.target.name;
  const value = event.target.value;

  setData(data =>({...data, [name]:value}))
}

const placeOrder = async (event) => {
  event.preventDefault();
  let orderItems = [];
  food_list.map((item) =>{
    if (cartItems[item._id]>0) {
      let itemInfo = item;
      itemInfo["quantity"] = cartItems[item._id]
      orderItems.push(itemInfo)
      
    }
  })
  let orderData = {
    address:data,
    items:orderItems,
    amount:getTotals()+2
  }
  let response = await axios.post(url+"/api/order/place", orderData, {headers:{token}})
  if (response.data.success) {
    const {session_url} = response.data;
    window.location.replace(session_url);
  }else{
    alert("Error")
  }
}
  // const navigate = useNavigate();

  // useEffect(() =>{
  // if (!token) {
  //   navigate('/cart')
  // }else if(getTotals()===0)
  // {
  //   navigate('/cart')
  // }
  // })
  return (
    <form onSubmit={placeOrder} className="place-order">
      {/* This will handle billing information  */}
      <div className="place-order-left">
        <p>Delivery Information</p>
        <div className="multi-fields">
          <input required name="firstName" value={data.firstName} onChange={onChangeHandler} type="text" placeholder="First name" />
          <input required name="lastName" value={data.lastName} onChange={onChangeHandler} type="text" placeholder="Last name" />
        </div>
        <div className="multi-fields">
        <input required name="town" value={data.town} onChange={onChangeHandler} type="text" placeholder="Town" />
        <input required name="street" value={data.street} onChange={onChangeHandler} type="text" placeholder="Street" />
        </div>
        <div className="multi-fields">
        <input required name="email" value={data.email} onChange={onChangeHandler} type="email" placeholder="Email address" />
        <input required name="phoneNumber" value={data.phoneNumber} onChange={onChangeHandler} type="number" placeholder="Phone Number" />
        </div>
      </div>

    

      {/* This will hanlde payment  */}
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>KSh{getTotals()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{getTotals()===0?"0":100}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <b>KSh{getTotals()===0?"0":getTotals() + 100}</b> {/* Total including delivery fee */}
            </div>
          </div>
          <button type="submit">
            PROCEED TO PAYMENT
          </button>
          {/* In home, in place order, I defined /order--- that's why */}
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;

import React, { useState, useEffect } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data);
        console.log(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url+"/api/order/status", {
      orderId,
      status:event.target.value
    })
    if (response.data.success) {
      await fetchAllOrders();
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            {/* Column 1: Order Icon */}
            <div className="order-item-icon">
              <img src={assets.parcel_icon} alt="Order Icon" />
            </div>

            {/* Column 2: Order Details */}
            <div className="order-item-details">
              <p className="order-item-food">
                {order.items.map((item, idx) => (
                  <span key={idx}>
                    {item.name} X {item.quantity}
                    {idx !== order.items.length - 1 ? "," : ""}
                  </span>
                ))}
              </p>
              <p className="order-item-name">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p className="order-item-address">
                {order.address.city} {order.address.street}
              </p>
              <p className="order-item-phone">{order.address.phoneNumber}</p>
              <p className="order-item-email">{order.address.email}</p>
            </div>

            {/* Column 3: Total Items */}
            <div className="order-item-count">
              <p>Items: {order.items.length}</p>
            </div>

            {/* Column 4: Total Amount */}
            <div className="order-item-amount">
              <p>KSh: {order.amount}</p>
            </div>

            {/* Column 5: Status Dropdown */}
            <div className="order-item-status">
              <select onChange={(event) => statusHandler(event, order._id)} value={order.status} >
                <option value="Food Processing">Food Processing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

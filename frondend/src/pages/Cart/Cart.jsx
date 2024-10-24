import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, url, getTotals, food_list, addToCart, removeFromCart } =
    useContext(StoreContext);

    const navigate = useNavigate();

  return (
    <div className="cart">
      {/* Card Calculations */}

      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id} className="cart-items-title cart-items-item">
                <img src={url+"/images/"+item.image} alt={item.name} />
                <p>{item.name}</p>
                <p>KSh{item.price}</p>
                <p>{cartItems[item._id]}</p>
                <p>KSh{item.price * cartItems[item._id]}</p>
                <p onClick={() => removeFromCart(item._id)} className="cross">
                  X
                </p>
                <hr />
              </div>
            );
          }
          return null; // Ensure we return null if the condition isn't met
        })}
      </div>

      {/* Card bottom */}
      <div className="cart-bottom">
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
              <p>KSh{getTotals()===0?"0":100}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <b>KSh{getTotals()===0?"0":getTotals() + 100}</b> {/* Total including delivery fee */}
            </div>
          </div>
          <button onClick={() =>navigate('/order')}>PROCEED TO CHECKOUT</button>
        {/* In home, in place order, I defined /order--- that's why */}
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className="promo">
              <input type="text" placeholder="Promocode" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

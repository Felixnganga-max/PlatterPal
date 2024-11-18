import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";  // Corrected import for userModel

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing order for the frontend
const placeOrder = async (req, res) => {

    const frontend_url = "https://platterpal-qliz.onrender.com/";  // Corrected 'frondend' to 'frontend'
    
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            status: "Food Proccessing" // Adding a default status (if you want it)
        });

        await newOrder.save();

        // Clear the user's cart data
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Prepare Stripe line items
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "kes",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 // Stripe requires amounts in cents
            },
            quantity: item.quantity
        }));

        // Add delivery charges
        line_items.push({
            price_data: {
                currency: "kes",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 100 * 100  // Example delivery charge (2 KES)
            },
            quantity: 1
        });

        // Create a Stripe session
        const session = await stripe.checkout.sessions.create({
            // payment_method_types: ['card'],
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error" });
    }
};


const verifyOrder = async (req, res) => {
    const {orderId, success} = req.body;
    try {
        if (success=="true"){
            await orderModel.findByIdAndUpdate(orderId, {payment:true})
            res.json({success:true, message:"Paid"})
        }else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false, message:"Not Paid"})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
    }
}

// user orders for frondend

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId})
        res.json({success:true, data:orders})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
    }
}

//Listing Orders for Admin Panel

const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({success:true, data:orders})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
    }
}

//API for updating order status

const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {status:req.body.status})
        res.json({success:true, message:"Status Updated"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
    }
}

export { placeOrder, updateStatus, listOrders, verifyOrder, userOrders };

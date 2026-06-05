// import Razorpay from "razorpay";
// import crypto from "crypto";
// import Payment from "../models/payment.model.js";
// import User from "../models/user.model.js";
// import { response } from "express";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // Create Razorpay Order
// export const createOrder = async (req, res) => {
//   try {
//     const { amount, credits, planId } = req.body;

//     if(!amount || !credits ){
//       return res.status(400).json({
        
//         message: "invalid plan data",
//       });
//     }

//     const options = {
//       amount: amount * 100, // convert to paise 1rupee=100
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     };

//     const order = await razorpay.orders.create(options);

//     const payment = await Payment.create({
//       userId: req.user._id,
//       planId,
//       amount,
//       credits,
//       razarPayOrderId: order.id,
//       status: "created",
//     });

    
//     // res.status(200).json({
//     //   success: true,
//     //   order,
//     //   paymentId: payment._id,
//     // });

//         return res.json(order);


//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
    
//       message: `failed to create razorpay order`,
//     });
//   }
// };

// // Verify Payment
// export const verifyPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//     } = req.body;

//     const body =
//       razorpay_order_id + "|" + razorpay_payment_id;

//     const expectedSignature = crypto
//       .createHmac(
//         "sha256",
//         process.env.RAZORPAY_KEY_SECRET
//       )
//       .update(body.toString())
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({
//         message: "Payment Verification Failed",
//       });
//     }

//     const payment = await Payment.findOne({
//       razarPayOrderId: razorpay_order_id,
//     });

//     if (!payment) {
//       return res.status(404).json({
//         message: "Payment Record Not Found",
//       });
//     }
//     if(payment.status === 'paid'){
//         return res.json({message:"already proceed"})
//     }

//     payment.razarPayPaymentId = razorpay_payment_id;
//     payment.status = "paid";

//     await payment.save();

//     // Add credits to user
//     await User.findByIdAndUpdate(payment.userId, {
//       $inc: {
//         credits: payment.credits,
//       },
//     } ,{new:true} );


//     res.json({
//         success:true,
//         message:"payment verified",
//         user:updatedUser,
//     })

//   } catch (error) {
//    return res.status(500).json({
    
//       message: `failed to verify razorpay payment`,
//     });
//   }
// };

// // Get Payment History
// // export const getPaymentHistory = async (req, res) => {
// //   try {
// //     const payments = await Payment.find({
// //       userId: req.user._id,
// //     }).sort({ createdAt: -1 });

// //     res.status(200).json({
// //       success: true,
// //       payments,
// //     });
// //   } catch (error) {
// //     console.log(error);

// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };
































import crypto from "crypto";
import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import razorpay from "../config/razorpay.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
    console.log("req.user =", req.userId);
  try {
    const { amount, credits, planId } = req.body;

    if (!amount || !credits) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan data",
      });
    }

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      userId: req.userId,
      planId,
      amount,
      credits,
      razarPayOrderId: order.id,
      status: "created",
    });

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
    });
  }
};

// VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

     console.log({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    
    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        razorpay_order_id + "|" + razorpay_payment_id
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const payment = await Payment.findOne({
      razarPayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    if (payment.status === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already processed",
      });
    }

    payment.razarPayPaymentId = razorpay_payment_id;
    payment.status = "paid";

    await payment.save();

    const updatedUser =
      await User.findByIdAndUpdate(
        payment.userId,
        {
          $inc: {
            credits: payment.credits,
          },
        },
        { new: true }
      );

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Verify Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
};

// PAYMENT HISTORY
// export const getPaymentHistory = async (
//   req,
//   res
// ) => {
//   try {
//     const payments = await Payment.find({
//       userId: req.user._id,
//     }).sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       payments,
//     });
//   } catch (error) {
//     console.log("History Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch payment history",
//     });
//   }
// };

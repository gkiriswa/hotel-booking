import axios from "axios";
import { getAccessToken, getPassword } from "../configs/mpesa.js";
import Booking from "../models/Booking.js";

export const stkPush = async (req, res) => {
  try {
    const { phone, bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ msg: "Booking not found" });

    const amount = booking.totalPrice;

    const token = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0,14);
    const password = getPassword(timestamp);

    const { data } = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: bookingId,
        TransactionDesc: "Hotel Booking"
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    booking.payment = {
      method: "MPESA",
      status: "PENDING",
      phone
    };
    await booking.save();

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Mpesa error" });
  }
};
export const mpesaCallback = async (req, res) => {
  const callback = req.body.Body.stkCallback;

  if (callback.ResultCode === 0) {
    const items = callback.CallbackMetadata.Item;

    const receipt = items.find(i => i.Name === "MpesaReceiptNumber").Value;
    const phone = items.find(i => i.Name === "PhoneNumber").Value;
    const amount = items.find(i => i.Name === "Amount").Value;
    const bookingId = callback.MerchantRequestID; // or AccountReference

    await Booking.findByIdAndUpdate(bookingId, {
      payment: {
        method: "MPESA",
        status: "PAID",
        receipt,
        phone,
        amount
      }
    });
  }

  res.json({ ResultCode: 0, ResultDesc: "Accepted" });
};

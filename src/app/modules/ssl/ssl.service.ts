import axios from "axios";
import config from "../../config";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import { TPayment } from "./ssl.type";

const initPayment = async (paymentData: any) => {
  try {
    const data = {
      store_id: config.ssl.storeId,
      store_passwd: config.ssl.storePass,
      total_amount: paymentData.amount,
      currency: "BDT",
      tran_id: paymentData.transactionId, // use unique tran_id for each api call
      success_url: config.ssl.successUrl,
      fail_url: config.ssl.failUrl,
      cancel_url: config.ssl.cancelUrl,
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "N/A",
      product_name: "Appointment.",
      product_category: "Electronic",
      product_profile: "general",
      cus_name: paymentData.customer_name,
      cus_email: paymentData.customer_email,
      cus_add1: paymentData.customer_address,
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: paymentData.customer_phone,
      cus_fax: "01711111111",
      ship_name: "Customer Name",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };

    const response = await axios({
      method: "POST",
      url: config.ssl.sslPaymentApi,
      data: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response;
  } catch (error) {
    console.log(error, "from ssl catch");
    throw new AppError(httpStatus.BAD_REQUEST, "something is wrong");
  }
};

const validatePayment = async (payload: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.ssl.sslValidationApi}?val_id=${payload.val_id}&store_id=${config.ssl.storeId}&store_passwd=${config.ssl.storePass}&format=json`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return response.data;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment Validation Failed");
  }
};

export const SSLServices = {
  initPayment,
  validatePayment,
};

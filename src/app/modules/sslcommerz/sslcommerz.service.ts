/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { envVars } from "../../config/env";
import { ISSLCommerz } from "./sslcommerz.interface";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";

const sslPayment = async (payload: ISSLCommerz) => {
  try {
    const data = {
      store_id: envVars.SSL.STORE_ID,
      store_passwd: envVars.SSL.STORE_PASSWORD,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transaction,
      success_url: `${envVars.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transaction}&amount=${payload.amount}&status=success`,
      fail_url: `${envVars.SSL.SSL_FAILED_BACKEND_URL}?transactionId=${payload.transaction}&amount=${payload.amount}&status=fail`,
      cancel_url: `${envVars.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transaction}&amount=${payload.amount}&status=cancel`,
      shipping_method: "N/A",
      product_category: "Service",
      product_profile: "general",
      cus_name: payload.name,
      cus_email: payload.email,
      cus_add1: payload.address,
      cus_add2: "N/A",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: payload.phoneNumber,
      cus_fax: "01711111111",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: "1000",
      ship_country: "N/A",
    };

    const stringifiedData: Record<string, string> = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, String(value)])
    );

    const response = await axios({
      method: "POST",
      url: envVars.SSL.SSL_PAYMENT_API,
      data: new URLSearchParams(stringifiedData).toString(),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

export const SSLService = {
  sslPayment,
};

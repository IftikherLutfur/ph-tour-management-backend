/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { envVars } from "../../config/env";
import { ISSLCommerz } from "./sslcommerz.interface";
import httpStatus from "http-status-codes"
import AppError from "../../errorHelpers/AppError";

const sslPayment = async (payload: ISSLCommerz) => {
    try {
        const data = {
        store_id: envVars.SSL.STORE_ID,
        store_passeord: envVars.SSL.STORE_PASSWORD,
        total_amount: payload.amount,
        currency: "BDT",
        tran_id: payload.transaction,
        success_url: envVars.SSL.SSL_SUCCESS_BACKEND_URL,
        fail_url: envVars.SSL.SSL_FAILED_BACKEND_URL,
        cancel_url: envVars.SSL.SSL_CANCEL_BACKEND_URL,
        shipping_method: "N/A",
        product_category: "Service",
        product_profile: "genaral",
        cus_name: payload.name,
        cus_email: payload.email,
        cus_address: payload.address,
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
            ship_postcode: 1000,
            ship_country: "N/A",
    }

    const response = await axios({
        method: "POST",
        url: envVars.SSL.SSL_PAYMENT_API,
        data: data,
        headers: { "Content-Types": "application/x-www-from-urlencoded" }
    }) 
    return response.data;

    } catch (error: any) {
        console.log(error)
        throw new AppError(httpStatus.BAD_REQUEST, error.message)
    }
}


export const SSLService = {
    sslPayment
}
import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import AppError from "../../error/AppError";
import { SSLServices } from "../ssl/ssl.service";
import axios from "axios";
import config from "../../config";
import { PaymentStatus } from "@prisma/client";

const paymentInit = async (appointmentId: string) => {
  const appointmentInfo = await prisma.payment.findFirstOrThrow({
    where: {
      appointmentId: appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });

  const paymentData = {
    amount: appointmentInfo.amount,
    transactionId: appointmentInfo.transactionId,
    customer_name: appointmentInfo.appointment.patient.name,
    customer_email: appointmentInfo.appointment.patient.email,
    customer_address: appointmentInfo.appointment.patient.address,
    customer_phone: appointmentInfo.appointment.patient.contactNumber,
  };
  const result = await SSLServices.initPayment(paymentData);

  return { paymentUrl: result?.data.GatewayPageURL };
};

// HTTP POST Parameters will be throw to the IPN_HTTP_URL as amount=1150.00&bank_tran_id=151114130739MqCBNx5&card_brand=VISA&card_issuer=BRAC+BANK%2C+LTD.&card_issuer_country=Bangladesh&card_issuer_country_code=BD&card_no=432149XXXXXX0667&card_type=VISA-Brac+bank¤cy=BDT&status=VALID&store_amount=1104.00&store_id=learn661a84e34ebc8&tran_date=2015-11-14+13%3A07%3A12&tran_id=5646dd9d4b484&val_id=151114130742Bj94IBUk4uE5GRj&verify_sign=dd2e36f57f4dbaccc0f70a17a3ad8dbe&verify_key=amount%2Cbank_tran_id%2Ccard_brand%2Ccard_issuer%2Ccard_issuer_country%2Ccard_issuer_country_code%2Ccard_no%2Ccard_type%2Ccurrency%2Cstatus%2Cstore_amount%2Cstore_id%2Ctran_date%2Ctran_id%2Cval_id
const validatePayment = async (payload: any) => {
  // if (!payload || !payload.status || !(payload.status === "VALID")) {
  //   return {
  //     message: "Invalid Payment",
  //   };
  // }

  // const response = await SSLServices.validatePayment(payload);
  // if (response?.status !== "VALID") {
  //   return {
  //     message: "Payment Failed",
  //   };
  // }
  const response = payload;
  await prisma.$transaction(async (tx) => {
    const updatedPaymentData = await tx.payment.update({
      where: {
        transactionId: payload.tran_id,
      },
      data: {
        status: PaymentStatus.PAID,
        paymentGatewayData: response,
      },
    });
    await tx.appointment.update({
      where: {
        id: updatedPaymentData.appointmentId,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });
  });
  return {
    message: "Payment success",
  };
};
export const paymentServices = {
  paymentInit,
  validatePayment,
};

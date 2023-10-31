import { Payment } from "@prisma/client";

export const bookingPaymentsTotal = (payments: Payment[]) => {
    // total the payments
    let total = 0;
    payments.forEach((payment) => {
      total += payment.paymentAmount;
    });
    return total;
  }
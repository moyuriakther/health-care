export type TPayment = {
  amount: number;
  transactionId: string;
  customer_name: string;
  customer_email: string;
  customer_address: string | null;
  customer_phone: string | null;
};

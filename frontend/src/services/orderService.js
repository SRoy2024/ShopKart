import api from "./api";

export const createPaymentOrder = async (shippingAddress) => {
const response = await api.post("/orders/create-payment-order", {
shippingAddress
});

return response.data;
};

export const verifyPayment = async (paymentDetails) => {
const response = await api.post("/orders/verify-payment", paymentDetails);

return response.data;
};

export const getMyOrders = async () => {
const response = await api.get("/orders");

return response.data;
};

export const getOrderById = async (orderId) => {
const response = await api.get(`/orders/${orderId}`);

return response.data;
};

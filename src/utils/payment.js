const createOrder = async (amount) => {
  const res = await fetch("/api/createOrder", {
    method: "POST",
    body: JSON.stringify({ amount: amount * 100 }), //rs to paise
  });
  const data = await res.json();

  const paymentData = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    order_id: data.id,

    handler: async function (response) {
      // verify payment
      const res = await fetch("/api/verifyOrder", {
        method: "POST",
        body: JSON.stringify({
          orderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        }),
      });
      const data = await res.json();
      // console.log(data);
      if (data.isOk) {
        // do whatever page transition you want here as payment was successful
        alert("Payment successful");
      } else {
        alert("Payment failed");
      }
    },
  };

  const payment = new window.Razorpay(paymentData);
  payment.open();
};

export default createOrder;

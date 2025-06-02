const createOrder = async (amount, item) => {
  // Check if we have cart functionality
  if (typeof window !== 'undefined' && window.addToCart) {
    // Add to cart
    window.addToCart(item);
    return;
  }

  // Fall back to direct payment if cart is not available
  try {
    const res = await fetch("/api/createOrder", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount: amount * 100 }), // rs to paise
    });
    
    if (!res.ok) {
      throw new Error('Failed to create order');
    }
    
    const data = await res.json();

    const paymentData = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: "INR",
      name: "Conscious Namaz",
      description: item.name || "Program Payment",
      order_id: data.id,
      prefill: {
        name: "",
        email: "",
        contact: ""
      },
      handler: async function (response) {
        try {
          // verify payment
          const verifyRes = await fetch("/api/verifyOrder", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          
          if (!verifyRes.ok) {
            throw new Error('Payment verification failed');
          }
          
          const verifyData = await verifyRes.json();
          
          if (verifyData.success) {
            // Payment successful
            alert("Payment successful! Thank you for your purchase.");
            window.location.href = '/checkout-success';
          } else {
            alert("Payment failed. Please try again or contact support.");
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          alert("Payment verification failed. Please contact support if your payment was charged.");
        }
      },
      theme: {
        color: "#53593F" // Primary theme color
      }
    };

    const payment = new window.Razorpay(paymentData);
    payment.open();
  } catch (error) {
    console.error("Payment error:", error);
    alert("There was an error processing your payment. Please try again.");
  }
};

export default createOrder;

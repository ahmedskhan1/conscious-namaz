"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/src/context/CartContext";
import Container from "@/src/components/Container";
import Button from "@/src/components/Button";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getItemCount,
  } = useCart();
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
  });
  const [infoErrors, setInfoErrors] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
  });
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load customer info from localStorage if it exists
    if (typeof window !== "undefined") {
      const savedCustomerInfo = localStorage.getItem("customerInfo");
      const savedEmailVerified = localStorage.getItem("emailVerified");
      const savedAppliedCoupon = localStorage.getItem("appliedCoupon");
      
      if (savedCustomerInfo) {
        try {
          setCustomerInfo(JSON.parse(savedCustomerInfo));
        } catch (error) {
          console.error(
            "Error parsing customer info from localStorage:",
            error
          );
        }
      }
      
      if (savedEmailVerified === "true") {
        setEmailVerified(true);
      }

      if (savedAppliedCoupon) {
        try {
          setAppliedCoupon(JSON.parse(savedAppliedCoupon));
        } catch (error) {
          console.error("Error parsing applied coupon from localStorage:", error);
        }
      }
    }

    const fetchCoupons = async () => {
      try {
        const response = await fetch("/api/coupons");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.coupons) {
            // Transform API coupons to the format we need - including discount type
            const transformedCoupons = data.coupons.map((coupon) => ({
              code: coupon.code,
              discount: coupon.discount,
              discountType: coupon.discountType || "percentage",
              description:
                coupon.discountType === "fixed"
                  ? `₹${coupon.discount} off`
                  : `${coupon.discount}% off`,
            }));
            setAvailableCoupons(transformedCoupons);
          }
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, []);

  // Save customer info to localStorage when it changes and is verified
  useEffect(() => {
    if (typeof window !== "undefined" && emailVerified) {
      localStorage.setItem("customerInfo", JSON.stringify(customerInfo));
      localStorage.setItem("emailVerified", "true");
    }
  }, [customerInfo, emailVerified]);

  // Save applied coupon to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (appliedCoupon) {
        localStorage.setItem("appliedCoupon", JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem("appliedCoupon");
      }
    }
  }, [appliedCoupon]);

  // Validate coupon whenever cart items change
  useEffect(() => {
    if (appliedCoupon && cartItems.length > 0) {
      const subtotal = getTotalPrice();
      let discountAmount = 0;
      
      if (appliedCoupon.discountType === 'fixed') {
        discountAmount = appliedCoupon.discount;
      } else {
        discountAmount = Math.round(subtotal * (appliedCoupon.discount / 100));
      }
      
      // If discount is now greater than subtotal, remove the coupon
      if (discountAmount > subtotal) {
        setAppliedCoupon(null);
        localStorage.removeItem("appliedCoupon");
        setCouponError('Coupon removed: Discount exceeds cart total.');
      }
    }
  }, [cartItems, appliedCoupon, getTotalPrice]);

  const fetchUserInfo = async (email) => {
    try {
      const response = await fetch(
        `/api/cart/email?email=${encodeURIComponent(email)}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.userInfo) {
          setCustomerInfo((prev) => ({
            ...prev,
            name: data.userInfo.name,
            phone: data.userInfo.phone,
            city: data.userInfo.city || "",
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (infoErrors[name]) {
      setInfoErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Reset email verification if email changes
    if (name === "email" && emailVerified && value !== customerInfo.email) {
      setEmailVerified(false);
      setOtpSent(false);
      setShowOtpVerification(false);
      localStorage.removeItem("emailVerified");
    }
  };

  const validateCustomerInfo = () => {
    const errors = {
      name: "",
      email: "",
      phone: "",
      city: "",
    };
    let isValid = true;

    // Validate name
    if (!customerInfo.name) {
      errors.name = "Name is required";
      isValid = false;
    }

    // Validate email
    if (!customerInfo.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    // Validate phone
    if (!customerInfo.phone) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(customerInfo.phone.replace(/[^0-9]/g, ""))) {
      errors.phone = "Phone number must be 10 digits";
      isValid = false;
    }

    // Validate city
    if (!customerInfo.city) {
      errors.city = "City is required";
      isValid = false;
    }

    setInfoErrors(errors);
    return isValid;
  };

  const handleSendOtp = async () => {
    if (!validateCustomerInfo()) {
      document
        .getElementById("customer-info")
        .scrollIntoView({ behavior: "smooth" });
      return;
    }

    try {
      setIsSendingOtp(true);

      // Call API to send OTP
      const response = await fetch("/api/sendOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: customerInfo.email,
          name: customerInfo.name,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        setShowOtpVerification(true);
        alert("OTP has been sent to your email. Please check your inbox.");
      } else {
        alert(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setOtpError("Please enter the OTP");
      return;
    }

    try {
      setIsVerifyingOtp(true);

      // Call API to verify OTP
      const response = await fetch("/api/verifyOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: customerInfo.email,
          otp: otp,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEmailVerified(true);
        setShowOtpVerification(false);
        setOtpError("");

        // After email verification, try to fetch previous user info
        fetchUserInfo(customerInfo.email);
      } else {
        setOtpError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError("Failed to verify OTP. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleCouponApply = () => {
    // Reset error and applied coupon
    setCouponError("");
    setAppliedCoupon(null);

    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    // Check if coupon code is valid
    const coupon = availableCoupons.find(
      (c) => c.code.toLowerCase() === couponCode.trim().toLowerCase()
    );

    if (coupon) {
      // Check if discount is greater than subtotal
      const subtotal = getTotalPrice();
      let discountAmount = 0;

      if (coupon.discountType === "fixed") {
        discountAmount = coupon.discount;
      } else {
        discountAmount = Math.round(subtotal * (coupon.discount / 100));
      }

      if (discountAmount > subtotal) {
        setCouponError(
          "Discount applies only if subtotal exceeds actual price."
        );
        return;
      }

      setAppliedCoupon(coupon);
      setCouponCode("");
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem("appliedCoupon");
  };

  // Calculate discount amount based on applied coupon
  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;

    if (appliedCoupon.discountType === "fixed") {
      // Fixed amount discount
      return Math.min(appliedCoupon.discount, getTotalPrice()); // Cannot discount more than the total
    } else {
      // Percentage discount
      return Math.round(getTotalPrice() * (appliedCoupon.discount / 100));
    }
  };

  // Calculate final total after discount
  const getFinalTotal = () => {
    return getTotalPrice() - getDiscountAmount();
  };

  const handleCheckout = async () => {
    // First validate customer information
    if (!validateCustomerInfo()) {
      // Scroll to the customer info section
      document
        .getElementById("customer-info")
        .scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Check if email is verified
    if (!emailVerified) {
      setShowOtpVerification(true);
      alert("Please verify your email before proceeding to checkout.");
      return;
    }

    try {
      setIsProcessingCheckout(true);

      // Create cart data to save to database
      const cartData = {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        city: customerInfo.city,
        coupon: appliedCoupon ? appliedCoupon.code : null,
        paymentStatus: "pending",
        emailVerified: true,
        items: cartItems.map((item) => ({
          programId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
        })),
        totalAmount: getFinalTotal(),
        discount: getDiscountAmount(),
      };

      console.log("Processing checkout with data:", cartData);

      // Save cart to database before payment
      const saveResponse = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartData),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.message || "Failed to save cart");
      }

      const saveData = await saveResponse.json();
      const cartId = saveData.cartId;

      // Create Razorpay order
      const razorpayResponse = await fetch("/api/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: getFinalTotal() * 100, // Convert to paise
          cartId: cartId, // Pass cartId to associate with the payment
        }),
      });

      if (!razorpayResponse.ok) {
        const errorData = await razorpayResponse.json();
        throw new Error(errorData.message || "Failed to create payment order");
      }

      const razorpayData = await razorpayResponse.json();

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: getFinalTotal() * 100, // in paise
        currency: "INR",
        name: "Conscious Namaz",
        description: "Program Payment",
        order_id: razorpayData.id,
        handler: async function (response) {
          try {
            // Verify payment with backend
            const verifyResponse = await fetch("/api/verifyOrder", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                cartId: cartId,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Payment was successful, clear cart and redirect
              clearCart();
              // Also clear customer info from localStorage after successful checkout
              localStorage.removeItem("customerInfo");
              localStorage.removeItem("emailVerified");
              router.push("/checkout-success");
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert(
              "There was an error verifying your payment. Please contact support."
            );
          }
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        notes: {
          cartId: cartId,
        },
        theme: {
          color: "#53593F", // Matching the primary color
        },
      };

      // Initialize Razorpay
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("There was an error processing your checkout. Please try again.");
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  // If cart is empty, show empty state
  if (getItemCount() === 0) {
    return (
      <div className="py-16 lg:py-24">
        <Container>
          <div className="text-center max-w-[600px] mx-auto">
            <div className="flex justify-center mb-6">
              <Image
                src="/images/shopping-cart-black.png"
                alt="Empty Cart"
                width={80}
                height={80}
                className="opacity-40"
              />
            </div>
            <h1 className="h2 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              href="/programs"
              className="bg-primary text-white py-3 px-6 rounded-md inline-block hover:bg-opacity-90 transition-all"
            >
              Browse Programs
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-16">
      <Container>
        <h1 className="h2 mb-8">Your Cart</h1>

        {isProcessingCheckout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-800">Processing your order...</p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 p-4 bg-gray-50">
                <h2 className="text-lg font-medium">
                  Items ({getItemCount()})
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 flex flex-col sm:flex-row gap-4"
                  >
                    {/* Item Image */}
                    <div className="w-full sm:w-28 h-28 relative rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={
                          item.image ||
                          `/images/home-sub-img-${(index % 4) + 1}.webp`
                        }
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-grow">
                      <h3 className="text-lg font-medium text-primary">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </p>
                      )}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4">
                        <div className="flex items-center mb-3 sm:mb-0">
                          <span className="mr-2">Quantity:</span>
                          <div className="flex border border-gray-300 rounded-md">
                            <button
                              className="px-3 py-1 border-r border-gray-300"
                              onClick={() =>
                                updateQuantity(
                                  item.id || item.name,
                                  Math.max(0, (item.quantity || 1) - 1)
                                )
                              }
                            >
                              -
                            </button>
                            <span className="px-3 py-1">
                              {item.quantity || 1}
                            </span>
                            <button
                              className="px-3 py-1 border-l border-gray-300"
                              onClick={() =>
                                updateQuantity(
                                  item.id || item.name,
                                  (item.quantity || 1) + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-medium">
                            ₹{item.price * (item.quantity || 1)}
                            {item.originalPrice && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ₹{item.originalPrice * (item.quantity || 1)}
                              </span>
                            )}
                          </div>
                          <button
                            className="ml-4 text-red-500 hover:text-red-700"
                            onClick={() => removeFromCart(item.id || item.name)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information Section */}
            <div
              className="bg-white rounded-lg shadow-sm overflow-hidden mt-8"
              id="customer-info"
            >
              <div className="border-b border-gray-200 p-4 bg-gray-50">
                <h2 className="text-lg font-medium">Customer Information</h2>
              </div>
              <div className="p-4">
                {/* Name - First */}
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleCustomerInfoChange}
                    className={`w-full p-2 border ${
                      infoErrors.name ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                    placeholder="Your full name"
                    required
                  />
                  {infoErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {infoErrors.name}
                    </p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleCustomerInfoChange}
                    className={`w-full p-2 border ${
                      infoErrors.phone ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                    placeholder="10-digit mobile number"
                    required
                  />
                  {infoErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {infoErrors.phone}
                    </p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={customerInfo.city}
                    onChange={handleCustomerInfoChange}
                    className={`w-full p-2 border ${
                      infoErrors.city ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                    placeholder="Your city"
                    required
                  />
                  {infoErrors.city && (
                    <p className="text-red-500 text-xs mt-1">
                      {infoErrors.city}
                    </p>
                  )}
                </div>
                
                {/* Email Address - Now Last */}
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address <span className="text-red-500">*</span>
                    {emailVerified && (
                      <span className="text-green-500 text-xs ml-2">
                        (Verified)
                      </span>
                    )}
                  </label>
                  <div className="flex">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleCustomerInfoChange}
                      className={`w-full p-2 border ${
                        infoErrors.email
                          ? "border-red-500"
                          : emailVerified
                          ? "border-green-500"
                          : "border-gray-300"
                      } rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary`}
                      placeholder="your@email.com"
                      required
                      disabled={emailVerified}
                    />
                    {!emailVerified ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp}
                        className="bg-primary text-white px-3 py-2 rounded-r-md hover:bg-opacity-90 transition-all disabled:opacity-50 whitespace-nowrap"
                      >
                        {isSendingOtp
                          ? "Sending..."
                          : otpSent
                          ? "Resend OTP"
                          : "Send OTP"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEmailVerified(false);
                          setOtpSent(false);
                          setShowOtpVerification(false);
                          localStorage.removeItem("emailVerified");
                        }}
                        className="bg-gray-200 text-gray-800 px-3 py-2 rounded-r-md hover:bg-gray-300 transition-all whitespace-nowrap"
                      >
                        Change
                      </button>
                    )}
                  </div>
                  {infoErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {infoErrors.email}
                    </p>
                  )}
                </div>
                
                {/* OTP Verification Section */}
                {showOtpVerification && !emailVerified && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-md">
                    <p className="text-sm mb-2">
                      An OTP has been sent to your email. Please enter it below
                      to verify your email.
                    </p>
                    <div className="flex">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className={`w-full p-2 border ${
                          otpError ? "border-red-500" : "border-gray-300"
                        } rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary`}
                        placeholder="Enter OTP"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={isVerifyingOtp}
                        className="bg-primary text-white px-3 py-2 rounded-r-md hover:bg-opacity-90 transition-all disabled:opacity-50"
                      >
                        {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                      </button>
                    </div>
                    {otpError && (
                      <p className="text-red-500 text-xs mt-1">{otpError}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>

              {/* Coupon Code Section */}
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">Apply Coupon</p>
                <div className="flex">
                  <input
                    type="text"
                    className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-primary"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={!!appliedCoupon}
                  />
                  <button
                    className="bg-primary text-white px-3 py-2 rounded-r-md hover:bg-opacity-90 transition-all disabled:opacity-50"
                    onClick={handleCouponApply}
                    disabled={!!appliedCoupon}
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-red-500 text-xs mt-1">{couponError}</p>
                )}
                {appliedCoupon && (
                  <div className="flex items-center justify-between mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                    <div>
                      <p className="text-green-700 text-sm font-medium">
                        {appliedCoupon.code}
                      </p>
                      <p className="text-green-600 text-xs">
                        {appliedCoupon.description} applied
                      </p>
                    </div>
                    <button
                      className="text-red-500 text-xs"
                      onClick={removeCoupon}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon.description})</span>
                    <span>-₹{getDiscountAmount()}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{getFinalTotal()}</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full mb-3"
                onClick={handleCheckout}
                disabled={isProcessingCheckout}
              >
                {isProcessingCheckout
                  ? "Processing..."
                  : emailVerified
                  ? "Proceed to Checkout"
                  : "Verify Email to Checkout"}
              </Button>

              <button
                className="w-full text-primary hover:underline text-sm mb-3"
                onClick={clearCart}
              >
                Clear Cart
              </button>

              <Link
                href="/programs"
                className="w-full text-primary hover:underline text-sm flex items-center justify-center"
              >
                <span className="mr-1">←</span> Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CartPage;

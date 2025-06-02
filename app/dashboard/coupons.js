"use client";

import { useState, useEffect } from "react";

const CouponsTab = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponForm, setCouponForm] = useState({
    code: "",
    discount: 10,
    discountType: "percentage",
    name: "",
    city: "",
    phone: "",
    instagramId: "",
    bankDetails: {
      accountNumber: "",
      ifscCode: "",
    },
  });
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/coupons");
      const data = await response.json();

      if (data.success) {
        setCoupons(data.coupons);
      } else {
        console.error("API returned success:false:", data);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      alert("Error loading coupons: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle coupon form change
  const handleCouponFormChange = (e) => {
    const { name, value } = e.target;

    // Special handling for phone field
    if (name === "phone") {
      // Only allow digits and limit to 10
      const digitsOnly = value.replace(/\D/g, "");
      const truncated = digitsOnly.slice(0, 10);

      setCouponForm((prev) => ({
        ...prev,
        [name]: truncated,
      }));
    } else if (name.includes(".")) {
      // Handle nested fields like bankDetails.accountNumber
      const [parent, child] = name.split(".");
      setCouponForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setCouponForm((prev) => ({
        ...prev,
        [name]: name === "discount" ? Number(value) : value,
      }));
    }
  };

  // Open coupon modal for adding
  const handleAddCoupon = () => {
    setCouponForm({
      code: "",
      discount: 10,
      discountType: "percentage",
      name: "",
      city: "",
      phone: "",
      instagramId: "",
      bankDetails: {
        accountNumber: "",
        ifscCode: "",
      },
    });
    setEditMode(false);
    setCurrentItemId(null);
    setShowCouponModal(true);
  };

  // Open coupon modal for editing
  const handleEditCoupon = (coupon) => {
    setCouponForm({
      code: coupon.code,
      discount: coupon.discount,
      discountType: coupon.discountType || "percentage",
      name: coupon.name || "",
      city: coupon.city || "",
      phone: coupon.phone || "",
      instagramId: coupon.instagramId || "",
      bankDetails: {
        accountNumber: coupon.bankDetails?.accountNumber || "",
        ifscCode: coupon.bankDetails?.ifscCode || "",
      },
    });
    setEditMode(true);
    setCurrentItemId(coupon._id);
    setShowCouponModal(true);
  };

  // Submit coupon form
  const handleSubmitCoupon = async (e) => {
    e.preventDefault();

    try {
      // Basic validation
      if (
        !couponForm.code ||
        !couponForm.discount ||
        !couponForm.name ||
        !couponForm.city ||
        !couponForm.phone
      ) {
        alert("Coupon code, discount, name, city, and phone are required");
        return;
      }

      // Validate phone number
      const phoneDigits = couponForm.phone.replace(/\D/g, "");
      if (phoneDigits.length !== 10) {
        alert("Phone number must be exactly 10 digits");
        return;
      }

      const requestBody = {
        code: couponForm.code.toUpperCase(),
        discount: parseInt(couponForm.discount),
        discountType: couponForm.discountType,
        name: couponForm.name,
        city: couponForm.city,
        phone: couponForm.phone,
        instagramId: couponForm.instagramId,
        bankDetails: {
          accountNumber: couponForm.bankDetails.accountNumber,
          ifscCode: couponForm.bankDetails.ifscCode,
        },
      };

      if (editMode) {
        // Update existing coupon
        const response = await fetch(`/api/coupons/${currentItemId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update coupon");
        }
      } else {
        // Create new coupon
        const response = await fetch("/api/coupons", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create coupon");
        }
      }

      setShowCouponModal(false);
      fetchCoupons();
    } catch (error) {
      console.error("Error saving coupon:", error);
      alert("An error occurred while saving the coupon: " + error.message);
    }
  };

  // Delete coupon
  const handleDeleteCoupon = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        const response = await fetch("/api/coupons", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        const data = await response.json();

        if (data.success) {
          fetchCoupons();
        } else {
          alert(data.error || "Failed to delete coupon");
        }
      } catch (error) {
        console.error("Error deleting coupon:", error);
        alert("An error occurred while deleting the coupon");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Coupon Management</h2>
        <button
          onClick={handleAddCoupon}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md"
        >
          Add New Coupon
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No coupons available.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon._id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {coupon.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {coupon.discount}
                      {coupon.discountType === "percentage" ? "%" : "₹"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {coupon.discountType === "percentage"
                        ? "Percentage"
                        : "Fixed Amount"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {coupon.name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {coupon.city || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {coupon.phone || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditCoupon(coupon)}
                        className="text-primary hover:text-primary-dark mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {editMode ? "Edit Coupon" : "Add New Coupon"}
            </h2>
            <form onSubmit={handleSubmitCoupon}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Personal Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={couponForm.name}
                    onChange={handleCouponFormChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={couponForm.city}
                    onChange={handleCouponFormChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={couponForm.phone}
                    onChange={handleCouponFormChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="10-digit mobile number"
                    maxLength="10"
                    pattern="[0-9]{10}"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter 10-digit number without spaces or hyphens
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram ID (Optional)
                  </label>
                  <input
                    type="text"
                    name="instagramId"
                    value={couponForm.instagramId}
                    onChange={handleCouponFormChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Instagram Handle"
                  />
                </div>
              </div>

              {/* Bank Details */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                  Bank Details (Optional)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="bankDetails.accountNumber"
                      value={couponForm.bankDetails.accountNumber}
                      onChange={handleCouponFormChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="Account Number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      name="bankDetails.ifscCode"
                      value={couponForm.bankDetails.ifscCode}
                      onChange={handleCouponFormChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="IFSC Code"
                    />
                  </div>
                </div>
              </div>

              {/* Coupon Details */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                  Coupon Information
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-2">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount
                    </label>
                    <div className="flex flex-col space-y-3">
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="discountType"
                            value="percentage"
                            checked={couponForm.discountType === "percentage"}
                            onChange={handleCouponFormChange}
                            className="form-radio h-4 w-4 text-primary"
                          />
                          <span className="ml-2">Percentage (%)</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="discountType"
                            value="fixed"
                            checked={couponForm.discountType === "fixed"}
                            onChange={handleCouponFormChange}
                            className="form-radio h-4 w-4 text-primary"
                          />
                          <span className="ml-2">Fixed Amount (₹)</span>
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="number"
                          name="discount"
                          value={couponForm.discount}
                          onChange={handleCouponFormChange}
                          className="w-full p-2 border rounded-md"
                          min="1"
                          max={
                            couponForm.discountType === "percentage"
                              ? "100"
                              : "100000"
                          }
                          required
                        />
                        <span className="ml-2 font-medium">
                          {couponForm.discountType === "percentage" ? "%" : "₹"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={couponForm.code}
                      onChange={handleCouponFormChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="e.g. WELCOME20"
                      disabled={editMode}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Uppercase letters and numbers recommended
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  {editMode ? "Update Coupon" : "Create Coupon"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsTab;

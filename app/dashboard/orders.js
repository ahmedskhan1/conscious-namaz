"use client";

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Chart components with no SSR
const BarChart = dynamic(
  () => import('react-chartjs-2').then(mod => ({ default: mod.Bar })),
  { ssr: false }
);

// Import Chart.js components dynamically
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
if (typeof window !== 'undefined') {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
}

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartError, setChartError] = useState(null);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    paymentStatus: '',
    coupon: '',
    city: '',
  });
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [uniqueCoupons, setUniqueCoupons] = useState([]);
  const [uniqueCities, setUniqueCities] = useState([]);
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  useEffect(() => {
    // Apply filters whenever orders or filters change
    applyFilters();
    
    // Extract unique coupons for filter dropdown
    if (orders.length) {
      const coupons = [...new Set(orders.filter(order => order.coupon).map(order => order.coupon))];
      setUniqueCoupons(coupons);
      
      // Extract unique cities for filter dropdown
      const cities = [...new Set(orders.filter(order => order.city).map(order => order.city))];
      setUniqueCities(cities);
    }
  }, [orders, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Generate a unique timestamp for cache busting
      const timestamp = new Date().getTime();
      const randomStr = Math.random().toString(36).substring(2, 15);
      
      // Use a more aggressive cache busting approach
      const response = await fetch(`/api/orders?t=${timestamp}&r=${randomStr}`, {
        method: 'GET', 
        cache: 'no-store', 
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        // Add this to ensure the request is not cached
        next: { revalidate: 0 }
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Orders loaded:', data.orders.length);
        console.log('Sample order:', data.orders[0]);
        setOrders(data.orders);
      } else {
        console.error("API returned success:false:", data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Error loading orders: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to orders
  const applyFilters = () => {
    let result = [...orders];
    
    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(order => new Date(order.createdAt) >= fromDate);
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      // Set time to end of day
      toDate.setHours(23, 59, 59, 999);
      result = result.filter(order => new Date(order.createdAt) <= toDate);
    }
    
    // Filter by payment status
    if (filters.paymentStatus) {
      result = result.filter(order => order.paymentStatus === filters.paymentStatus);
    }
    
    // Filter by coupon
    if (filters.coupon) {
      result = result.filter(order => order.coupon === filters.coupon);
    }
    
    // Filter by city
    if (filters.city) {
      result = result.filter(order => order.city === filters.city);
    }
    
    setFilteredOrders(result);
  };
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      paymentStatus: '',
      coupon: '',
      city: '',
    });
  };

  // Calculate coupon performance metrics
  const couponAnalytics = useMemo(() => {
    // Skip calculation if orders are not loaded yet
    if (!filteredOrders.length) return { coupons: [], totalRevenue: 0 };

    const couponMap = {};
    let totalRevenue = 0;

    // Process each order
    filteredOrders.forEach(order => {
      // Add all orders to total revenue for now (we can filter for paid only later)
      totalRevenue += order.totalAmount || 0;
      
      // If order used a coupon
      if (order.coupon) {
        if (!couponMap[order.coupon]) {
          couponMap[order.coupon] = {
            code: order.coupon,
            usageCount: 0,
            revenue: 0,
            discountAmount: 0,
            averageOrderValue: 0,
          };
        }
        
        couponMap[order.coupon].usageCount += 1;
        couponMap[order.coupon].revenue += order.totalAmount || 0;
        couponMap[order.coupon].discountAmount += (order.discount || 0);
      }
    });

    // Calculate average order value for each coupon
    Object.keys(couponMap).forEach(couponCode => {
      couponMap[couponCode].averageOrderValue = 
        couponMap[couponCode].revenue / couponMap[couponCode].usageCount;
    });

    // Convert to array and sort by revenue (highest first)
    const coupons = Object.values(couponMap).sort((a, b) => b.revenue - a.revenue);
    
    console.log('Coupon analytics calculated:', coupons.length, 'coupons found');
    if (coupons.length > 0) {
      console.log('Top coupon:', coupons[0]);
    }
    
    return { coupons, totalRevenue };
  }, [filteredOrders]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!couponAnalytics.coupons.length) {
      return {
        labels: [],
        datasets: []
      };
    }

    return {
      labels: couponAnalytics.coupons.map(coupon => coupon.code),
      datasets: [
        {
          label: 'Revenue (₹)',
          data: couponAnalytics.coupons.map(coupon => coupon.revenue),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Usage Count',
          data: couponAnalytics.coupons.map(coupon => coupon.usageCount),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    };
  }, [couponAnalytics]);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Coupon Performance'
      }
    }
  };

  // Function to export orders to Excel
  const exportToExcel = () => {
    if (!filteredOrders.length) {
      alert('No orders to export');
      return;
    }
    
    // Prepare CSV content
    let csvContent = "Order ID,Date,Customer Email,Phone,City,Items,Total Amount,Discount,Payment Status,Coupon\n";
    
    filteredOrders.forEach(order => {
      const orderDate = new Date(order.createdAt).toLocaleString();
      const items = order.items && order.items.length > 0 
        ? order.items.map(item => `${item.name || item.programId} (${item.quantity}x)`).join("; ")
        : "No items";
      
      // Format each row and escape commas within fields
      const row = [
        order._id,
        `"${orderDate}"`,
        `"${order.email || ''}"`,
        `"${order.phone || ''}"`,
        `"${order.city || ''}"`,
        `"${items}"`,
        order.totalAmount || 0,
        order.discount || 0,
        order.paymentStatus || 'unknown',
        `"${order.coupon || ''}"`
      ].join(',');
      
      csvContent += row + "\n";
    });
    
    // Create a download link and trigger the download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    
    // Add filter info to filename if filters are applied
    let filename = `orders_export_${new Date().toISOString().split('T')[0]}`;
    if (Object.values(filters).some(v => v)) {
      filename += '_filtered';
    }
    link.setAttribute('download', `${filename}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render the chart with error handling
  const renderChart = () => {
    if (chartError) {
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          Error loading chart: {chartError.message}
        </div>
      );
    }

    if (!couponAnalytics.coupons.length) {
      return (
        <div className="p-4 bg-yellow-100 text-yellow-700 rounded-md">
          No coupon data available to display. Try processing some orders with coupon codes first.
        </div>
      );
    }

    try {
      return (
        <div className="h-80">
          <BarChart data={chartData} options={chartOptions} />
        </div>
      );
    } catch (error) {
      console.error("Error rendering chart:", error);
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          Error rendering chart: {error.message}
        </div>
      );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Order Management</h2>
        <div className="flex space-x-2">
          <button 
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 01-1-1V4a1 1 0 011-1h4a1 1 0 010 2H5v10h10v-2a1 1 0 112 0v3a1 1 0 01-1 1H3zm11-6a1 1 0 01-1-1V4a1 1 0 012 0v2.586l3.293-3.293a1 1 0 111.414 1.414l-3.293 3.293H19a1 1 0 010 2h-4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Export to CSV
          </button>
          <button 
            onClick={fetchOrders}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center"
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh Orders (Force)'}
          </button>
        </div>
      </div>
      
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Filter Orders</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            <select
              name="paymentStatus"
              value={filters.paymentStatus}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            >
              <option value="">All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coupon</label>
            <select
              name="coupon"
              value={filters.coupon}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            >
              <option value="">All</option>
              {uniqueCoupons.map(coupon => (
                <option key={coupon} value={coupon}>{coupon}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            >
              <option value="">All</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
          >
            Reset Filters
          </button>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Coupon Performance Analysis */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Coupon Performance Analysis</h3>
            <div className="mb-6">
              {renderChart()}
            </div>
            
            {couponAnalytics.coupons.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coupon Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage Count</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Discount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Order Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {couponAnalytics.coupons.map((coupon) => (
                      <tr key={coupon.code}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{coupon.code}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{coupon.usageCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">₹{coupon.revenue.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">₹{coupon.discountAmount.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">₹{coupon.averageOrderValue.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {((coupon.revenue / (couponAnalytics.totalRevenue || 1)) * 100).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-4 bg-gray-100 rounded-md">
                <p className="text-gray-600">No coupon data available. Process some orders with coupon codes to see performance metrics.</p>
              </div>
            )}
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coupon</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No orders available.</td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{order.email}</div>
                        <div className="text-sm text-gray-500">{order.phone}</div>
                        {order.city && <div className="text-xs text-gray-500 mt-1">City: {order.city}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {order.items && order.items.map((item, index) => (
                            <div key={index} className="mb-1 last:mb-0">
                              <span className="font-medium">{item.name || item.programId}</span> ({item.quantity}x)
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">₹{order.totalAmount}</div>
                        {order.discount > 0 && (
                          <div className="text-xs text-green-600">
                            Discount: ₹{order.discount}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
                            order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' : 
                                'bg-gray-100 text-gray-800'}`}
                        >
                          {order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.coupon ? (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                            {order.coupon}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-sm">None</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersTab; 
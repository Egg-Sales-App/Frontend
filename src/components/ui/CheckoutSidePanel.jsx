import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  TrashIcon,
  CreditCardIcon,
  BanknotesIcon,
  PrinterIcon,
  CheckCircleIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "./ToastContext";
import { orderService } from "../../services/orderService";
import { paystackService } from "../../services/paystackService";

const CheckoutSidePanel = ({
  items = [],
  isOpen,
  onClose,
  onRemoveItem,
  onClearCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onOrderComplete,
}) => {
  const [paymentMethod, setPaymentMethod] = useState(""); // "cash" or "mobile_money"
  const [cashAmount, setCashAmount] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
  });

  const { success, error: showError, info } = useToast();

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) =>
      sum + (parseFloat(item.price) || 0) * (item.cartQuantity || 1),
    0
  );
  const taxRate = 0.125; // 12.5% VAT
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  const balance =
    paymentMethod === "cash" ? parseFloat(cashAmount || 0) - total : 0;

  // Reset states when panel closes
  useEffect(() => {
    if (!isOpen) {
      setPaymentMethod("");
      setCashAmount("");
      setPaymentConfirmed(false);
      setOrderCompleted(false);
      setCustomerInfo({ name: "", phone: "" });
    }
  }, [isOpen]);

  const createOrder = async (paymentMethod, paymentStatus = "completed") => {
    try {
      const orderData = {
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        order_date: new Date().toISOString(),
        total_amount: total,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.cartQuantity || 1,
          unit_price: item.price,
          total_price: item.price * (item.cartQuantity || 1),
        })),
      };

      const response = await orderService.createOrder(orderData);
      return response;
    } catch (error) {
      console.error("Order creation failed:", error);
      throw error;
    }
  };

  const handleCashPayment = async () => {
    const amount = parseFloat(cashAmount);
    if (amount < total) {
      showError("Insufficient cash amount!");
      return;
    }

    setIsProcessingPayment(true);
    try {
      const order = await createOrder("cash");
      setPaymentConfirmed(true);
      success(
        `Payment confirmed! Order #${
          order.ref_code
        } created. Balance: GHS ${balance.toFixed(2)}`
      );
    } catch (error) {
      showError("Failed to create order. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleMobileMoneyPayment = async () => {
    if (!customerInfo.phone) {
      showError("Please enter customer phone number for mobile money payment");
      return;
    }

    setIsProcessingPayment(true);
    try {
      const reference = paystackService.generateReference();
      const email = `${customerInfo.phone}@pos.ashford.com`;

      // Initialize Paystack payment
      const paymentData = await paystackService.initializePayment({
        amount: total * 100, // Convert to kobo
        email: email,
        phone: customerInfo.phone,
        reference: reference,
      });

      // Open Paystack popup
      paystackService.openPaymentPopup({
        amount: total * 100,
        email: email,
        phone: customerInfo.phone,
        reference: reference,
        onSuccess: async (response) => {
          try {
            // Verify payment
            const verification = await paystackService.verifyPayment(
              response.reference
            );

            if (
              verification.status &&
              verification.gateway_response === "Successful"
            ) {
              // Create order in database
              const order = await createOrder("mobile_money", "completed");
              setPaymentConfirmed(true);
              success(
                `Mobile money payment successful! Order #${order.ref_code} created.`
              );
            } else {
              showError("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            showError("Payment verification failed. Please try again.");
          }
        },
        onClose: () => {
          showError("Payment was cancelled");
        },
      });
    } catch (error) {
      console.error("Payment error:", error);
      showError("Payment initialization failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCompleteOrder = async () => {
    if (!customerInfo.name) {
      showError("Please enter customer name");
      return;
    }

    try {
      setIsProcessingPayment(true);

      // Create order object
      const orderData = {
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.cartQuantity || 1, // Use actual cart quantity
          price: parseFloat(item.price),
        })),
        total_amount: total,
        payment_method: paymentMethod,
        payment_status: "paid",
        order_date: new Date().toISOString(),
      };

      // Here you would call your backend API
      // const response = await orderService.createOrder(orderData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setOrderCompleted(true);
      success("Order completed successfully!");

      // Don't clear cart or close panel - let user print receipt first
      // Cart will be cleared only when user clicks "Close & Finish"
    } catch (error) {
      showError("Failed to complete order. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePrintReceipt = () => {
    const currentDate = new Date();
    const receiptNumber = `RCP-${currentDate.getFullYear()}${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}${String(currentDate.getDate()).padStart(
      2,
      "0"
    )}-${String(currentDate.getHours()).padStart(2, "0")}${String(
      currentDate.getMinutes()
    ).padStart(2, "0")}${String(currentDate.getSeconds()).padStart(2, "0")}`;

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${receiptNumber}</title>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Arial', sans-serif;
              background: white;
              padding: 10px;
              color: #333;
              font-size: 12px;
              line-height: 1.3;
            }
            
            .receipt-container {
              max-width: 350px;
              margin: 0 auto;
              background: white;
              border: 1px solid #ddd;
              height: auto;
              min-height: 100vh;
              page-break-inside: avoid;
            }
            
            .receipt-header {
              background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
              color: white;
              padding: 15px 10px;
              text-align: center;
              position: relative;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .company-name {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 3px;
              text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            }
            
            .company-tagline {
              font-size: 10px;
              opacity: 0.9;
              margin-bottom: 8px;
            }
            
            .receipt-title {
              font-size: 12px;
              font-weight: 600;
              background: rgba(255,255,255,0.2);
              padding: 4px 12px;
              border-radius: 10px;
              display: inline-block;
            }
            
            .receipt-body {
              padding: 12px;
            }
            
            .receipt-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
              margin-bottom: 12px;
              padding: 8px;
              background: #f8fafc;
              border-radius: 4px;
              border-left: 3px solid #3b82f6;
            }
            
            .info-item {
              display: flex;
              flex-direction: column;
            }
            
            .info-label {
              font-size: 9px;
              color: #64748b;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.3px;
              margin-bottom: 2px;
            }
            
            .info-value {
              font-size: 11px;
              color: #1e293b;
              font-weight: 500;
            }
            
            .customer-section {
              margin-bottom: 12px;
              padding: 8px;
              background: #eff6ff;
              border-radius: 4px;
              border: 1px solid #bfdbfe;
            }
            
            .customer-title {
              font-size: 10px;
              font-weight: 600;
              color: #1e40af;
              margin-bottom: 6px;
              text-transform: uppercase;
              letter-spacing: 0.3px;
            }
            
            .customer-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 6px;
            }
            
            .items-section {
              margin-bottom: 12px;
            }
            
            .items-title {
              font-size: 12px;
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 8px;
              padding-bottom: 4px;
              border-bottom: 1px solid #3b82f6;
            }
            
            .item-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 6px 0;
              border-bottom: 1px solid #e2e8f0;
            }
            
            .item-row:last-child {
              border-bottom: none;
            }
            
            .item-details {
              flex: 1;
            }
            
            .item-name {
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 1px;
              font-size: 11px;
            }
            
            .item-meta {
              font-size: 9px;
              color: #64748b;
            }
            
            .item-total {
              font-weight: 600;
              color: #059669;
              font-size: 11px;
            }
            
            .totals-section {
              border-top: 1px solid #e2e8f0;
              padding-top: 10px;
              margin-top: 10px;
            }
            
            .total-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 3px 0;
            }
            
            .total-label {
              font-weight: 500;
              color: #475569;
              font-size: 11px;
            }
            
            .total-value {
              font-weight: 600;
              color: #1e293b;
              font-size: 11px;
            }
            
            .grand-total {
              background: #3b82f6;
              color: white;
              padding: 8px;
              border-radius: 4px;
              margin-top: 8px;
              font-size: 14px;
              font-weight: bold;
              text-align: center;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .payment-section {
              margin-top: 10px;
              padding: 8px;
              background: #f0fdf4;
              border-radius: 4px;
              border: 1px solid #bbf7d0;
            }
            
            .payment-title {
              font-size: 10px;
              font-weight: 600;
              color: #166534;
              margin-bottom: 6px;
              text-transform: uppercase;
              letter-spacing: 0.3px;
            }
            
            .payment-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 6px;
            }
            
            .receipt-footer {
              text-align: center;
              margin-top: 15px;
              padding-top: 10px;
              border-top: 1px dashed #cbd5e1;
            }
            
            .footer-message {
              font-size: 11px;
              color: #64748b;
              margin-bottom: 6px;
            }
            
            .footer-contact {
              font-size: 9px;
              color: #94a3b8;
              line-height: 1.2;
            }
            
            @media print {
              @page {
                size: A4;
                margin: 0.5in;
              }
              
              body {
                background: white;
                padding: 0;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .receipt-container {
                border: none;
                max-width: 100%;
                box-shadow: none;
                page-break-inside: avoid;
              }
              
              .receipt-header {
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
                print-color-adjust: exact;
                background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%) !important;
              }
              
              .grand-total {
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
                print-color-adjust: exact;
                background: #3b82f6 !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <!-- Header Section -->
            <div class="receipt-header">
              <div class="company-name">ASHFORD ENTERPRISE</div>
              <div class="company-tagline">Premium Poultry Equipment & Supplies</div>
              <div class="receipt-title">SALES RECEIPT</div>
            </div>
            
            <!-- Body Section -->
            <div class="receipt-body">
              <!-- Receipt Information -->
              <div class="receipt-info">
                <div class="info-item">
                  <div class="info-label">Receipt No.</div>
                  <div class="info-value">${receiptNumber}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Date</div>
                  <div class="info-value">${currentDate.toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Time</div>
                  <div class="info-value">${currentDate.toLocaleTimeString(
                    "en-US",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Cashier</div>
                  <div class="info-value">POS Terminal</div>
                </div>
              </div>
              
              <!-- Customer Information -->
              ${
                customerInfo.name || customerInfo.phone
                  ? `
              <div class="customer-section">
                <div class="customer-title">Customer Information</div>
                <div class="customer-info">
                  <div class="info-item">
                    <div class="info-label">Name</div>
                    <div class="info-value">${
                      customerInfo.name || "Walk-in Customer"
                    }</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Phone</div>
                    <div class="info-value">${customerInfo.phone || "N/A"}</div>
                  </div>
                </div>
              </div>
              `
                  : ""
              }
              
              <!-- Items Section -->
              <div class="items-section">
                <div class="items-title">Items Purchased</div>
                ${items
                  .map(
                    (item) => `
                  <div class="item-row">
                    <div class="item-details">
                      <div class="item-name">${item.name}</div>
                      <div class="item-meta">${
                        item.cartQuantity || 1
                      } × GHS ${parseFloat(item.price).toFixed(2)}</div>
                    </div>
                    <div class="item-total">GHS ${(
                      parseFloat(item.price) * (item.cartQuantity || 1)
                    ).toFixed(2)}</div>
                  </div>
                `
                  )
                  .join("")}
              </div>
              
              <!-- Totals Section -->
              <div class="totals-section">
                <div class="total-row">
                  <div class="total-label">Subtotal</div>
                  <div class="total-value">GHS ${subtotal.toFixed(2)}</div>
                </div>
                <div class="total-row">
                  <div class="total-label">VAT (12.5%)</div>
                  <div class="total-value">GHS ${tax.toFixed(2)}</div>
                </div>
                <div class="grand-total">
                  Total Amount: GHS ${total.toFixed(2)}
                </div>
              </div>
              
              <!-- Payment Information -->
              <div class="payment-section">
                <div class="payment-title">Payment Details</div>
                <div class="payment-grid">
                  <div class="info-item">
                    <div class="info-label">Method</div>
                    <div class="info-value">${
                      paymentMethod === "cash" ? "Cash Payment" : "Mobile Money"
                    }</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Status</div>
                    <div class="info-value" style="color: #059669; font-weight: 600;">✓ PAID</div>
                  </div>
                  ${
                    paymentMethod === "cash"
                      ? `
                  <div class="info-item">
                    <div class="info-label">Amount Paid</div>
                    <div class="info-value">GHS ${parseFloat(
                      cashAmount || 0
                    ).toFixed(2)}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Change</div>
                    <div class="info-value">GHS ${Math.max(0, balance).toFixed(
                      2
                    )}</div>
                  </div>
                  `
                      : ""
                  }
                </div>
              </div>
              
              <!-- Footer -->
              <div class="receipt-footer">
                <div class="footer-message">Thank you for choosing Ashford Enterprise!</div>
                <div class="footer-contact">
                  Visit us again for all your poultry equipment needs<br>
                  Contact: info@ashfordenterprise.com | +233 XXX XXX XXX
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.print();

    success("Professional receipt sent to printer!");
  };

  return (
    <>
      {/* Overlay with blur effect */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Side Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white">
            <h2 className="text-xl font-bold">Checkout</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-800 rounded transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Customer Information */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Customer Information
              </h3>
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Customer Name *"
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    disabled={orderCompleted}
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    disabled={orderCompleted}
                  />
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">
                  Cart Items ({items.length})
                </h3>
                {items.length > 0 && !orderCompleted && (
                  <button
                    onClick={onClearCart}
                    className="text-red-600 text-sm hover:text-red-800 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <p className="text-gray-500 text-center py-8 italic">
                  Your cart is empty
                </p>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600 font-medium">
                          GHS {parseFloat(item.price).toFixed(2)} each
                        </p>
                        <p className="text-xs text-gray-500">
                          Subtotal: GHS{" "}
                          {(
                            parseFloat(item.price) * (item.cartQuantity || 1)
                          ).toFixed(2)}
                        </p>
                      </div>

                      {!orderCompleted && (
                        <div className="flex items-center gap-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1 border rounded">
                            <button
                              onClick={() => onDecreaseQuantity?.(item.id)}
                              className="p-1 hover:bg-red-500 bg-red-400 rounded-l transition-colors"
                              disabled={!onDecreaseQuantity}
                            >
                              <MinusIcon className="h-3 w-3" />
                            </button>
                            <span className="px-2 py-1 text-blue-700 text-sm font-medium min-w-8 text-center">
                              {item.cartQuantity || 1}
                            </span>
                            <button
                              onClick={() => onIncreaseQuantity?.(item.id)}
                              className="p-1 hover:bg-green-500 bg-green-400 rounded-r transition-colors"
                              disabled={!onIncreaseQuantity}
                            >
                              <PlusIcon className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      {orderCompleted && (
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            Qty: {item.cartQuantity || 1}
                          </p>
                          <p className="text-xs text-gray-600">
                            GHS{" "}
                            {(
                              parseFloat(item.price) * (item.cartQuantity || 1)
                            ).toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary */}
            {items.length > 0 && (
              <div className="mb-6 border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Order Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-medium">
                      GHS {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (12.5%):</span>
                    <span className="font-medium">GHS {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-3 text-gray-900">
                    <span>Total:</span>
                    <span>GHS {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method Selection */}
            {items.length > 0 && !orderCompleted && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Payment Method
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setPaymentMethod("cash")}
                    className={`w-full p-4 border rounded-lg flex items-center gap-3 transition-all ${
                      paymentMethod === "cash"
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <BanknotesIcon className="h-5 w-5" />
                    <span className="font-medium">Cash Payment</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("mobile_money")}
                    className={`w-full p-4 border rounded-lg flex items-center gap-3 transition-all ${
                      paymentMethod === "mobile_money"
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <CreditCardIcon className="h-5 w-5" />
                    <span className="font-medium">Mobile Money</span>
                  </button>
                </div>
              </div>
            )}

            {/* Cash Payment Form */}
            {paymentMethod === "cash" && !paymentConfirmed && (
              <div className="mb-6 bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Cash Payment
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount Received
                    </label>
                    <input
                      type="number"
                      placeholder="Enter cash amount received"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      step="0.01"
                    />
                  </div>
                  {cashAmount && (
                    <div className="bg-white p-3 rounded border">
                      <div className="text-sm space-y-1">
                        <p className="text-gray-700">
                          <span className="font-medium">Total Due:</span> GHS{" "}
                          {total.toFixed(2)}
                        </p>
                        <p
                          className={`font-semibold ${
                            balance >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          <span className="font-medium">Change:</span> GHS{" "}
                          {balance.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleCashPayment}
                    disabled={
                      !cashAmount ||
                      parseFloat(cashAmount) < total ||
                      isProcessingPayment
                    }
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                  >
                    Confirm Cash Payment
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Money Form */}
            {paymentMethod === "mobile_money" && !paymentConfirmed && (
              <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Mobile Money Payment
                </h3>
                <div className="space-y-4">
                  <div className="bg-white p-3 rounded border">
                    <p className="text-sm font-medium text-gray-700">
                      <span className="font-semibold">Total Amount:</span> GHS{" "}
                      {total.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      You will be redirected to complete payment via Paystack
                    </p>
                  </div>
                  <button
                    onClick={handleMobileMoneyPayment}
                    disabled={isProcessingPayment || !customerInfo.phone}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                  >
                    {isProcessingPayment
                      ? "Processing Payment..."
                      : "Pay with Mobile Money"}
                  </button>
                  {!customerInfo.phone && (
                    <p className="text-xs text-red-600">
                      Please enter customer phone number above
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Payment Confirmed */}
            {paymentConfirmed && !orderCompleted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3 text-green-800 mb-4">
                  <CheckCircleIcon className="h-6 w-6" />
                  <span className="font-semibold text-lg">
                    Payment Confirmed
                  </span>
                </div>
                <button
                  onClick={handleCompleteOrder}
                  disabled={isProcessingPayment}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 font-medium transition-colors"
                >
                  {isProcessingPayment
                    ? "Completing Order..."
                    : "Complete Order"}
                </button>
              </div>
            )}

            {/* Order Completed */}
            {orderCompleted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3 text-green-800 mb-4">
                  <CheckCircleIcon className="h-6 w-6" />
                  <span className="font-semibold text-lg">
                    Order Completed Successfully!
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handlePrintReceipt}
                    className="bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 font-medium transition-colors"
                  >
                    <PrinterIcon className="h-5 w-5" />
                    Print
                  </button>

                  <button
                    onClick={() => {
                      // Clear the cart and close panel
                      onClearCart();
                      onClose();
                      if (onOrderComplete) {
                        onOrderComplete(true); // Pass true to indicate final cleanup
                      }
                    }}
                    className="bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 flex items-center justify-center gap-2 font-medium transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutSidePanel;

import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  TrashIcon,
  CreditCardIcon,
  BanknotesIcon,
  PrinterIcon,
  CheckCircleIcon,
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
    (sum, item) => sum + (parseFloat(item.price) || 0),
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
          quantity: item.quantity || 1,
          unit_price: item.price,
          total_price: item.price * (item.quantity || 1),
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
          quantity: 1, // Assuming quantity 1 for now
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
    } catch (error) {
      showError("Failed to complete order. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePrintReceipt = () => {
    const receiptContent = `
      ASHFORD ENTERPRISE
      Poultry Store Receipt
      
      Date: ${new Date().toLocaleDateString()}
      Time: ${new Date().toLocaleTimeString()}
      
      Customer: ${customerInfo.name}
      Phone: ${customerInfo.phone}
      
      ITEMS:
      ${items
        .map(
          (item) => `${item.name} - GHS ${parseFloat(item.price).toFixed(2)}`
        )
        .join("\n")}
      
      Subtotal: GHS ${subtotal.toFixed(2)}
      Tax (12.5%): GHS ${tax.toFixed(2)}
      Total: GHS ${total.toFixed(2)}
      
      Payment Method: ${paymentMethod === "cash" ? "Cash" : "Mobile Money"}
      ${
        paymentMethod === "cash"
          ? `Amount Paid: GHS ${cashAmount}\nBalance: GHS ${balance.toFixed(2)}`
          : ""
      }
      
      Thank you for your business!
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head><title>Receipt</title></head>
        <body style="font-family: monospace; white-space: pre-line; padding: 20px;">
          ${receiptContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();

    // Close panel and clear cart after printing
    setTimeout(() => {
      onClearCart();
      onClose();
    }, 1000);
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
          <div className="flex items-center justify-between p-4 border-b bg-gray-900 text-white">
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
                          GHS {parseFloat(item.price).toFixed(2)}
                        </p>
                      </div>
                      {!orderCompleted && (
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
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
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3 text-blue-800 mb-4">
                  <CheckCircleIcon className="h-6 w-6" />
                  <span className="font-semibold text-lg">
                    Order Completed Successfully!
                  </span>
                </div>
                <button
                  onClick={handlePrintReceipt}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 font-medium transition-colors"
                >
                  <PrinterIcon className="h-5 w-5" />
                  Print Receipt
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutSidePanel;

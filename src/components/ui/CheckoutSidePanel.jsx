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
  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  const taxRate = 0.125; // 12.5% VAT
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  const balance = paymentMethod === "cash" ? parseFloat(cashAmount || 0) - total : 0;

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

  const handleCashPayment = () => {
    const amount = parseFloat(cashAmount);
    if (amount < total) {
      showError("Insufficient cash amount!");
      return;
    }
    setPaymentConfirmed(true);
    success(`Payment confirmed! Balance: GHS ${balance.toFixed(2)}`);
  };

  const handleMobileMoneyPayment = async () => {
    if (!customerInfo.phone) {
      showError("Please enter customer phone number for mobile money payment");
      return;
    }

    setIsProcessingPayment(true);
    try {
      // Simulate Paystack integration
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Here you would integrate with actual Paystack API
      // const paystackResponse = await paystackService.initializePayment({
      //   amount: total * 100, // Paystack expects amount in kobo
      //   email: `${customerInfo.phone}@placeholder.com`,
      //   phone: customerInfo.phone,
      //   reference: `pos_${Date.now()}`
      // });

      setPaymentConfirmed(true);
      success("Mobile money payment confirmed!");
    } catch (error) {
      showError("Payment failed. Please try again.");
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
        items: items.map(item => ({
          product_id: item.id,
          quantity: 1, // Assuming quantity 1 for now
          price: parseFloat(item.price)
        })),
        total_amount: total,
        payment_method: paymentMethod,
        payment_status: "paid",
        order_date: new Date().toISOString(),
      };

      // Here you would call your backend API
      // const response = await orderService.createOrder(orderData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
      ${items.map(item => `${item.name} - GHS ${parseFloat(item.price).toFixed(2)}`).join('\n')}
      
      Subtotal: GHS ${subtotal.toFixed(2)}
      Tax (12.5%): GHS ${tax.toFixed(2)}
      Total: GHS ${total.toFixed(2)}
      
      Payment Method: ${paymentMethod === 'cash' ? 'Cash' : 'Mobile Money'}
      ${paymentMethod === 'cash' ? `Amount Paid: GHS ${cashAmount}\nBalance: GHS ${balance.toFixed(2)}` : ''}
      
      Thank you for your business!
    `;

    const printWindow = window.open('', '_blank');
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
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Side Panel */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white">
            <h2 className="text-lg font-semibold">Checkout</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-blue-700 rounded"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Customer Information */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Customer Information</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Customer Name *"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({...prev, name: e.target.value}))}
                  className="w-full p-2 border rounded-md"
                  disabled={orderCompleted}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({...prev, phone: e.target.value}))}
                  className="w-full p-2 border rounded-md"
                  disabled={orderCompleted}
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Cart Items ({items.length})</h3>
                {items.length > 0 && !orderCompleted && (
                  <button
                    onClick={onClearCart}
                    className="text-red-600 text-sm hover:text-red-800"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              {items.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">GHS {parseFloat(item.price).toFixed(2)}</p>
                      </div>
                      {!orderCompleted && (
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-800 p-1"
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
                <h3 className="font-medium mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>GHS {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (12.5%):</span>
                    <span>GHS {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>GHS {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method Selection */}
            {items.length > 0 && !orderCompleted && (
              <div className="mb-6">
                <h3 className="font-medium mb-3">Payment Method</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setPaymentMethod("cash")}
                    className={`w-full p-3 border rounded-lg flex items-center gap-3 ${
                      paymentMethod === "cash" ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    <BanknotesIcon className="h-5 w-5" />
                    <span>Cash Payment</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("mobile_money")}
                    className={`w-full p-3 border rounded-lg flex items-center gap-3 ${
                      paymentMethod === "mobile_money" ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    <CreditCardIcon className="h-5 w-5" />
                    <span>Mobile Money</span>
                  </button>
                </div>
              </div>
            )}

            {/* Cash Payment Form */}
            {paymentMethod === "cash" && !paymentConfirmed && (
              <div className="mb-6">
                <h3 className="font-medium mb-3">Cash Payment</h3>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Amount Received"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    step="0.01"
                  />
                  {cashAmount && (
                    <div className="text-sm">
                      <p>Total: GHS {total.toFixed(2)}</p>
                      <p className={balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                        Balance: GHS {balance.toFixed(2)}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={handleCashPayment}
                    disabled={!cashAmount || parseFloat(cashAmount) < total}
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Cash Payment
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Money Form */}
            {paymentMethod === "mobile_money" && !paymentConfirmed && (
              <div className="mb-6">
                <h3 className="font-medium mb-3">Mobile Money Payment</h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Total Amount: GHS {total.toFixed(2)}
                  </p>
                  <button
                    onClick={handleMobileMoneyPayment}
                    disabled={isProcessingPayment || !customerInfo.phone}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessingPayment ? "Processing..." : "Pay with Mobile Money"}
                  </button>
                </div>
              </div>
            )}

            {/* Payment Confirmed */}
            {paymentConfirmed && !orderCompleted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 mb-3">
                  <CheckCircleIcon className="h-5 w-5" />
                  <span className="font-medium">Payment Confirmed</span>
                </div>
                <button
                  onClick={handleCompleteOrder}
                  disabled={isProcessingPayment}
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {isProcessingPayment ? "Completing Order..." : "Complete Order"}
                </button>
              </div>
            )}

            {/* Order Completed */}
            {orderCompleted && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700 mb-3">
                  <CheckCircleIcon className="h-5 w-5" />
                  <span className="font-medium">Order Completed!</span>
                </div>
                <button
                  onClick={handlePrintReceipt}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
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
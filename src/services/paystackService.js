// Paystack integration service
import { apiService } from "./api";

const PAYSTACK_PUBLIC_KEY =
  import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ||
  "pk_test_your_paystack_public_key";

export const paystackService = {
  // Initialize payment through backend (SECURE)
  async initializePayment({ amount, email, phone, reference, callback_url }) {
    try {
      // Send to your backend API instead of directly to Paystack
      const response = await apiService.post("/paystack/init/", {
        amount: amount, // Amount in kobo (multiply by 100)
        email: email,
        phone: phone,
        reference: reference,
        callback_url: callback_url,
        payment_method: "paystack",
        channels: ["mobile_money", "card"],
        order_id: 1,
        metadata: {
          phone: phone,
          custom_fields: [
            {
              display_name: "Phone Number",
              variable_name: "phone",
              value: phone,
            },
          ],
        },
      });

      // Check if the backend returned a valid authorization_url
      if (response && response.authorization_url) {
        // Redirect the user to the Paystack payment page
        window.location.href = response.authorization_url;

        // Return the data for reference, although redirection will occur
        return {
          status: true,
          authorization_url: response.authorization_url,
          access_code: response.access_code,
          reference: response.reference,
        };
      } else {
        // Handle cases where the URL is not returned
        throw new Error(
          response.message ||
            "Payment initialization failed: No authorization URL returned."
        );
      }
    } catch (error) {
      console.error("Paystack initialization error:", error);
      throw new Error(
        "Payment system is currently unavailable. Please try cash payment or contact support."
      );
    }
  },

  // Verify payment through backend (SECURE)
  async verifyPayment(reference) {
    try {
      // Send to your backend API instead of directly to Paystack
      const response = await apiService.get(`/payments/verify/${reference}/`);

      if (response.status) {
        return {
          status: true,
          data: response.data,
          gateway_response: response.gateway_response,
          paid_at: response.paid_at,
          amount: response.amount, // Backend should convert from kobo to cedis
        };
      } else {
        throw new Error(response.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Backend payment verification error:", error);
      throw new Error(
        "Payment verification failed. Please contact support with your transaction reference."
      );
    }
  },

  // Open Paystack popup for payment
  openPaymentPopup({ amount, email, phone, reference, onSuccess, onClose }) {
    const handler = PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: email,
      amount: amount, // Amount in kobo
      ref: reference,
      metadata: {
        phone: phone,
        custom_fields: [
          {
            display_name: "Phone Number",
            variable_name: "phone",
            value: phone,
          },
        ],
      },
      channels: ["mobile_money", "card"],
      callback: function (response) {
        // Payment was successful
        onSuccess(response);
      },
      onClose: function () {
        // Payment was cancelled
        onClose();
      },
    });

    handler.openIframe();
  },

  // Generate unique reference
  generateReference() {
    return `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
};

// Note: For production, ensure that:
// 1. Backend payment endpoints are properly implemented
// 2. Paystack secret key is securely stored on backend
// 3. Include the Paystack inline JS library in your HTML:
//    <script src="https://js.paystack.co/v1/inline.js"></script>

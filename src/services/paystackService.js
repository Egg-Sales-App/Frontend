// Paystack integration service
import { api } from "./api";

const PAYSTACK_PUBLIC_KEY =
  import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ||
  "pk_test_your_paystack_public_key";

export const paystackService = {
  // Initialize payment through backend (SECURE)
  async initializePayment({ amount, email, phone, reference, callback_url }) {
    try {
      // Send to your backend API instead of directly to Paystack
      const response = await api.post("/payments/initialize/", {
        amount: amount, // Amount in kobo (multiply by 100)
        email: email,
        phone: phone,
        reference: reference,
        callback_url: callback_url,
        payment_method: "paystack",
        channels: ["mobile_money", "card"],
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

      if (response.status) {
        return {
          status: true,
          data: response.data,
          authorization_url: response.authorization_url,
          access_code: response.access_code,
          reference: response.reference,
        };
      } else {
        throw new Error(response.message || "Payment initialization failed");
      }
    } catch (error) {
      console.error("Paystack initialization error:", error);

      // Fallback to direct Paystack call if backend is not ready
      console.warn(
        "Falling back to direct Paystack integration (NOT RECOMMENDED FOR PRODUCTION)"
      );
      return await this.initializePaymentDirect({
        amount,
        email,
        phone,
        reference,
        callback_url,
      });
    }
  },

  // Direct Paystack initialization (FALLBACK ONLY - NOT SECURE)
  async initializePaymentDirect({
    amount,
    email,
    phone,
    reference,
    callback_url,
  }) {
    try {
      // Note: This should be moved to backend for production
      const response = await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer sk_test_your_secret_key`, // This should be on backend!
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amount,
            email: email,
            reference: reference,
            callback_url: callback_url,
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
          }),
        }
      );

      const data = await response.json();

      if (data.status) {
        return {
          status: true,
          data: data.data,
          authorization_url: data.data.authorization_url,
          access_code: data.data.access_code,
          reference: data.data.reference,
        };
      } else {
        throw new Error(data.message || "Payment initialization failed");
      }
    } catch (error) {
      console.error("Direct Paystack initialization error:", error);
      throw error;
    }
  },

  // Verify payment through backend (SECURE)
  async verifyPayment(reference) {
    try {
      // Send to your backend API instead of directly to Paystack
      const response = await api.get(`/payments/verify/${reference}/`);

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

      // Fallback to direct verification if backend is not ready
      console.warn(
        "Falling back to direct Paystack verification (NOT RECOMMENDED FOR PRODUCTION)"
      );
      return await this.verifyPaymentDirect(reference);
    }
  },

  // Direct Paystack verification (FALLBACK ONLY - NOT SECURE)
  async verifyPaymentDirect(reference) {
    try {
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer sk_test_your_secret_key`, // This should be on backend!
          },
        }
      );

      const data = await response.json();

      if (data.status) {
        return {
          status: true,
          data: data.data,
          gateway_response: data.data.gateway_response,
          paid_at: data.data.paid_at,
          amount: data.data.amount / 100, // Convert from kobo to cedis
        };
      } else {
        throw new Error(data.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Direct Paystack verification error:", error);
      throw error;
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

// Note: For production, you should:
// 1. Replace the public key with your actual Paystack public key
// 2. Handle payments through your backend API for security
// 3. Include the Paystack inline JS library in your HTML:
//    <script src="https://js.paystack.co/v1/inline.js"></script>

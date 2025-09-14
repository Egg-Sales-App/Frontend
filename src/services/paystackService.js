// Paystack integration service
const PAYSTACK_PUBLIC_KEY =
  import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ||
  "pk_test_your_paystack_public_key";

export const paystackService = {
  // Initialize payment with Paystack
  async initializePayment({ amount, email, phone, reference, callback_url }) {
    try {
      // This would typically be done via your backend API
      const response = await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${PAYSTACK_PUBLIC_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amount, // Amount in kobo (multiply by 100)
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
      console.error("Paystack initialization error:", error);
      throw error;
    }
  },

  // Verify payment
  async verifyPayment(reference) {
    try {
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${PAYSTACK_PUBLIC_KEY}`,
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
      console.error("Paystack verification error:", error);
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

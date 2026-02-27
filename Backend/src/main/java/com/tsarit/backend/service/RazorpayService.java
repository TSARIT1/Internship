package com.tsarit.backend.service;

import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RazorpayService {

    @Autowired
    private RazorpayClient razorpayClient;

    public Payment verifyAndCapturePayment(String paymentId, Double amount) throws RazorpayException {
        Payment payment = razorpayClient.payments.fetch(paymentId);

        String status = payment.get("status");
        int amountInPaise = (int) (amount * 100);

        if ("captured".equals(status)) {
            return payment;
        }

        if ("authorized".equals(status)) {
            // Verify amount (optional but recommended)
            int authorizationAmount = payment.get("amount");
            // Allow small difference for floating point issues or different currency
            // handling if needed
            // For now, strict check or small buffer
            if (authorizationAmount < amountInPaise) {
                throw new RazorpayException(
                        "Payment amount mismatch. Authorized: " + authorizationAmount + ", Expected: " + amountInPaise);
            }

            JSONObject captureRequest = new JSONObject();
            captureRequest.put("amount", authorizationAmount); // Capture the full authorized amount
            captureRequest.put("currency", "INR");

            return razorpayClient.payments.capture(paymentId, captureRequest);
        }

        throw new RazorpayException("Payment status is " + status + ", cannot capture.");
    }
}

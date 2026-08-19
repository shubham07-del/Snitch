import { config } from "../config/config.js";
import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({ apiKey: config.BREVO_API_KEY });

export async function sendOrderConfirmationEmail(user, payment, address) {
    const subtotal = payment.orderItems.reduce((acc, item) => acc + (item.price.amount * item.quantity), 0);
    const total = payment.price.amount;
    const delivery = total - subtotal > 0 ? total - subtotal : 0;

    let productsText = "";
    let productsHtml = "";
    payment.orderItems.forEach(item => {
        productsText += `${item.title.padEnd(20)} ₹${item.price.amount * item.quantity}\n`;
        productsHtml += `
            <tr>
                <td style="padding: 16px 0; border-bottom: 1px solid #E5E7EB; color: #374151;">
                    ${item.title} <span style="color: #6B7280; font-size: 13px;">(x${item.quantity})</span>
                </td>
                <td style="padding: 16px 0; border-bottom: 1px solid #E5E7EB; text-align: right; color: #111827; font-weight: 500;">
                    ₹${item.price.amount * item.quantity}
                </td>
            </tr>
        `;
    });

    let addressText = "No address provided";
    let addressHtml = "<p style='color: #6B7280; margin: 0;'>No address provided</p>";
    if (address) {
        addressText = `${address.address}\n${address.city}, ${address.state}\n${address.pincode}`;
        addressHtml = `
            <p style="margin: 0; color: #374151;">${address.address}</p>
            <p style="margin: 4px 0 0 0; color: #6B7280;">${address.city}, ${address.state}</p>
            <p style="margin: 4px 0 0 0; color: #6B7280;">${address.pincode}</p>
        `;
    }

    const emailData = {
        subject: "Order Confirmation - AFTER",
        sender: { name: "AFTER", email: config.BREVO_SENDER_EMAIL },
        to: [{ email: user.email, name: user.fullname || "User" }],
        htmlContent: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F3F4F6; margin: 0; padding: 40px 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                
                <!-- Header (Branding) -->
                <div style="text-align: center; padding: 40px 20px; border-bottom: 1px solid #E5E7EB;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 0.25em; color: #111827; text-transform: uppercase;">
                        AFTER
                    </h1>
                    <p style="margin: 8px 0 0 0; font-size: 11px; font-weight: 600; letter-spacing: 0.3em; color: #6B7280; text-transform: uppercase;">
                        Wear your way
                    </p>
                </div>

                <!-- Body Content -->
                <div style="padding: 40px 32px;">
                    <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #111827;">Hi ${user.fullname || "there"},</h2>
                    <p style="margin: 0 0 24px 0; font-size: 16px; color: #4B5563; line-height: 1.5;">
                        Your order has been successfully placed and is now being processed.
                    </p>

                    <div style="background-color: #F9FAFB; border-radius: 8px; padding: 16px; margin-bottom: 32px;">
                        <p style="margin: 0; font-size: 14px; color: #6B7280;">Order ID</p>
                        <p style="margin: 4px 0 0 0; font-size: 16px; color: #111827; font-weight: 600;">#${payment.razorpay.orderId}</p>
                    </div>

                    <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #111827;">Order Summary</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
                        ${productsHtml}
                        <tr>
                            <td style="padding: 16px 0 8px 0; color: #6B7280;">Subtotal</td>
                            <td style="padding: 16px 0 8px 0; text-align: right; color: #374151;">₹${subtotal}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6B7280;">Delivery</td>
                            <td style="padding: 8px 0; text-align: right; color: #374151;">₹${delivery}</td>
                        </tr>
                        <tr>
                            <td style="padding: 16px 0 0 0; color: #111827; font-weight: 700; font-size: 18px; border-top: 2px solid #E5E7EB;">Total</td>
                            <td style="padding: 16px 0 0 0; text-align: right; color: #111827; font-weight: 700; font-size: 18px; border-top: 2px solid #E5E7EB;">₹${total}</td>
                        </tr>
                    </table>

                    <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #111827;">Delivery Address</h3>
                    <div style="background-color: #F9FAFB; border-radius: 8px; padding: 16px; margin-bottom: 32px; font-size: 15px; line-height: 1.5;">
                        ${addressHtml}
                    </div>

                    <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 24px; border-top: 1px solid #E5E7EB;">
                        <span style="color: #6B7280; font-size: 15px;">Payment Status</span>
                        <span style="background-color: #111827; color: #FFFFFF; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em;">Paid</span>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background-color: #F9FAFB; text-align: center; padding: 32px 20px;">
                    <p style="margin: 0; font-size: 14px; color: #6B7280;">
                        Thank you for shopping with us!
                    </p>
                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #9CA3AF;">
                        © ${new Date().getFullYear()} AFTER. All rights reserved.
                    </p>
                </div>
            </div>
        </body>
        </html>
        `,
        textContent: `Hi ${user.fullname || "there"},\n\nYour order has been successfully placed.\n\nOrder ID: #${payment.razorpay.orderId}\n\nProducts\n────────────────────\n${productsText}\nSubtotal        ₹${subtotal}\nDelivery          ₹${delivery}\n────────────────────\nTotal           ₹${total}\n\nDelivery Address\n${addressText}\n\nPayment: Paid\n\nThank you for shopping with us.`
    };

    try {
        await brevo.transactionalEmails.sendTransacEmail(emailData);
        console.log("Order confirmation email sent successfully");
    } catch (error) {
        console.error("Error sending order confirmation email", error);
    }
}

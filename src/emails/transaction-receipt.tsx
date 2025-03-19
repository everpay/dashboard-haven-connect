
import * as React from "react";
import { Container } from "./components/Container";
import { Heading } from "./components/Heading";
import { Layout } from "./components/Layout";
import { Logo } from "./components/Logo";
import { Text } from "./components/Text";

interface TransactionReceiptEmailProps {
  username?: string;
  amount: number;
  date: string;
  transactionId: string;
  recipient?: string;
  transactionType: "incoming" | "outgoing";
}

export const TransactionReceiptEmail: React.FC<TransactionReceiptEmailProps> = ({
  username,
  amount,
  date,
  transactionId,
  recipient,
  transactionType,
}) => {
  const isIncoming = transactionType === "incoming";
  
  return (
    <Layout>
      <Container>
        <Logo />
        <Heading>
          {isIncoming ? "Payment Received" : "Payment Sent"}
        </Heading>
        <Text>Hello {username || "there"},</Text>
        <Text>
          {isIncoming
            ? "You have received a payment to your Everpay account."
            : `Your payment has been sent${recipient ? ` to ${recipient}` : ""}.`}
        </Text>

        <div style={{ margin: "24px 0", border: "1px solid #eaeaea", borderRadius: "5px", padding: "16px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ padding: "8px 0" }}>Amount:</td>
                <td style={{ padding: "8px 0", textAlign: "right", fontWeight: "bold" }}>
                  ${amount.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0" }}>Date:</td>
                <td style={{ padding: "8px 0", textAlign: "right" }}>{date}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0" }}>Transaction ID:</td>
                <td style={{ padding: "8px 0", textAlign: "right", fontSize: "12px", fontFamily: "monospace" }}>
                  {transactionId}
                </td>
              </tr>
              {recipient && (
                <tr>
                  <td style={{ padding: "8px 0" }}>Recipient:</td>
                  <td style={{ padding: "8px 0", textAlign: "right" }}>{recipient}</td>
                </tr>
              )}
              <tr>
                <td style={{ padding: "8px 0" }}>Status:</td>
                <td style={{ padding: "8px 0", textAlign: "right" }}>
                  <span style={{ 
                    backgroundColor: "#4CAF50", 
                    color: "white", 
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px"
                  }}>
                    Completed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Text>
          Thank you for using Everpay for your financial needs.
        </Text>

        <Text style={{ fontSize: "14px", color: "#666" }}>
          If you didn't make this transaction, please contact our support team immediately.
        </Text>
      </Container>
    </Layout>
  );
};

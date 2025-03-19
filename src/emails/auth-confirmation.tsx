
import * as React from "react";
import { Container } from "./components/Container";
import { Heading } from "./components/Heading";
import { Layout } from "./components/Layout";
import { Logo } from "./components/Logo";
import { Text } from "./components/Text";
import { Button } from "./components/Button";

interface ConfirmationEmailProps {
  confirmationUrl: string;
  username?: string;
}

export const AuthConfirmationEmail: React.FC<ConfirmationEmailProps> = ({
  confirmationUrl,
  username,
}) => {
  return (
    <Layout>
      <Container>
        <Logo />
        <Heading>Confirm your email address</Heading>
        <Text>Hello {username || "there"},</Text>
        <Text>
          Thank you for signing up for Everpay! Please confirm your email address
          by clicking the button below.
        </Text>

        <Button href={confirmationUrl} style={{ backgroundColor: "#1AA47B" }}>
          Confirm your email
        </Button>

        <Text>
          If you didn't sign up for an Everpay account, you can safely ignore this email.
        </Text>

        <Text style={{ fontSize: "14px", color: "#666" }}>
          This link expires in 24 hours and can only be used once.
        </Text>
      </Container>
    </Layout>
  );
};

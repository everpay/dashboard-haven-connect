
import * as React from "react";
import { Container } from "./components/Container";
import { Heading } from "./components/Heading";
import { Layout } from "./components/Layout";
import { Logo } from "./components/Logo";
import { Text } from "./components/Text";
import { Button } from "./components/Button";

interface ResetPasswordEmailProps {
  resetUrl: string;
  username?: string;
}

export const AuthResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({
  resetUrl,
  username,
}) => {
  return (
    <Layout>
      <Container>
        <Logo />
        <Heading>Reset your password</Heading>
        <Text>Hello {username || "there"},</Text>
        <Text>
          Someone requested a password reset for your Everpay account.
          Click the button below to reset your password.
        </Text>

        <Button href={resetUrl} style={{ backgroundColor: "#1AA47B" }}>
          Reset Password
        </Button>

        <Text>
          If you didn't request a password reset, you can safely ignore this email.
        </Text>

        <Text style={{ fontSize: "14px", color: "#666" }}>
          This link expires in 24 hours and can only be used once.
        </Text>
      </Container>
    </Layout>
  );
};

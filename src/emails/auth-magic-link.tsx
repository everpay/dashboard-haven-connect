
import * as React from "react";
import { Container } from "./components/Container";
import { Heading } from "./components/Heading";
import { Layout } from "./components/Layout";
import { Logo } from "./components/Logo";
import { Text } from "./components/Text";
import { Button } from "./components/Button";

interface MagicLinkEmailProps {
  loginUrl: string;
  username?: string;
  token?: string;
}

export const AuthMagicLinkEmail: React.FC<MagicLinkEmailProps> = ({
  loginUrl,
  username,
  token,
}) => {
  return (
    <Layout>
      <Container>
        <Logo />
        <Heading>Login to Everpay</Heading>
        <Text>Hello {username || "there"},</Text>
        <Text>
          Someone requested a magic link to sign in to your Everpay account.
          Click the button below to sign in.
        </Text>

        <Button href={loginUrl} style={{ backgroundColor: "#1AA47B" }}>
          Sign in to Everpay
        </Button>

        {token && (
          <>
            <Text>
              If the button doesn't work, you can also log in using this code:
            </Text>
            <div
              style={{
                background: "#f4f4f4",
                borderRadius: "4px",
                padding: "12px 16px",
                margin: "20px 0",
              }}
            >
              <code style={{ fontWeight: "bold" }}>{token}</code>
            </div>
          </>
        )}

        <Text>
          If you didn't request this email, you can safely ignore it.
        </Text>

        <Text style={{ fontSize: "14px", color: "#666" }}>
          This link expires in 24 hours and can only be used once.
        </Text>
      </Container>
    </Layout>
  );
};

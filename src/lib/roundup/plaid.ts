/**
 * Plaid client wrapper — Phase 1 uses sandbox/development read-only.
 *
 * NEVER calls Plaid Transfer or any write/payment endpoint. If you find yourself
 * needing to wire ACH movement, stop and read compliance_roadmap.md in memory.
 */

import { Configuration, CountryCode, PlaidApi, PlaidEnvironments, Products } from "plaid";

let cachedClient: PlaidApi | null = null;

export function getPlaidClient(): PlaidApi {
  if (cachedClient) return cachedClient;
  const env = process.env.PLAID_ENV ?? "sandbox";
  const config = new Configuration({
    basePath:
      PlaidEnvironments[env as keyof typeof PlaidEnvironments] ??
      PlaidEnvironments.sandbox,
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
        "PLAID-SECRET": process.env.PLAID_SECRET,
        "Plaid-Version": "2020-09-14",
      },
    },
  });
  cachedClient = new PlaidApi(config);
  return cachedClient;
}

export async function createLinkToken(userId: string) {
  const client = getPlaidClient();
  const response = await client.linkTokenCreate({
    user: { client_user_id: userId },
    client_name: "Lumen",
    products: [Products.Transactions],
    country_codes: [CountryCode.Us],
    language: "en",
  });
  return response.data;
}

export async function exchangePublicToken(publicToken: string) {
  const client = getPlaidClient();
  const response = await client.itemPublicTokenExchange({
    public_token: publicToken,
  });
  return response.data;
}

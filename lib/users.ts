import { apiClient } from "@/lib/api-client";
import { isApiConfigured } from "@/lib/config";

export interface UpsertUserInput {
  email: string;
  name: string;
  avatarUrl: string | null;
  cognitoSub: string;
}

export interface UpsertUserResult {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  cognitoSub: string;
}

/**
 * Upsert the shopper/creator user after a Cognito-federated Google sign-in.
 * TODO: always use apiClient.users.upsert once the AWS API is deployed.
 */
export async function upsertUser(input: UpsertUserInput): Promise<UpsertUserResult> {
  if (isApiConfigured) {
    const record = await apiClient.users.upsert(input);
    return {
      id: record.id,
      email: record.email,
      name: record.name,
      avatarUrl: record.avatarUrl,
      cognitoSub: record.cognitoSub,
    };
  }
  console.info("[placeholder] upsert user", input);
  return {
    id: `user-${input.cognitoSub}`,
    ...input,
  };
}

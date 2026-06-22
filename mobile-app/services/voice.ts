import { api } from "./api";

export async function sendVoiceQuery(
  audioBase64: string
) {
  const response = await api.post(
    "/query/voice",
    {
      audioBase64,
    }
  );

  return response.data;
}
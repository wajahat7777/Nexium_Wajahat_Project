import axios from "axios";

export async function getAIResponse(prompt) {
  const { data } = await axios.post("https://your-n8n-instance.com/webhook/ai", { prompt });
  return data;
} 
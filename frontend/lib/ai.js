import axios from "axios";

export async function getAIResponse(prompt) {
  const { data } = await axios.post("http://localhost:5678/webhook/ai", { prompt });
  return data;
} 
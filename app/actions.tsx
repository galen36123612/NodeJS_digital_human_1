"use server";
import OpenAI from "openai";
import { HttpsProxyAgent } from "https-proxy-agent";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  httpAgent: process.env.HTTP_PROXY
    ? new HttpsProxyAgent(process.env.HTTP_PROXY)
    : "",
});

export async function transcribeAudio(data: FormData) {
  try {
    // Convert Blob to File
    const audioBlob = data.get("audioBlob") as Blob;
    const audioFile = new File([audioBlob], "recording.wav", {
      type: "audio/wav",
    });
    const response = await openai.audio.transcriptions.create({
      model: "whisper-1",
      language: "zh",
      file: audioFile,
    });
    const transcription = response.text;

    console.log("Transcription: ", transcription);

    return transcription;
  } catch (error) {
    console.error("Error transcribing audio:", error);
  }
}

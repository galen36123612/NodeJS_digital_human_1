import fetch, { RequestInit } from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";
const proxyUrl = "http://127.0.0.1:7890";
// Replace <proxy_url> with your actual proxy URL

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const HTTP_PROXY = process.env.HTTP_PROXY;

export async function POST() {
  try {
    if (!HEYGEN_API_KEY) {
      throw new Error("API key is missing from .env");
    }

    const opts: RequestInit = {
      method: "POST",
      headers: {
        "x-api-key": HEYGEN_API_KEY,
      },
    };

    if (HTTP_PROXY) {
      console.log(`use http proxy:${HTTP_PROXY}`);
      const agent = new HttpsProxyAgent(HTTP_PROXY);

      opts.agent = agent;
    }
    const res = await fetch(
      "https://api.heygen.com/v1/streaming.create_token",
      opts,
    );
    const data = (await res.json()) as any;

    return new Response(data.data.token, {
      status: 200,
    });
  } catch (error) {
    console.error("Error retrieving access token:", error);

    return new Response("Failed to retrieve access token", {
      status: 500,
    });
  }
}

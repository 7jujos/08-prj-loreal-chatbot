# Project 8: L'Oréal Chatbot

L’Oréal is exploring the power of AI, and your job is to showcase what's possible. Your task is to build a chatbot that helps users discover and understand L’Oréal’s extensive range of products—makeup, skincare, haircare, and fragrances—as well as provide personalized routines and recommendations.

## 🚀 Launch via GitHub Codespaces

1. In the GitHub repo, click the **Code** button and select **Open with Codespaces → New codespace**.
2. Once your codespace is ready, open the `index.html` file via the live preview.

## ☁️ Cloudflare Note

When deploying through Cloudflare, make sure your API request body (in `script.js`) includes a `messages` array and handle the response by extracting `data.choices[0].message.content`.

## Secure Setup Checklist

1. Create a Cloudflare Worker and paste the helper code from `RESOURCE_cloudflare-worker.js`.
2. In the Worker dashboard, add a secret named `OPENAI_API_KEY` under Variables and Secrets.
3. Deploy the Worker and copy the deployed Worker URL.
4. Open `script.js` and set the `WORKER_URL` constant to your deployed URL.
5. Test by asking a L'Oreal beauty question and confirm you get a response.

Important: Do not store API keys in frontend files like `secrets.js`. This project is designed so the key stays only in Cloudflare secrets.

Enjoy building your L’Oréal beauty assistant! 💄

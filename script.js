/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const sendBtn = document.getElementById("sendBtn");
const latestQuestion = document.getElementById("latestQuestion");

/*
  Add your Cloudflare Worker URL below after deployment.
  Example: https://my-loreal-worker.<subdomain>.workers.dev/
*/
const WORKER_URL = "https://calm-fog-e806.7jujos.workers.dev/";

function isWorkerUrlConfigured(url) {
  if (!url) {
    return false;
  }

  const normalized = url.trim().toLowerCase();
  if (normalized.includes("your-worker-url.workers.dev")) {
    return false;
  }

  // Cloudflare Worker URLs should use the workers.dev domain for this project.
  return normalized.includes("workers.dev");
}

// System prompt keeps the assistant focused on beauty + L'Oreal scope.
const systemPrompt =
  "You are a L'Oreal Beauty Advisor. Only answer questions related to L'Oreal products, routines, recommendations, beauty concerns, ingredients, shades, usage tips, and shopping guidance. If the user asks about anything unrelated, politely refuse in 1-2 short sentences and invite them to ask a L'Oreal or beauty question instead. Keep responses friendly, helpful, and concise.";

// We keep the full conversation history here for multi-turn context.
const messages = [{ role: "system", content: systemPrompt }];

// Quick keyword check for common non-beauty questions.
function isBeautyRelated(text) {
  const beautyKeywords = [
    "loreal",
    "l'oreal",
    "skin",
    "skincare",
    "hair",
    "haircare",
    "makeup",
    "foundation",
    "mascara",
    "shampoo",
    "conditioner",
    "fragrance",
    "beauty",
    "routine",
    "serum",
    "cleanser",
    "moisturizer",
    "sunscreen",
    "spf",
    "shade",
    "lipstick",
    "concealer",
    "anti-aging",
    "acne",
    "dry skin",
    "oily skin",
  ];

  const lowerText = text.toLowerCase();
  return beautyKeywords.some((keyword) => lowerText.includes(keyword));
}

// Add one chat bubble to the chat window.
function appendMessage(role, content) {
  const messageEl = document.createElement("p");
  messageEl.classList.add("msg");

  if (role === "user") {
    messageEl.classList.add("user");
  } else if (role === "assistant") {
    messageEl.classList.add("ai");
  } else {
    messageEl.classList.add("system");
  }

  messageEl.textContent = content;
  chatWindow.appendChild(messageEl);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function setLoadingState(isLoading) {
  sendBtn.disabled = isLoading;
  userInput.disabled = isLoading;
}

// Initial assistant greeting.
appendMessage(
  "assistant",
  "Hello! I can help with L'Oreal products, routines, and beauty recommendations.",
);

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const question = userInput.value.trim();
  if (!question) {
    return;
  }

  // Show latest user question above the chat area.
  latestQuestion.textContent = `Latest question: ${question}`;

  // Add user message to the UI + message history.
  appendMessage("user", question);
  messages.push({ role: "user", content: question });

  // Clear the input right away for better UX.
  userInput.value = "";
  setLoadingState(true);

  try {
    if (!isWorkerUrlConfigured(WORKER_URL)) {
      appendMessage(
        "system",
        "Setup needed: set WORKER_URL to your deployed Cloudflare Worker endpoint (it should end with workers.dev).",
      );
      return;
    }

    // If the topic is clearly unrelated, politely refuse immediately.
    if (!isBeautyRelated(question)) {
      const refusal =
        "I can only help with L'Oreal and beauty-related questions. Ask me about products, routines, shades, or skincare goals.";

      appendMessage("assistant", refusal);
      messages.push({ role: "assistant", content: refusal });
      return;
    }

    // Send the full conversation history to your Cloudflare Worker.
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(
        `Request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    // If OpenAI returns an error payload, show that message to the user.
    if (data.error?.message) {
      throw new Error(data.error.message);
    }

    const assistantReply = data.choices?.[0]?.message?.content;

    if (!assistantReply) {
      throw new Error("No assistant message returned from Cloudflare Worker.");
    }

    // Show assistant response and keep it in history.
    appendMessage("assistant", assistantReply);
    messages.push({ role: "assistant", content: assistantReply });
  } catch (error) {
    // Friendly fallback message if something goes wrong.
    appendMessage("system", `Assistant error: ${error.message}`);
    console.error("Cloudflare request error:", error);
  } finally {
    setLoadingState(false);
    userInput.focus();
  }
});

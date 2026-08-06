/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const sendBtn = document.getElementById("sendBtn");
const latestQuestion = document.getElementById("latestQuestion");
const productGrid = document.getElementById("productGrid");
const productSearch = document.getElementById("productSearch");
const categoryFilters = document.getElementById("categoryFilters");
const selectedProductsEl = document.getElementById("selectedProducts");
const generateRoutineBtn = document.getElementById("generateRoutineBtn");
const clearSelectedBtn = document.getElementById("clearSelectedBtn");
const rtlToggle = document.getElementById("rtlToggle");

/*
  Add your Cloudflare Worker URL below after deployment.
  Example: https://my-loreal-worker.<subdomain>.workers.dev/
*/
const WORKER_URL = "https://calm-fog-e806.7jujos.workers.dev/";

// Local storage keys keep selected products and text direction after refresh.
const SELECTED_STORAGE_KEY = "lorealSelectedProducts";
const DIRECTION_STORAGE_KEY = "lorealDirection";

// Real products users can browse and select for routine generation.
const products = [
  {
    id: "revitalift-hyaluronic",
    name: "Revitalift 1.5% Pure Hyaluronic Acid Serum",
    category: "Skincare",
    description:
      "Lightweight face serum with hyaluronic acid that helps hydrate skin and smooth fine lines.",
    keywords: ["hydration", "fine lines", "plumping", "serum", "dry skin"],
    url: "https://www.lorealparisusa.com/skin-care/facial-serums/revitalift-derm-intensives-1-5-pure-hyaluronic-acid-serum",
  },
  {
    id: "revitalift-vitamin-c",
    name: "Revitalift 12% Pure Vitamin C + E + Salicylic Acid Serum",
    category: "Skincare",
    description:
      "Brightening antioxidant serum designed to improve radiance and help reduce dullness over time.",
    keywords: ["brightening", "vitamin c", "dark spots", "glow", "uneven tone"],
    url: "https://www.lorealparisusa.com/skin-care/facial-serums/revitalift-derm-intensives-12-vitamin-c-serum",
  },
  {
    id: "glycolic-cleanser",
    name: "Revitalift Derm Intensives 3.5% Glycolic Acid Cleanser",
    category: "Skincare",
    description:
      "Daily gel cleanser with glycolic acid that gently exfoliates and helps improve skin texture.",
    keywords: ["cleanser", "exfoliation", "texture", "glycolic acid", "pores"],
    url: "https://www.lorealparisusa.com/skin-care/facial-cleansers/revitalift-derm-intensives-3-5-glycolic-acid-cleanser",
  },
  {
    id: "triple-power-moisturizer",
    name: "Revitalift Triple Power Anti-Aging Moisturizer",
    category: "Skincare",
    description:
      "Face moisturizer focused on hydration, firmness, and smoother-looking skin.",
    keywords: [
      "moisturizer",
      "anti-aging",
      "firming",
      "wrinkles",
      "daily cream",
    ],
    url: "https://www.lorealparisusa.com/skin-care/facial-moisturizers/revitalift-triple-power-day-lotion-spf-30",
  },
  {
    id: "bright-reveal-spf50",
    name: "Bright Reveal Broad Spectrum SPF 50 Daily UV Lotion",
    category: "Skincare",
    description:
      "Daily sunscreen lotion with high SPF protection and an elegant lightweight finish.",
    keywords: ["spf", "sunscreen", "uv", "sun protection", "daytime routine"],
    url: "https://www.lorealparisusa.com/skin-care/facial-moisturizers/bright-reveal-dark-spot-exfoliant-peel",
  },
  {
    id: "elvive-hyaluron-plump-shampoo",
    name: "Elvive Hyaluron + Plump Hydrating Shampoo",
    category: "Haircare",
    description:
      "Hydrating shampoo that helps cleanse hair while improving softness and bounce.",
    keywords: ["shampoo", "hydration", "dry hair", "plump", "haircare routine"],
    url: "https://www.lorealparisusa.com/hair-care/shampoo/elvive-hyaluron-plump-hydrating-shampoo",
  },
  {
    id: "elvive-hyaluron-plump-conditioner",
    name: "Elvive Hyaluron + Plump Hydrating Conditioner",
    category: "Haircare",
    description:
      "Moisturizing conditioner created to detangle strands and leave hair feeling fuller.",
    keywords: [
      "conditioner",
      "hydration",
      "detangling",
      "dry hair",
      "soft hair",
    ],
    url: "https://www.lorealparisusa.com/hair-care/conditioner/elvive-hyaluron-plump-hydrating-conditioner",
  },
  {
    id: "dream-lengths-leave-in",
    name: "Elvive Dream Lengths No Haircut Cream Leave-In",
    category: "Haircare",
    description:
      "Leave-in treatment that helps reduce breakage and protect lengths from heat styling.",
    keywords: [
      "leave-in",
      "breakage",
      "long hair",
      "heat protection",
      "repair",
    ],
    url: "https://www.lorealparisusa.com/hair-care/treatments/elvive-dream-lengths-no-haircut-cream-leave-in-conditioner",
  },
  {
    id: "true-match-foundation",
    name: "True Match Super-Blendable Foundation",
    category: "Makeup",
    description:
      "Buildable liquid foundation available in many shades to match undertones more naturally.",
    keywords: [
      "foundation",
      "shade match",
      "buildable",
      "makeup base",
      "coverage",
    ],
    url: "https://www.lorealparisusa.com/makeup/face/foundation-makeup/true-match-super-blendable-foundation",
  },
  {
    id: "infallible-fresh-wear",
    name: "Infallible 24H Fresh Wear Foundation",
    category: "Makeup",
    description:
      "Long-wear foundation with breathable feel and medium-to-full buildable coverage.",
    keywords: ["long wear", "foundation", "24h", "coverage", "makeup"],
    url: "https://www.lorealparisusa.com/makeup/face/foundation-makeup/infallible-up-to-24h-fresh-wear-foundation",
  },
  {
    id: "voluminous-mascara",
    name: "Voluminous Original Mascara",
    category: "Makeup",
    description:
      "Classic mascara that helps build fuller-looking lashes without heavy clumping.",
    keywords: ["mascara", "lashes", "volume", "eye makeup", "length"],
    url: "https://www.lorealparisusa.com/makeup/eye/mascara/voluminous-original-washable-mascara",
  },
  {
    id: "colour-riche-lipstick",
    name: "Colour Riche Satin Lipstick",
    category: "Makeup",
    description:
      "Satin-finish lipstick with rich pigment and a comfortable hydrating feel.",
    keywords: ["lipstick", "satin", "pigment", "lip color", "makeup"],
    url: "https://www.lorealparisusa.com/makeup/lip-color/lipstick/colour-riche-original-satin-lipstick",
  },
];

let selectedProductIds = new Set();
let activeCategory = "All";

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

// System prompt keeps assistant on beauty scope and asks for visible citations.
const systemPrompt =
  "You are a L'Oreal Beauty Advisor. Only answer L'Oreal and beauty-related questions. Keep responses concise and helpful. When you provide product guidance or factual claims, include a short 'Sources' section with visible markdown links pointing to the URLs provided in the user context. If a question is outside beauty scope, politely refuse in 1-2 short sentences and redirect back to L'Oreal beauty topics.";

// We keep full conversation history for multi-turn context.
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

// Convert plain text safely to HTML and turn links into clickable citations.
function formatMessageContent(content) {
  const escaped = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const withMarkdownLinks = escaped.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  return withMarkdownLinks.replace(/\n/g, "<br>");
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

  messageEl.innerHTML = formatMessageContent(content);
  chatWindow.appendChild(messageEl);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function setLoadingState(isLoading) {
  sendBtn.disabled = isLoading;
  userInput.disabled = isLoading;
  generateRoutineBtn.disabled = isLoading;
}

function saveSelections() {
  localStorage.setItem(
    SELECTED_STORAGE_KEY,
    JSON.stringify(Array.from(selectedProductIds)),
  );
}

function loadSelections() {
  const raw = localStorage.getItem(SELECTED_STORAGE_KEY);
  if (!raw) {
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      selectedProductIds = new Set(parsed);
    }
  } catch (error) {
    console.warn("Could not parse saved selections:", error);
  }
}

function getSelectedProducts() {
  return products.filter((product) => selectedProductIds.has(product.id));
}

function toggleProductSelection(productId) {
  if (selectedProductIds.has(productId)) {
    selectedProductIds.delete(productId);
  } else {
    selectedProductIds.add(productId);
  }

  saveSelections();
  renderSelectedProducts();
  renderProducts();
}

function createCategoryButtons() {
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  categoryFilters.innerHTML = "";
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-btn";
    button.textContent = category;
    button.setAttribute("aria-pressed", String(activeCategory === category));

    if (activeCategory === category) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      activeCategory = category;
      createCategoryButtons();
      renderProducts();
    });

    categoryFilters.appendChild(button);
  });
}

function getFilteredProducts() {
  const query = productSearch.value.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;

    const searchableText = [
      product.name,
      product.description,
      product.category,
      product.keywords.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !query || searchableText.includes(query);
    return matchesCategory && matchesSearch;
  });
}

function renderProducts() {
  const filtered = getFilteredProducts();
  productGrid.innerHTML = "";

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent =
      "No products match your search. Try a different keyword.";
    productGrid.appendChild(empty);
    return;
  }

  filtered.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute(
      "aria-pressed",
      String(selectedProductIds.has(product.id)),
    );
    card.setAttribute(
      "aria-label",
      `${product.name}. ${selectedProductIds.has(product.id) ? "Selected" : "Not selected"}. Click to toggle selection.`,
    );

    if (selectedProductIds.has(product.id)) {
      card.classList.add("selected");
    }

    card.innerHTML = `
      <div class="product-head">
        <p class="product-category">${product.category}</p>
        <h4>${product.name}</h4>
      </div>
      <details class="product-details">
        <summary>View description</summary>
        <p>${product.description}</p>
        <p><a href="${product.url}" target="_blank" rel="noopener noreferrer">Official product page</a></p>
      </details>
      <p class="product-keywords">${product.keywords.join(" • ")}</p>
    `;

    card.addEventListener("click", () => {
      toggleProductSelection(product.id);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleProductSelection(product.id);
      }
    });

    const detailsEl = card.querySelector("details");
    detailsEl.addEventListener("click", (event) => {
      // Keep description interaction separate from select toggle.
      event.stopPropagation();
    });

    productGrid.appendChild(card);
  });
}

function renderSelectedProducts() {
  const selectedProducts = getSelectedProducts();
  selectedProductsEl.innerHTML = "";

  if (selectedProducts.length === 0) {
    const placeholder = document.createElement("p");
    placeholder.className = "empty-state";
    placeholder.textContent = "No products selected yet.";
    selectedProductsEl.appendChild(placeholder);
    return;
  }

  selectedProducts.forEach((product) => {
    const tag = document.createElement("button");
    tag.type = "button";
    tag.className = "selected-tag";
    tag.innerHTML = `${product.name} <span aria-hidden="true">✕</span>`;
    tag.setAttribute(
      "aria-label",
      `Remove ${product.name} from selected products`,
    );
    tag.addEventListener("click", () => {
      selectedProductIds.delete(product.id);
      saveSelections();
      renderSelectedProducts();
      renderProducts();
    });
    selectedProductsEl.appendChild(tag);
  });
}

function getRoutineRequestText() {
  const selectedProducts = getSelectedProducts();
  const productContext = selectedProducts
    .map((product) => {
      return `- ${product.name} (${product.category})\n  Description: ${product.description}\n  URL: ${product.url}`;
    })
    .join("\n");

  return `Build a personalized beauty routine using ONLY the selected products below.\n\nSelected products:\n${productContext}\n\nInstructions:\n1. Create a morning and evening routine.\n2. Explain why each product is placed in that order.\n3. Give one beginner-friendly usage tip per product.\n4. End with a short Sources section that cites the exact product URLs with markdown links.`;
}

async function callWorkerWithMessages() {
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
  if (data.error?.message) {
    throw new Error(data.error.message);
  }

  const assistantReply = data.choices?.[0]?.message?.content;
  if (!assistantReply) {
    throw new Error("No assistant message returned from Cloudflare Worker.");
  }

  return assistantReply;
}

async function generateRoutine() {
  const selectedProducts = getSelectedProducts();
  if (selectedProducts.length === 0) {
    appendMessage(
      "system",
      "Select at least one product to generate a routine.",
    );
    return;
  }

  if (!isWorkerUrlConfigured(WORKER_URL)) {
    appendMessage(
      "system",
      "Setup needed: set WORKER_URL to your deployed Cloudflare Worker endpoint (it should end with workers.dev).",
    );
    return;
  }

  latestQuestion.textContent =
    "Latest question: Generate a routine for my selected products.";

  const routineRequest = getRoutineRequestText();
  appendMessage(
    "user",
    "Generate a personalized routine from my selected products.",
  );
  messages.push({ role: "user", content: routineRequest });

  setLoadingState(true);

  try {
    const assistantReply = await callWorkerWithMessages();
    appendMessage("assistant", assistantReply);
    messages.push({ role: "assistant", content: assistantReply });
  } catch (error) {
    appendMessage("system", `Assistant error: ${error.message}`);
    console.error("Cloudflare request error:", error);
  } finally {
    setLoadingState(false);
    userInput.focus();
  }
}

function applyDirection(direction) {
  const normalizedDirection = direction === "rtl" ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", normalizedDirection);
  localStorage.setItem(DIRECTION_STORAGE_KEY, normalizedDirection);

  const isRtl = normalizedDirection === "rtl";
  rtlToggle.setAttribute("aria-pressed", String(isRtl));
  rtlToggle.textContent = isRtl ? "Switch to LTR" : "Switch to RTL";
}

function initializeDirection() {
  const savedDirection = localStorage.getItem(DIRECTION_STORAGE_KEY) || "ltr";
  applyDirection(savedDirection);
}

// Initial assistant greeting.
appendMessage(
  "assistant",
  "Hello! Build your product list, then click Generate Routine for a personalized plan with citations.",
);

// Product list setup.
loadSelections();
createCategoryButtons();
renderProducts();
renderSelectedProducts();
initializeDirection();

productSearch.addEventListener("input", () => {
  renderProducts();
});

clearSelectedBtn.addEventListener("click", () => {
  selectedProductIds.clear();
  saveSelections();
  renderSelectedProducts();
  renderProducts();
});

generateRoutineBtn.addEventListener("click", () => {
  generateRoutine();
});

rtlToggle.addEventListener("click", () => {
  const currentDirection = document.documentElement.getAttribute("dir");
  applyDirection(currentDirection === "rtl" ? "ltr" : "rtl");
});

/* Handle chat form submit */
chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = userInput.value.trim();
  if (!question) {
    return;
  }

  latestQuestion.textContent = `Latest question: ${question}`;
  appendMessage("user", question);
  messages.push({ role: "user", content: question });

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

    if (!isBeautyRelated(question)) {
      const refusal =
        "I can only help with L'Oreal and beauty-related questions. Ask me about products, routines, shades, or skincare goals.";
      appendMessage("assistant", refusal);
      messages.push({ role: "assistant", content: refusal });
      return;
    }

    const selectedProducts = getSelectedProducts();
    if (selectedProducts.length > 0) {
      const selectedContext = selectedProducts
        .map((product) => `${product.name} (${product.url})`)
        .join("\n");

      messages.push({
        role: "user",
        content:
          "Use this selected-product context if relevant to the answer:\n" +
          selectedContext,
      });
    }

    const assistantReply = await callWorkerWithMessages();
    appendMessage("assistant", assistantReply);
    messages.push({ role: "assistant", content: assistantReply });
  } catch (error) {
    appendMessage("system", `Assistant error: ${error.message}`);
    console.error("Cloudflare request error:", error);
  } finally {
    setLoadingState(false);
    userInput.focus();
  }
});

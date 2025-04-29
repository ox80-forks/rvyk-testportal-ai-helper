const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
let OPENROUTER_MODEL = "openai/gpt-4.1-mini";
let OPENROUTER_API_KEY = "";

console.log("[TestPortal Helper] Content script loaded!");

async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["apiKey", "model"], (result) => {
      if (result.apiKey) {
        OPENROUTER_API_KEY = result.apiKey;
        console.log("[TestPortal Helper] API key loaded from settings");
      }

      if (result.model) {
        OPENROUTER_MODEL = result.model;
        console.log(
          "[TestPortal Helper] Model loaded from settings:",
          OPENROUTER_MODEL
        );
      }

      resolve();
    });
  });
}

function saveSettings(settings) {
  return new Promise((resolve) => {
    chrome.storage.sync.set(settings, () => {
      console.log("[TestPortal Helper] Settings saved:", settings);

      if (settings.apiKey) OPENROUTER_API_KEY = settings.apiKey;
      if (settings.model) OPENROUTER_MODEL = settings.model;

      resolve();
    });
  });
}

function checkApiKeyAndConfigure() {
  if (!OPENROUTER_API_KEY) {
    console.log(
      "[TestPortal Helper] Missing API key, displaying configuration"
    );
    createConfigWindow();
    return false;
  }
  return true;
}

function createConfigWindow() {
  if (document.getElementById("tphelper-config")) {
    return;
  }

  const configWindow = document.createElement("div");
  configWindow.id = "tphelper-config";
  configWindow.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 340px;
    padding: 15px;
    background: white;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
    border-radius: 8px;
    z-index: 10000;
    font-family: Arial, sans-serif;
    max-height: 80vh;
    overflow-y: auto;
  `;

  let useWebSearch = localStorage.getItem("tph_web_search") !== "false";
  let useCustomModel = OPENROUTER_MODEL.startsWith("custom:");
  let customModelValue = useCustomModel
    ? OPENROUTER_MODEL.replace("custom:", "")
    : "";

  const models = [
    { id: "openai/gpt-4.1-mini", name: "OpenAI GPT-4.1 Mini" },
    { id: "openai/gpt-4.1", name: "OpenAI GPT-4.1" },
    { id: "openai/gpt-4o-mini", name: "OpenAI GPT-4o Mini" },
    {
      id: "openai/gpt-4o-mini-2024-07-18",
      name: "OpenAI GPT-4o Mini (2024-07-18)",
    },
    {
      id: "openai/gpt-4o-mini-search-preview",
      name: "OpenAI GPT-4o Mini Search Preview",
    },
    { id: "anthropic/claude-3-5-sonnet", name: "Claude 3.5 Sonnet" },
    { id: "anthropic/claude-3-opus", name: "Claude 3 Opus" },
    { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku" },
    { id: "meta-llama/llama-3-70b-instruct", name: "Llama 3 70B" },
    { id: "meta-llama/llama-3-8b-instruct", name: "Llama 3 8B" },
    { id: "perplexity/sonar-pro", name: "Perplexity Sonar Pro" },
    {
      id: "perplexity/sonar-reasoning-pro",
      name: "Perplexity Sonar Reasoning Pro",
    },
    { id: "qwen/qwen3-30b-a3b:free", name: "Qwen 3 30B (free)" },
    {
      id: "google/gemini-2.5-pro-preview-03-25",
      name: "Google Gemini 2.5 Pro Preview",
    },
    {
      id: "google/gemini-2.5-flash-preview",
      name: "Google Gemini 2.5 Flash Preview",
    },
    { id: "_custom", name: "Custom model (specify below)" },
  ];

  configWindow.innerHTML = `
    <h2 style="margin-top: 0; color: #333; font-size: 16px;">TestPortal Helper - Configuration</h2>
    
    <div style="margin-bottom: 12px;">
      <label for="tph-api-key" style="display: block; margin-bottom: 5px; font-size: 14px; color: #555;">
        OpenRouter API Key: <span style="color: red; font-weight: bold;">*</span>
      </label>
      <input type="password" id="tph-api-key" value="${OPENROUTER_API_KEY}" 
        style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid ${
          !OPENROUTER_API_KEY ? "red" : "#ddd"
        }; border-radius: 4px;">
      <small style="display: block; margin-top: 4px; color: #888; font-size: 11px;">
        Required API key from <a href="https://openrouter.ai/keys" target="_blank" style="color: #4285f4;">openrouter.ai/keys</a>
      </small>
    </div>
    
    <div style="margin-bottom: 12px;">
      <label for="tph-model" style="display: block; margin-bottom: 5px; font-size: 14px; color: #555;">
        Model:
      </label>
      <select id="tph-model" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ddd; border-radius: 4px;">
        ${models
          .map(
            (model) =>
              `<option value="${model.id}" ${
                OPENROUTER_MODEL === model.id ||
                (model.id === "_custom" && useCustomModel)
                  ? "selected"
                  : ""
              }>${model.name}</option>`
          )
          .join("")}
      </select>
      <small style="display: block; margin-top: 4px; color: #888; font-size: 11px;">
        Some models may require additional credits.
      </small>
    </div>

    <div id="tph-custom-model-container" style="margin-bottom: 12px; display: ${
      useCustomModel ? "block" : "none"
    };">
      <label for="tph-custom-model" style="display: block; margin-bottom: 5px; font-size: 14px; color: #555;">
        Custom model ID:
      </label>
      <input type="text" id="tph-custom-model" value="${customModelValue}" 
        placeholder="e.g. mistralai/mistral-7b-instruct" 
        style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ddd; border-radius: 4px;">
      <small style="display: block; margin-top: 4px; color: #888; font-size: 11px;">
        Find model IDs at <a href="https://openrouter.ai/models" target="_blank" style="color: #4285f4;">openrouter.ai/models</a>
      </small>
    </div>
    
    <div style="margin-bottom: 12px;">
      <label style="display: flex; align-items: center; font-size: 14px; color: #555;">
        <input type="checkbox" id="tph-web-search" ${
          useWebSearch ? "checked" : ""
        } 
          style="margin-right: 8px;">
        Use web search
      </label>
      <small style="display: block; margin-top: 4px; color: #888; font-size: 11px;">
        Search plugin costs $4 per 1000 results.
      </small>
    </div>
    
    <div style="display: flex; justify-content: space-between;">
      <button id="tph-save-config" style="background: #4CAF50; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">
        Save
      </button>
      <button id="tph-cancel-config" style="background: #f44336; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">
        Cancel
      </button>
    </div>
  `;

  document.body.appendChild(configWindow);

  document.getElementById("tph-model").addEventListener("change", (e) => {
    const customModelContainer = document.getElementById(
      "tph-custom-model-container"
    );
    if (e.target.value === "_custom") {
      customModelContainer.style.display = "block";
    } else {
      customModelContainer.style.display = "none";
    }
  });

  document.getElementById("tph-save-config").addEventListener("click", () => {
    const apiKey = document.getElementById("tph-api-key").value;

    if (!apiKey.trim()) {
      alert("API key is required for the extension to work!");
      document.getElementById("tph-api-key").style.border = "1px solid red";
      return;
    }

    let model = document.getElementById("tph-model").value;

    if (model === "_custom") {
      const customModel = document
        .getElementById("tph-custom-model")
        .value.trim();
      if (!customModel) {
        alert("Please enter a custom model ID!");
        document.getElementById("tph-custom-model").style.border =
          "1px solid red";
        return;
      }
      model = "custom:" + customModel;
    }

    const useWebSearch = document.getElementById("tph-web-search").checked;

    localStorage.setItem("tph_web_search", useWebSearch);

    saveSettings({ apiKey, model }).then(() => {
      alert("Settings saved!");
      configWindow.remove();
    });
  });

  document.getElementById("tph-cancel-config").addEventListener("click", () => {
    if (!OPENROUTER_API_KEY) {
      alert(
        "Warning: Without an API key, the extension will not work properly."
      );
    }
    configWindow.remove();
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openConfig") {
    createConfigWindow();
    sendResponse({ success: true });
  }
  return true;
});

function debugPageState() {
  console.log("[TestPortal Helper] DEBUG: Current URL:", window.location.href);
  console.log("[TestPortal Helper] DEBUG: Title:", document.title);
  console.log(
    "[TestPortal Helper] DEBUG: question_essence:",
    !!document.querySelector(".question_essence")
  );
}

function getQuizData() {
  console.log("[TestPortal Helper] Getting quiz data...");
  debugPageState();

  let question = "";
  const questionElement =
    document.querySelector(".question_essence") ||
    document.querySelector(".problem-content");

  if (questionElement) {
    question = questionElement.innerHTML || "";
    question = question.replace(/\s+/g, " ").trim();
  }

  const answerElements =
    document.querySelectorAll(".answer_body p") ||
    document.querySelectorAll(".answer_body") ||
    document.querySelectorAll(".answer-content");

  const answers = Array.from(answerElements)
    .map((el) => el.innerText || "")
    .filter((text) => text.trim() !== "");

  let imageUrl = null;
  const img =
    document.querySelector(".question_essence img") ||
    document.querySelector(".problem-content img");

  if (img && img.src) {
    imageUrl = img.src;
    console.log("[TestPortal Helper] Found image:", imageUrl);
  }

  let questionType = "SINGLE_ANSWER";
  const typeInput = document.querySelector(
    'input[name="givenAnswer.questionType"]'
  );

  if (typeInput) {
    questionType = typeInput.value;
  } else {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    if (checkboxes.length > 0) {
      questionType = "MULTI_ANSWER";
    } else if (document.querySelector('input[type="text"]')) {
      questionType = "SHORT_ANSWER";
    }
  }

  console.log("[TestPortal Helper] Question type:", questionType);
  console.log("[TestPortal Helper] Question:", question);
  console.log("[TestPortal Helper] Answers:", answers);

  if (!question || answers.length === 0) {
    console.warn(
      "[TestPortal Helper] Failed to properly retrieve question or answers!"
    );
    return null;
  }

  return { question, answers, questionType, imageUrl };
}

async function analyzeQuestion(data) {
  try {
    if (!data) {
      console.error("[TestPortal Helper] No data to analyze!");
      return [];
    }

    if (!checkApiKeyAndConfigure()) {
      console.error("[TestPortal Helper] Missing API key, analysis stopped!");
      return [];
    }

    const isMulti = data.questionType === "MULTI_ANSWER";
    const isShort = data.questionType === "SHORT_ANSWER";
    const hasImage = !!data.imageUrl;

    let pageTitle = "";
    const titleElement = document.querySelector(
      "body > div.header-test-wrap > div > div > div.test-name-line > span"
    );

    if (titleElement && titleElement.textContent) {
      pageTitle = titleElement.textContent.trim();
      console.log("[TestPortal Helper] Test title from element:", pageTitle);
    } else {
      pageTitle = document.title || "";
      pageTitle = pageTitle
        .replace(/\s*[-–|]\s*TestPortal(\.\w+)?$/i, "")
        .replace(/^Test:\s*/i, "")
        .replace(/^Egzamin:\s*/i, "")
        .replace(/\s*\(\d+\/\d+\)$/, "")
        .trim();
      console.log(
        "[TestPortal Helper] Test title from document.title (fallback):",
        pageTitle
      );
    }

    const tempElement = document.createElement("div");
    tempElement.innerHTML = data.question;
    const questionText =
      tempElement.textContent || tempElement.innerText || data.question;

    const searchInstruction =
      "IMPORTANT: Find the answer to this question using web search. " +
      "Think carefully about your reasoning, analyzing each possible answer before making a decision. " +
      "Don't answer too quickly, consider possible interpretations of the question and context.";

    const responseFormatInstruction = isShort
      ? 'Return your answer in the following JSON format: { "answer": "correct answer", "reasoning": "brief explanation" }'
      : isMulti
      ? 'Return your answer in the following JSON format: { "answers": [numbers of correct answers], "reasoning": "brief explanation" }'
      : 'Return your answer in the following JSON format: { "answer": number of correct answer, "reasoning": "brief explanation" }';

    const prompt = isShort
      ? `Test title: ${pageTitle}\n${searchInstruction}\nAnswer the quiz question. ${responseFormatInstruction}\nQuestion: ${questionText}${
          hasImage ? `\nImage: ${data.imageUrl}` : ""
        }`
      : isMulti
      ? `Test title: ${pageTitle}\n${searchInstruction}\nAnswer the quiz question and indicate all correct answers. ${responseFormatInstruction}\nQuestion: ${questionText}${
          hasImage ? `\nImage: ${data.imageUrl}` : ""
        }\nAnswers:\n${data.answers.map((a, i) => `${i + 1}. ${a}`).join("\n")}`
      : `Test title: ${pageTitle}\n${searchInstruction}\nAnswer the quiz question and indicate the correct answer. ${responseFormatInstruction}\nQuestion: ${questionText}${
          hasImage ? `\nImage: ${data.imageUrl}` : ""
        }\nAnswers:\n${data.answers
          .map((a, i) => `${i + 1}. ${a}`)
          .join("\n")}`;

    console.log("[TestPortal Helper] Sending request to OpenRouter AI...");
    console.log("[TestPortal Helper] Prompt:", prompt);

    if (!OPENROUTER_API_KEY) {
      console.error(
        "[TestPortal Helper] ERROR: API key not set. Enter your key in the extension settings."
      );
      alert(
        "TestPortal Helper: API key not set. Please enter your key in the extension settings."
      );
      createConfigWindow();
      return [];
    }

    const useWebSearch = localStorage.getItem("tph_web_search") !== "false";
    console.log(
      "[TestPortal Helper] Web search:",
      useWebSearch ? "enabled" : "disabled"
    );

    let modelToUse = OPENROUTER_MODEL;
    if (OPENROUTER_MODEL.startsWith("custom:")) {
      modelToUse = OPENROUTER_MODEL.replace("custom:", "");
      console.log("[TestPortal Helper] Using custom model:", modelToUse);
    }

    const requestOptions = {
      model: modelToUse,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    };

    if (useWebSearch) {
      requestOptions.plugins = [
        {
          id: "web",
          search_prompt: `${pageTitle} - ${questionText}`,
        },
      ];
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "TestPortal Helper",
      },
      body: JSON.stringify(requestOptions),
    });

    const result = await response.json();
    console.log("[TestPortal Helper] AI response:", result);

    if (result.choices?.[0]?.message?.content_sources) {
      console.log(
        "[TestPortal Helper] Web search sources:",
        result.choices[0].message.content_sources
      );
    }

    if (result.error) {
      throw new Error(`API error: ${result.error.message || "Unknown error"}`);
    }

    const aiText = result.choices?.[0]?.message?.content?.trim();
    if (!aiText) {
      throw new Error("No AI response");
    }

    console.log("[TestPortal Helper] Response text:", aiText);
    return parseAIResponse(aiText, data);
  } catch (error) {
    console.error("[TestPortal Helper] Analysis error:", error);
    return [];
  }
}

function parseAIResponse(aiText, data) {
  const isMulti = data.questionType === "MULTI_ANSWER";
  const isShort = data.questionType === "SHORT_ANSWER";

  if (isShort) {
    return [];
  }

  try {
    const jsonResponse = JSON.parse(aiText);
    console.log("[TestPortal Helper] JSON format response:", jsonResponse);

    if (isMulti && Array.isArray(jsonResponse.answers)) {
      return jsonResponse.answers
        .map((num) => (typeof num === "number" ? num - 1 : parseInt(num) - 1))
        .filter((idx) => !isNaN(idx) && idx >= 0 && idx < data.answers.length);
    } else if (!isMulti && jsonResponse.answer) {
      const answer =
        typeof jsonResponse.answer === "number"
          ? jsonResponse.answer - 1
          : parseInt(jsonResponse.answer) - 1;

      if (!isNaN(answer) && answer >= 0 && answer < data.answers.length) {
        return [answer];
      }
    }

    console.log(
      "[TestPortal Helper] Could not extract indices from JSON, trying traditional method"
    );
  } catch (e) {
    console.log(
      "[TestPortal Helper] Response is not valid JSON, trying traditional method:",
      e
    );
  }

  const numberPattern = /\b(\d+)\b/g;
  const matches = [...aiText.matchAll(numberPattern)];
  const correctIndexes = matches
    .map((match) => parseInt(match[1]) - 1)
    .filter((idx) => idx >= 0 && idx < data.answers.length);

  console.log("[TestPortal Helper] Found answer indices:", correctIndexes);

  if (correctIndexes.length === 0) {
    console.log("[TestPortal Helper] No numbers found, trying text matching");

    const normalizedAnswers = data.answers.map((answer) =>
      answer.toLowerCase().replace(/^(\s|&nbsp;)+|(\s|&nbsp;)+$/g, "")
    );

    const aiTextLower = aiText.toLowerCase();

    return data.answers
      .map((answer, idx) => {
        const cleanAnswer = normalizedAnswers[idx];

        if (
          aiTextLower.includes(cleanAnswer) ||
          (cleanAnswer.length > 5 &&
            aiTextLower.includes(
              cleanAnswer.substring(0, cleanAnswer.length - 2)
            )) ||
          cleanAnswer
            .split(/\s+/)
            .some((word) => word.length > 4 && aiTextLower.includes(word))
        ) {
          console.log(
            `[TestPortal Helper] Found match for answer ${
              idx + 1
            }: "${cleanAnswer}"`
          );
          return idx;
        }
        return -1;
      })
      .filter((idx) => idx !== -1);
  }

  return correctIndexes;
}

function boldFirstLetters(correctIndexes) {
  if (!correctIndexes || correctIndexes.length === 0) return;

  console.log(
    "[TestPortal Helper] Bolding first letters for answers:",
    correctIndexes
  );

  const answerElements =
    document.querySelectorAll(".answer_body p") ||
    document.querySelectorAll(".answer_body") ||
    document.querySelectorAll(".answer-content");

  if (answerElements.length === 0) {
    console.warn("[TestPortal Helper] No answer elements found for bolding!");
    return;
  }

  correctIndexes.forEach((idx) => {
    if (idx >= 0 && idx < answerElements.length) {
      const element = answerElements[idx];

      const originalHtml = element.innerHTML;

      let html = element.innerHTML;

      if (html.includes("<strong>")) {
        console.log(
          `[TestPortal Helper] Answer ${
            idx + 1
          } already contains bold formatting, skipping.`
        );
        return;
      }

      html = html.replace(/^(\s|&nbsp;)+/i, "");

      if (html.length > 0) {
        const firstChar = html.charAt(0);
        const restOfHtml = html.substring(1);

        const whitespacesMatch = originalHtml.match(/^(\s|&nbsp;)+/i);
        const leadingWhitespaces = whitespacesMatch ? whitespacesMatch[0] : "";

        element.innerHTML = `${leadingWhitespaces}<strong>${firstChar}</strong>${restOfHtml}`;

        console.log(
          `[TestPortal Helper] Bolded first letter of answer ${
            idx + 1
          }. Before: "${originalHtml}", After: "${element.innerHTML}"`
        );
      } else {
        console.warn(
          `[TestPortal Helper] Cannot bold answer ${
            idx + 1
          } - empty text after removing whitespace`
        );
      }
    }
  });
}

async function observeQuestions() {
  console.log("[TestPortal Helper] Starting question observation...");

  await loadSettings();

  if (!OPENROUTER_API_KEY) {
    console.log(
      "[TestPortal Helper] Missing API key, displaying configuration window"
    );
    createConfigWindow();

    const infoMessage = document.createElement("div");
    infoMessage.style.cssText = `
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: #4285f4;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 9998;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      font-family: Arial, sans-serif;
    `;
    infoMessage.innerHTML = "Enter OpenRouter API key to use TestPortal Helper";
    document.body.appendChild(infoMessage);

    setTimeout(() => {
      if (infoMessage.parentNode) {
        infoMessage.parentNode.removeChild(infoMessage);
      }
    }, 5000);
  }

  const isTestPage =
    window.location.href.includes("DoTest") ||
    window.location.href.includes("exam") ||
    document.querySelector(".question-container") ||
    document.querySelector(".question_essence");

  if (!isTestPage) {
    console.log(
      "[TestPortal Helper] Test page not detected. Waiting for test to load..."
    );
  }

  const observer = new MutationObserver(async (mutations) => {
    const questionContainer =
      document.querySelector(".question-container") ||
      document.querySelector(".question_essence");

    if (!questionContainer) return;

    if (!questionContainer.dataset.tpHelperProcessed) {
      console.log("[TestPortal Helper] New question detected!");
      questionContainer.dataset.tpHelperProcessed = "true";

      setTimeout(async () => {
        const quizData = getQuizData();

        if (quizData) {
          const correctIndexes = await analyzeQuestion(quizData);
          boldFirstLetters(correctIndexes);
        }
      }, 1000);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });

  const questionContainer =
    document.querySelector(".question-container") ||
    document.querySelector(".question_essence");

  if (questionContainer && !questionContainer.dataset.tpHelperProcessed) {
    console.log("[TestPortal Helper] Found question on page!");
    questionContainer.dataset.tpHelperProcessed = "true";

    setTimeout(async () => {
      const quizData = getQuizData();

      if (quizData) {
        analyzeQuestion(quizData).then((correctIndexes) => {
          boldFirstLetters(correctIndexes);
        });
      }
    }, 1000);
  } else {
    console.log(
      "[TestPortal Helper] No question found on page, observing DOM changes..."
    );
    debugPageState();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", observeQuestions);
} else {
  observeQuestions();
}

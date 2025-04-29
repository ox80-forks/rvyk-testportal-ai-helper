const E="https://openrouter.ai/api/v1/chat/completions";let d="openai/gpt-4.1-mini",u="";console.log("[TestPortal Helper] Content script loaded!");async function _(){return new Promise(e=>{chrome.storage.sync.get(["apiKey","model"],o=>{o.apiKey&&(u=o.apiKey,console.log("[TestPortal Helper] API key loaded from settings")),o.model&&(d=o.model,console.log("[TestPortal Helper] Model loaded from settings:",d)),e()})})}function O(e){return new Promise(o=>{chrome.storage.sync.set(e,()=>{console.log("[TestPortal Helper] Settings saved:",e),e.apiKey&&(u=e.apiKey),e.model&&(d=e.model),o()})})}function R(){return u?!0:(console.log("[TestPortal Helper] Missing API key, displaying configuration"),f(),!1)}function f(){if(document.getElementById("tphelper-config"))return;const e=document.createElement("div");e.id="tphelper-config",e.style.cssText=`
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
  `;let o=localStorage.getItem("tph_web_search")!=="false",l=d.startsWith("custom:"),s=l?d.replace("custom:",""):"";const a=[{id:"openai/gpt-4.1-mini",name:"OpenAI GPT-4.1 Mini"},{id:"openai/gpt-4.1",name:"OpenAI GPT-4.1"},{id:"openai/gpt-4o-mini",name:"OpenAI GPT-4o Mini"},{id:"openai/gpt-4o-mini-2024-07-18",name:"OpenAI GPT-4o Mini (2024-07-18)"},{id:"openai/gpt-4o-mini-search-preview",name:"OpenAI GPT-4o Mini Search Preview"},{id:"anthropic/claude-3-5-sonnet",name:"Claude 3.5 Sonnet"},{id:"anthropic/claude-3-opus",name:"Claude 3 Opus"},{id:"anthropic/claude-3-haiku",name:"Claude 3 Haiku"},{id:"meta-llama/llama-3-70b-instruct",name:"Llama 3 70B"},{id:"meta-llama/llama-3-8b-instruct",name:"Llama 3 8B"},{id:"perplexity/sonar-pro",name:"Perplexity Sonar Pro"},{id:"perplexity/sonar-reasoning-pro",name:"Perplexity Sonar Reasoning Pro"},{id:"qwen/qwen3-30b-a3b:free",name:"Qwen 3 30B (free)"},{id:"google/gemini-2.5-pro-preview-03-25",name:"Google Gemini 2.5 Pro Preview"},{id:"google/gemini-2.5-flash-preview",name:"Google Gemini 2.5 Flash Preview"},{id:"_custom",name:"Custom model (specify below)"}];e.innerHTML=`
    <h2 style="margin-top: 0; color: #333; font-size: 16px;">TestPortal Helper - Configuration</h2>
    
    <div style="margin-bottom: 12px;">
      <label for="tph-api-key" style="display: block; margin-bottom: 5px; font-size: 14px; color: #555;">
        OpenRouter API Key: <span style="color: red; font-weight: bold;">*</span>
      </label>
      <input type="password" id="tph-api-key" value="${u}" 
        style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid ${u?"#ddd":"red"}; border-radius: 4px;">
      <small style="display: block; margin-top: 4px; color: #888; font-size: 11px;">
        Required API key from <a href="https://openrouter.ai/keys" target="_blank" style="color: #4285f4;">openrouter.ai/keys</a>
      </small>
    </div>
    
    <div style="margin-bottom: 12px;">
      <label for="tph-model" style="display: block; margin-bottom: 5px; font-size: 14px; color: #555;">
        Model:
      </label>
      <select id="tph-model" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ddd; border-radius: 4px;">
        ${a.map(n=>`<option value="${n.id}" ${d===n.id||n.id==="_custom"&&l?"selected":""}>${n.name}</option>`).join("")}
      </select>
      <small style="display: block; margin-top: 4px; color: #888; font-size: 11px;">
        Some models may require additional credits.
      </small>
    </div>

    <div id="tph-custom-model-container" style="margin-bottom: 12px; display: ${l?"block":"none"};">
      <label for="tph-custom-model" style="display: block; margin-bottom: 5px; font-size: 14px; color: #555;">
        Custom model ID:
      </label>
      <input type="text" id="tph-custom-model" value="${s}" 
        placeholder="e.g. mistralai/mistral-7b-instruct" 
        style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ddd; border-radius: 4px;">
      <small style="display: block; margin-top: 4px; color: #888; font-size: 11px;">
        Find model IDs at <a href="https://openrouter.ai/models" target="_blank" style="color: #4285f4;">openrouter.ai/models</a>
      </small>
    </div>
    
    <div style="margin-bottom: 12px;">
      <label style="display: flex; align-items: center; font-size: 14px; color: #555;">
        <input type="checkbox" id="tph-web-search" ${o?"checked":""} 
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
  `,document.body.appendChild(e),document.getElementById("tph-model").addEventListener("change",n=>{const i=document.getElementById("tph-custom-model-container");n.target.value==="_custom"?i.style.display="block":i.style.display="none"}),document.getElementById("tph-save-config").addEventListener("click",()=>{const n=document.getElementById("tph-api-key").value;if(!n.trim()){alert("API key is required for the extension to work!"),document.getElementById("tph-api-key").style.border="1px solid red";return}let i=document.getElementById("tph-model").value;if(i==="_custom"){const t=document.getElementById("tph-custom-model").value.trim();if(!t){alert("Please enter a custom model ID!"),document.getElementById("tph-custom-model").style.border="1px solid red";return}i="custom:"+t}const r=document.getElementById("tph-web-search").checked;localStorage.setItem("tph_web_search",r),O({apiKey:n,model:i}).then(()=>{alert("Settings saved!"),e.remove()})}),document.getElementById("tph-cancel-config").addEventListener("click",()=>{u||alert("Warning: Without an API key, the extension will not work properly."),e.remove()})}chrome.runtime.onMessage.addListener((e,o,l)=>(e.action==="openConfig"&&(f(),l({success:!0})),!0));function $(){console.log("[TestPortal Helper] DEBUG: Current URL:",window.location.href),console.log("[TestPortal Helper] DEBUG: Title:",document.title),console.log("[TestPortal Helper] DEBUG: question_essence:",!!document.querySelector(".question_essence"))}function A(){console.log("[TestPortal Helper] Getting quiz data..."),$();let e="";const o=document.querySelector(".question_essence p")||document.querySelector(".question_essence")||document.querySelector(".problem-content");o&&(e=o.innerText||"");const l=document.querySelectorAll(".answer_body p")||document.querySelectorAll(".answer_body")||document.querySelectorAll(".answer-content"),s=Array.from(l).map(t=>t.innerText||"").filter(t=>t.trim()!=="");let a=null;const n=document.querySelector(".question_essence img")||document.querySelector(".problem-content img");n&&n.src&&(a=n.src,console.log("[TestPortal Helper] Found image:",a));let i="SINGLE_ANSWER";const r=document.querySelector('input[name="givenAnswer.questionType"]');return r?i=r.value:document.querySelectorAll('input[type="checkbox"]').length>0?i="MULTI_ANSWER":document.querySelector('input[type="text"]')&&(i="SHORT_ANSWER"),console.log("[TestPortal Helper] Question type:",i),console.log("[TestPortal Helper] Question:",e),console.log("[TestPortal Helper] Answers:",s),!e||s.length===0?(console.warn("[TestPortal Helper] Failed to properly retrieve question or answers!"),null):{question:e,answers:s,questionType:i,imageUrl:a}}async function v(e){var o,l,s,a,n,i,r;try{if(!e)return console.error("[TestPortal Helper] No data to analyze!"),[];if(!R())return console.error("[TestPortal Helper] Missing API key, analysis stopped!"),[];const t=e.questionType==="MULTI_ANSWER",p=e.questionType==="SHORT_ANSWER",m=!!e.imageUrl;let c="";const g=document.querySelector("body > div.header-test-wrap > div > div > div.test-name-line > span");g&&g.textContent?(c=g.textContent.trim(),console.log("[TestPortal Helper] Test title from element:",c)):(c=document.title||"",c=c.replace(/\s*[-–|]\s*TestPortal(\.\w+)?$/i,"").replace(/^Test:\s*/i,"").replace(/^Egzamin:\s*/i,"").replace(/\s*\(\d+\/\d+\)$/,"").trim(),console.log("[TestPortal Helper] Test title from document.title (fallback):",c));const h="IMPORTANT: Find the answer to this question using web search. Think carefully about your reasoning, analyzing each possible answer before making a decision. Don't answer too quickly, consider possible interpretations of the question and context.",b=p?'Return your answer in the following JSON format: { "answer": "correct answer", "reasoning": "brief explanation" }':t?'Return your answer in the following JSON format: { "answers": [numbers of correct answers], "reasoning": "brief explanation" }':'Return your answer in the following JSON format: { "answer": number of correct answer, "reasoning": "brief explanation" }',q=p?`Test title: ${c}
${h}
Answer the quiz question. ${b}
Question: ${e.question}${m?`
Image: ${e.imageUrl}`:""}`:t?`Test title: ${c}
${h}
Answer the quiz question and indicate all correct answers. ${b}
Question: ${e.question}${m?`
Image: ${e.imageUrl}`:""}
Answers:
${e.answers.map((P,x)=>`${x+1}. ${P}`).join(`
`)}`:`Test title: ${c}
${h}
Answer the quiz question and indicate the correct answer. ${b}
Question: ${e.question}${m?`
Image: ${e.imageUrl}`:""}
Answers:
${e.answers.map((P,x)=>`${x+1}. ${P}`).join(`
`)}`;if(console.log("[TestPortal Helper] Sending request to OpenRouter AI..."),console.log("[TestPortal Helper] Prompt:",q),!u)return console.error("[TestPortal Helper] ERROR: API key not set. Enter your key in the extension settings."),alert("TestPortal Helper: API key not set. Please enter your key in the extension settings."),f(),[];const S=localStorage.getItem("tph_web_search")!=="false";console.log("[TestPortal Helper] Web search:",S?"enabled":"disabled");let w=d;d.startsWith("custom:")&&(w=d.replace("custom:",""),console.log("[TestPortal Helper] Using custom model:",w));const H={model:w,messages:[{role:"user",content:q}],temperature:.7,response_format:{type:"json_object"}};S&&(H.plugins=[{id:"web",search_prompt:`${c} - ${e.question}`}]);const y=await(await fetch(E,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${u}`,"HTTP-Referer":window.location.origin,"X-Title":"TestPortal Helper"},body:JSON.stringify(H)})).json();if(console.log("[TestPortal Helper] AI response:",y),(s=(l=(o=y.choices)==null?void 0:o[0])==null?void 0:l.message)!=null&&s.content_sources&&console.log("[TestPortal Helper] Web search sources:",y.choices[0].message.content_sources),y.error)throw new Error(`API error: ${y.error.message||"Unknown error"}`);const T=(r=(i=(n=(a=y.choices)==null?void 0:a[0])==null?void 0:n.message)==null?void 0:i.content)==null?void 0:r.trim();if(!T)throw new Error("No AI response");return console.log("[TestPortal Helper] Response text:",T),M(T,e)}catch(t){return console.error("[TestPortal Helper] Analysis error:",t),[]}}function M(e,o){const l=o.questionType==="MULTI_ANSWER";if(o.questionType==="SHORT_ANSWER")return[];try{const r=JSON.parse(e);if(console.log("[TestPortal Helper] JSON format response:",r),l&&Array.isArray(r.answers))return r.answers.map(t=>typeof t=="number"?t-1:parseInt(t)-1).filter(t=>!isNaN(t)&&t>=0&&t<o.answers.length);if(!l&&r.answer){const t=typeof r.answer=="number"?r.answer-1:parseInt(r.answer)-1;if(!isNaN(t)&&t>=0&&t<o.answers.length)return[t]}console.log("[TestPortal Helper] Could not extract indices from JSON, trying traditional method")}catch(r){console.log("[TestPortal Helper] Response is not valid JSON, trying traditional method:",r)}const a=/\b(\d+)\b/g,i=[...e.matchAll(a)].map(r=>parseInt(r[1])-1).filter(r=>r>=0&&r<o.answers.length);if(console.log("[TestPortal Helper] Found answer indices:",i),i.length===0){console.log("[TestPortal Helper] No numbers found, trying text matching");const r=o.answers.map(p=>p.toLowerCase().replace(/^(\s|&nbsp;)+|(\s|&nbsp;)+$/g,"")),t=e.toLowerCase();return o.answers.map((p,m)=>{const c=r[m];return t.includes(c)||c.length>5&&t.includes(c.substring(0,c.length-2))||c.split(/\s+/).some(g=>g.length>4&&t.includes(g))?(console.log(`[TestPortal Helper] Found match for answer ${m+1}: "${c}"`),m):-1}).filter(p=>p!==-1)}return i}function I(e){if(!e||e.length===0)return;console.log("[TestPortal Helper] Bolding first letters for answers:",e);const o=document.querySelectorAll(".answer_body p")||document.querySelectorAll(".answer_body")||document.querySelectorAll(".answer-content");if(o.length===0){console.warn("[TestPortal Helper] No answer elements found for bolding!");return}e.forEach(l=>{if(l>=0&&l<o.length){const s=o[l],a=s.innerHTML;let n=s.innerHTML;if(n.includes("<strong>")){console.log(`[TestPortal Helper] Answer ${l+1} already contains bold formatting, skipping.`);return}if(n=n.replace(/^(\s|&nbsp;)+/i,""),n.length>0){const i=n.charAt(0),r=n.substring(1),t=a.match(/^(\s|&nbsp;)+/i),p=t?t[0]:"";s.innerHTML=`${p}<strong>${i}</strong>${r}`,console.log(`[TestPortal Helper] Bolded first letter of answer ${l+1}. Before: "${a}", After: "${s.innerHTML}"`)}else console.warn(`[TestPortal Helper] Cannot bold answer ${l+1} - empty text after removing whitespace`)}})}async function k(){if(console.log("[TestPortal Helper] Starting question observation..."),await _(),!u){console.log("[TestPortal Helper] Missing API key, displaying configuration window"),f();const s=document.createElement("div");s.style.cssText=`
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
    `,s.innerHTML="Enter OpenRouter API key to use TestPortal Helper",document.body.appendChild(s),setTimeout(()=>{s.parentNode&&s.parentNode.removeChild(s)},5e3)}window.location.href.includes("DoTest")||window.location.href.includes("exam")||document.querySelector(".question-container")||document.querySelector(".question_essence")||console.log("[TestPortal Helper] Test page not detected. Waiting for test to load..."),new MutationObserver(async s=>{const a=document.querySelector(".question-container")||document.querySelector(".question_essence");a&&(a.dataset.tpHelperProcessed||(console.log("[TestPortal Helper] New question detected!"),a.dataset.tpHelperProcessed="true",setTimeout(async()=>{const n=A();if(n){const i=await v(n);I(i)}},1e3)))}).observe(document.body,{childList:!0,subtree:!0,attributes:!0,characterData:!0});const l=document.querySelector(".question-container")||document.querySelector(".question_essence");l&&!l.dataset.tpHelperProcessed?(console.log("[TestPortal Helper] Found question on page!"),l.dataset.tpHelperProcessed="true",setTimeout(async()=>{const s=A();s&&v(s).then(a=>{I(a)})},1e3)):(console.log("[TestPortal Helper] No question found on page, observing DOM changes..."),$())}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",k):k();

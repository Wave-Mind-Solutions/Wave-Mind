/**
 * WaveMind AI - Main Application Logic
 * Full interactive agentic AI interface, speech recognition, live sandbox preview,
 * cost calculator, visual workflow builder, mobile planner & auth system.
 */

document.addEventListener('DOMContentLoaded', () => {
  setupHeaderScroll();
  setupMobileMenu();
  setupNavigationSpy();
  setupThemeToggle();
  setupAuthModal();
  setupAgenticAIConsole();
  setupFeatureCardsAndChips();
  setupPricingCalculator();
  setupSandboxPreview();
  setupWorkflowBuilder();
  setupMobileStrategyPlanner();
  setupContactFormValidation();
  setupInterviewerShowcaseModal();
  setupParticleCanvas();
  setupPromptTemplatesModal();
  setupKeyboardShortcutsAndFAB();
  setupAITelemetryCharts();
  setupNewsletterForm();
  setupFAQAccordion();
  setupAPIConfigHandler();
  setupThreadHistoryUI();
});

// ══════════════════════════════════════════════════════════════════════════════
// 🔑 LLM API CONFIGURATION (PASTE YOUR API KEY DIRECTLY HERE)
// ══════════════════════════════════════════════════════════════════════════════
const DIRECT_API_KEY = 'AIzaSyAqlvab1e0I-Ri4_TbG5l0T5gYJJ8jjAjk'; // <-- Paste your API Key here (e.g., 'AIzaSy...' or 'sk-proj-...')
const DIRECT_API_PROVIDER = 'gemini'; // <-- Set provider: 'gemini' or 'openai'

/**
 * Global App State
 */
const state = {
  isLoggedIn: false,
  userName: '',
  userEmail: '',
  activeChatHistory: [],
  pastThreads: [],
  activeThreadId: null,
  attachedFiles: [],
  attachedImages: [],
  isRecordingVoice: false,
  speechRecognition: null
};

/**
 * 1. Header Scroll Effect
 */
function setupHeaderScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

/**
 * 2. Mobile Menu Toggle
 */
function setupMobileMenu() {
  const toggleBtn = document.getElementById('menu-toggle-btn');
  const navMenu = document.getElementById('nav-menu');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      toggleBtn.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

/**
 * 3. Navigation Spy & Active Link Switcher
 */
function setupNavigationSpy() {
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-item');

  const onScroll = () => {
    let currentSectionId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentSectionId}`) {
          item.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', onScroll);
}

/**
 * 4. Theme Toggle (Dark / Light)
 */
function setupThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const toggleIcon = document.getElementById('theme-toggle-icon');
  if (!toggleBtn || !toggleIcon) return;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
    toggleIcon.textContent = '🌙';
  } else {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
    toggleIcon.textContent = '☀️';
  }

  toggleBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    if (isLight) {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
      toggleIcon.textContent = '🌙';
    } else {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      toggleIcon.textContent = '☀️';
    }
  });
}

/**
 * 5. Authentication Modal & State
 */
function setupAuthModal() {
  const modal = document.getElementById('modal-auth');
  const openLoginBtn = document.getElementById('btn-open-login');
  const getStartedBtn = document.getElementById('btn-get-started');
  const closeBtns = document.querySelectorAll('[data-close-modal="modal-auth"]');
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const formLogin = document.getElementById('form-login');
  const formSignup = document.getElementById('form-signup');
  const userPill = document.getElementById('user-profile-pill');
  const userNameDisplay = document.getElementById('user-display-name');
  const btnLogout = document.getElementById('btn-logout');

  if (!modal) return;

  // Open modal triggers
  const openAuth = () => {
    modal.classList.remove('hidden');
  };

  if (openLoginBtn) openLoginBtn.addEventListener('click', openAuth);
  if (getStartedBtn) getStartedBtn.addEventListener('click', openAuth);

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => modal.classList.add('hidden'));
  });

  // Tab switching
  if (tabLogin && tabSignup) {
    tabLogin.addEventListener('click', () => {
      tabLogin.classList.add('active');
      tabSignup.classList.remove('active');
      formLogin.classList.remove('hidden');
      formSignup.classList.add('hidden');
    });

    tabSignup.addEventListener('click', () => {
      tabSignup.classList.add('active');
      tabLogin.classList.remove('active');
      formSignup.classList.remove('hidden');
      formLogin.classList.add('hidden');
    });
  }

  // Submit Login
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      state.isLoggedIn = true;
      state.userEmail = email;
      state.userName = email.split('@')[0].replace('.', ' ').toUpperCase();

      updateUserUI();
      modal.classList.add('hidden');
    });
  }

  // Submit Signup
  if (formSignup) {
    formSignup.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value;
      const email = document.getElementById('signup-email').value;
      state.isLoggedIn = true;
      state.userName = name;
      state.userEmail = email;

      updateUserUI();
      modal.classList.add('hidden');
    });
  }

  // Logout
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      state.isLoggedIn = false;
      updateUserUI();
    });
  }

  function updateUserUI() {
    if (state.isLoggedIn) {
      if (openLoginBtn) openLoginBtn.style.display = 'none';
      if (getStartedBtn) getStartedBtn.style.display = 'none';
      if (userPill) {
        userPill.classList.remove('hidden');
        if (userNameDisplay) userNameDisplay.textContent = state.userName;
      }
    } else {
      if (openLoginBtn) openLoginBtn.style.display = 'inline-block';
      if (getStartedBtn) getStartedBtn.style.display = 'inline-block';
      if (userPill) userPill.classList.add('hidden');
    }
  }
}

/**
 * 6. Agentic AI Chat Input Console & Speech Recognition
 */
function setupAgenticAIConsole() {
  const promptInput = document.getElementById('ai-prompt-input');
  const sendBtn = document.getElementById('btn-send-prompt');
  const voiceBtn = document.getElementById('btn-voice-input');
  const fileBtn = document.getElementById('btn-attach-file');
  const imageBtn = document.getElementById('btn-attach-image');
  const fileInput = document.getElementById('file-upload-input');
  const imageInput = document.getElementById('image-upload-input');
  const previewContainer = document.getElementById('attachment-preview-container');
  const chatThread = document.getElementById('ai-chat-thread');
  const messagesBox = document.getElementById('chat-messages-box');
  const clearChatBtn = document.getElementById('btn-clear-chat');

  if (!promptInput || !sendBtn) return;

  // Auto-resize textarea
  promptInput.addEventListener('input', () => {
    promptInput.style.height = 'auto';
    promptInput.style.height = Math.min(promptInput.scrollHeight, 120) + 'px';
  });

  // Enter to submit (Shift+Enter for newline)
  promptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  });

  sendBtn.addEventListener('click', handleSendPrompt);

  // File Upload Handling
  if (fileBtn && fileInput) {
    fileBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        state.attachedFiles.push(file.name);
        renderAttachments();
      }
    });
  }

  // Image Upload Handling
  if (imageBtn && imageInput) {
    imageBtn.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        state.attachedImages.push(file.name);
        renderAttachments();
      }
    });
  }

  function renderAttachments() {
    if (!previewContainer) return;
    previewContainer.innerHTML = '';
    const all = [...state.attachedFiles.map(f => `📄 ${f}`), ...state.attachedImages.map(i => `🖼️ ${i}`)];

    if (all.length > 0) {
      previewContainer.classList.remove('hidden');
      all.forEach((item, index) => {
        const chip = document.createElement('div');
        chip.className = 'attachment-chip';
        chip.innerHTML = `${item} <span style="cursor:pointer;margin-left:4px;" data-remove-index="${index}">✕</span>`;
        previewContainer.appendChild(chip);
      });

      previewContainer.querySelectorAll('[data-remove-index]').forEach(el => {
        el.addEventListener('click', (e) => {
          const idx = parseInt(e.target.getAttribute('data-remove-index'));
          if (idx < state.attachedFiles.length) {
            state.attachedFiles.splice(idx, 1);
          } else {
            state.attachedImages.splice(idx - state.attachedFiles.length, 1);
          }
          renderAttachments();
        });
      });
    } else {
      previewContainer.classList.add('hidden');
    }
  }

  // Voice Input Speech Recognition Setup
  if (voiceBtn) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      state.speechRecognition = new SpeechRecognition();
      state.speechRecognition.continuous = false;
      state.speechRecognition.interimResults = true;
      state.speechRecognition.lang = 'en-US';

      const waveformContainer = document.getElementById('voice-waveform-container');

      state.speechRecognition.onstart = () => {
        state.isRecordingVoice = true;
        voiceBtn.classList.add('recording');
        if (waveformContainer) waveformContainer.classList.remove('hidden');
        promptInput.placeholder = 'Listening... Speak now...';
      };

      state.speechRecognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        promptInput.value = transcript;
      };

      state.speechRecognition.onerror = () => {
        stopVoiceRecording();
      };

      state.speechRecognition.onend = () => {
        stopVoiceRecording();
      };

      voiceBtn.addEventListener('click', () => {
        if (state.isRecordingVoice) {
          state.speechRecognition.stop();
        } else {
          state.speechRecognition.start();
        }
      });
    } else {
      voiceBtn.addEventListener('click', () => {
        alert('Speech recognition is simulated for your browser environment.');
        promptInput.value = 'Create a high-performance React web application with modern AI features';
      });
    }
  }

  function stopVoiceRecording() {
    state.isRecordingVoice = false;
    const waveformContainer = document.getElementById('voice-waveform-container');
    if (voiceBtn) voiceBtn.classList.remove('recording');
    if (waveformContainer) waveformContainer.classList.add('hidden');
    promptInput.placeholder = 'Ask anything about AI, automation, software, or your business...';
  }

  // Send Prompt Execution
  function handleSendPrompt() {
    const text = promptInput.value.trim();
    const currentFiles = [...state.attachedFiles];
    const currentImages = [...state.attachedImages];
    if (!text && currentFiles.length === 0 && currentImages.length === 0) return;

    // Reveal chat thread box
    if (chatThread) chatThread.classList.remove('hidden');

    // Add user message
    appendChatMessage('user', text, currentFiles, currentImages);

    // Reset input
    promptInput.value = '';
    promptInput.style.height = 'auto';
    state.attachedFiles = [];
    state.attachedImages = [];
    renderAttachments();

    // Trigger AI response streaming
    generateAIResponse(text, currentFiles, currentImages);
  }

  if (clearChatBtn && messagesBox) {
    clearChatBtn.addEventListener('click', () => {
      messagesBox.innerHTML = '';
      if (chatThread) chatThread.classList.add('hidden');
    });
  }
}

/**
 * 7. Append Chat Message & Simulated AI Response Stream
 */
function appendChatMessage(sender, text, files = [], images = []) {
  const messagesBox = document.getElementById('chat-messages-box');
  if (!messagesBox) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg chat-msg-${sender}`;

  const avatar = sender === 'user' ? '👤' : '✨';
  const name = sender === 'user' ? 'You' : 'WaveMind AI';

  let attachmentsHTML = '';
  if (files.length > 0 || images.length > 0) {
    const fileChips = files.map(f => `<span class="attachment-chip">📄 ${escapeHTML(f)}</span>`).join(' ');
    const imgChips = images.map(i => `<span class="attachment-chip">🖼️ ${escapeHTML(i)}</span>`).join(' ');
    attachmentsHTML = `<div style="margin-bottom:8px;display:flex;flex-wrap:wrap;gap:6px;">${fileChips} ${imgChips}</div>`;
  }

  msgDiv.innerHTML = `
    <div class="chat-avatar">${avatar}</div>
    <div class="chat-bubble">
      <div style="font-weight:700;font-size:12px;margin-bottom:4px;color:${sender === 'user' ? '#818cf8' : '#c084fc'}">${name}</div>
      ${attachmentsHTML}
      <div class="msg-content">${escapeHTML(text)}</div>
    </div>
  `;

  messagesBox.appendChild(msgDiv);
  messagesBox.scrollTop = messagesBox.scrollHeight;

  // Persist user message to thread history
  addMessageToActiveThread({
    id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    sender,
    text,
    files,
    images,
    timestamp: new Date().toISOString()
  });

  return msgDiv;
}

function generateAIResponse(userText, files = [], images = []) {
  const messagesBox = document.getElementById('chat-messages-box');
  const modelSelect = document.getElementById('select-ai-model');
  const ttsToggle = document.getElementById('toggle-audio-tts');
  if (!messagesBox) return;

  const modelName = modelSelect ? modelSelect.options[modelSelect.selectedIndex].text : '🤖 WaveMind Sales AI';
  const customApiKey = DIRECT_API_KEY.trim() || (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) || localStorage.getItem('wavemind_api_key') || '';
  const customProvider = DIRECT_API_KEY.trim() ? DIRECT_API_PROVIDER : (localStorage.getItem('wavemind_api_provider') || 'gemini');

  // Create empty AI response bubble
  const aiMsgDiv = document.createElement('div');
  aiMsgDiv.className = 'chat-msg chat-msg-ai';
  aiMsgDiv.innerHTML = `
    <div class="chat-avatar">✨</div>
    <div class="chat-bubble">
      <div style="font-weight:700;font-size:12px;margin-bottom:4px;color:#c084fc">${escapeHTML(modelName)}</div>
      <div class="msg-content"><span class="pulse-indicator"></span> <em>Analyzing prompt intent & computing context response...</em></div>
    </div>
  `;
  messagesBox.appendChild(aiMsgDiv);
  messagesBox.scrollTop = messagesBox.scrollHeight;

  const contentEl = aiMsgDiv.querySelector('.msg-content');

  const lowerText = userText.toLowerCase().trim();
  const serviceKeywords = [
    'website', 'web', 'site', 'make a website', 'build a website', 'web app', 'saas', 'frontend', 'react', 'web design', 'ui/ux', 'ui', 'ux',
    'app', 'mobile', 'ios', 'android', 'flutter', 'react native', 'make an app', 'build an app', 'mobile app',
    'ai', 'chatbot', 'bot', 'automation', 'agent', 'rag', 'workflow', 'llm',
    'price', 'pricing', 'cost', 'quote', 'budget', 'estimate', 'packages', 'how much', 'rates',
    'kolkata', 'address', 'phone', 'location', 'office', 'who are you', 'wavemind', 'company', 'contact', 'services',
    'security', 'privacy', 'sla', 'ip', 'code ownership', 'warranty', 'hi', 'hello', 'hey', 'namaste'
  ];
  const isServiceQuery = serviceKeywords.some(kw => lowerText.includes(kw));

  const isGeminiKey = customProvider === 'gemini' && customApiKey.startsWith('AIzaSy');
  const isOpenAIKey = customProvider === 'openai' && customApiKey.startsWith('sk-');

  // RULE 3 & 4: ONLY use Gemini API for general/personal/unrelated queries NOT matching predefined service flows
  if (!isServiceQuery && customApiKey && (isGeminiKey || isOpenAIKey)) {
    fetchRealLLMResponse(customProvider, customApiKey, userText, state.activeChatHistory)
      .then(realText => {
        const fullHTML = `
          <div style="font-size:13px;line-height:1.6;color:#e2e8f0;white-space:pre-wrap;">${escapeHTML(realText)}</div>
        `;
        contentEl.innerHTML = fullHTML;
        messagesBox.scrollTop = messagesBox.scrollHeight;

        addMessageToActiveThread({
          id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          sender: 'ai',
          text: realText,
          html: fullHTML,
          files: [],
          images: [],
          timestamp: new Date().toISOString()
        });
      })
      .catch(err => {
        runFallbackGenerator();
      });
    return;
  }

  runFallbackGenerator();

  function runFallbackGenerator() {
    const lower = userText.toLowerCase().trim();

    setTimeout(() => {
      let responseTextRaw = '';
      let responseHTML = '';
      let actionButtons = '';

      let attachmentContextBox = '';
      if (files.length > 0 || images.length > 0) {
        const fileNames = [...files, ...images].join(', ');
        attachmentContextBox = `
        <div style="background:rgba(168,85,247,0.12);border:1px solid rgba(168,85,247,0.3);padding:8px 12px;border-radius:8px;font-size:12px;margin-bottom:12px;color:#e9d5ff;">
          📌 <strong>Attachment Analysis:</strong> Processed ${files.length + images.length} input file(s) [${escapeHTML(fileNames)}]. Parsed schema & vector embeddings successfully.
        </div>
      `;
      }

      // 1. GREETING INTENT
      if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower === 'namaste' || lower.startsWith('hi ') || lower.startsWith('hello ')) {
        responseTextRaw = `Hello! Welcome to WaveMind Solutions Kolkata. I am your Agentic AI Software Architect. How can I assist you with your web app, mobile app, or AI automation project today?`;
        responseHTML = `
        <p style="color:#c084fc;font-weight:700;font-size:15px;margin-bottom:8px;">👋 Hello & Welcome to WaveMind Solutions!</p>
        <p>I am your <strong>Agentic AI Software Architect</strong>. I can assist you with:</p>
        <ul style="margin:10px 0 12px 18px;font-size:13px;color:var(--color-text-muted);">
          <li>🏢 <strong>Company Credentials</strong> (Kolkata WB Office, Address, SLA)</li>
          <li>💻 <strong>Full-Stack Tech Stack</strong> (React 18, Node.js, Python, PGVector)</li>
          <li>📱 <strong>Mobile App Strategy</strong> (iOS Swift, Android Kotlin, Flutter, React Native)</li>
          <li>💰 <strong>Custom Cost & Timeline Estimation</strong> (Instant ₹ INR Quotation)</li>
          <li>⚡ <strong>Automated AI Workflows & RAG Integration</strong></li>
        </ul>
        <p style="font-size:12px;color:#38bdf8;">What would you like to build or inquire about today?</p>
      `;
        actionButtons = `
        <div class="ai-action-btn-row" style="margin-top:12px;">
          <button class="ai-action-trigger" onclick="sendAutoPrompt('Who is WaveMind Solutions? Kolkata address and contact details')">🏢 Company Info</button>
          <button class="ai-action-trigger" onclick="sendAutoPrompt('What tech stack and databases do you use for web and mobile apps?')">💻 Tech Stack</button>
          <button class="ai-action-trigger" onclick="sendAutoPrompt('Estimate cost for an E-Commerce Mobile App with Razorpay and AI')">💰 Price Estimate</button>
        </div>
      `;
      }

      // 2. COMPANY PROFILE & KOLKATA OFFICE INTENT
      else if (lower.includes('kolkata') || lower.includes('address') || lower.includes('phone') || lower.includes('location') || lower.includes('office') || lower.includes('who are you') || lower.includes('wavemind') || lower.includes('company')) {
        responseTextRaw = `WaveMind Solutions is an Indian enterprise software and AI agency headquartered in Kolkata, West Bengal, India. Address: 13 Kalupara Lane, Kolkata 700029. Phone: +91 82828 43434. Email: info@wavemindsolutions.in.`;
        responseHTML = `
        <p style="color:#c084fc;font-weight:700;font-size:15px;margin-bottom:8px;">🏢 WaveMind Solutions Kolkata - Corporate Credentials</p>
        <p>WaveMind Solutions is a leading Indian digital transformation and AI engineering enterprise based in Kolkata, West Bengal, India.</p>

        <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(168,85,247,0.3);border-radius:12px;padding:14px;margin:12px 0;">
          <div style="margin-bottom:8px;font-size:13px;">📍 <strong>Headquarters Address:</strong> 13, Kalupara Lane, Kolkata, West Bengal 700029, India</div>
          <div style="margin-bottom:8px;font-size:13px;">📞 <strong>Official Phone / WhatsApp:</strong> <a href="tel:+918282843434" style="color:#34d399;font-weight:700">+91 82828 43434</a></div>
          <div style="margin-bottom:8px;font-size:13px;">📧 <strong>Official Contact Email:</strong> <a href="mailto:info@wavemindsolutions.in" style="color:#38bdf8;font-weight:700">info@wavemindsolutions.in</a></div>
          <div style="font-size:13px;">🌐 <strong>Official Website Domain:</strong> <a href="https://wavemindsolutions.in" target="_blank" style="color:#c084fc;font-weight:700">https://wavemindsolutions.in</a></div>
        </div>

        <p style="font-size:13px;color:var(--color-text-muted);">Key Commitments: 100% IP Code Ownership, Sub-50ms API Latency Guarantee, and 12-Hour Proposal SLA.</p>
      `;
        actionButtons = `
        <div class="ai-action-btn-row" style="margin-top:12px;">
          <button class="ai-action-trigger" style="background:linear-gradient(135deg,#a855f7,#6366f1);color:#fff" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'})">📩 Contact Kolkata Team</button>
          <button class="ai-action-trigger" onclick="sendAutoPrompt('What SLA and security warranty do you provide?')">📜 View SLA & Security</button>
        </div>
      `;
      }

      // 3. TECH STACK OVERVIEW INTENT (ONLY WHEN ASKING ABOUT STACK OVERVIEW)
      else if (lower.includes('tech stack') || lower.includes('technology stack') || lower.includes('which tech') || lower.includes('what technologies')) {
        responseTextRaw = `WaveMind Solutions uses React 18, Vite, Next.js, Node.js, Python FastAPI, PostgreSQL with PGVector, Redis, React Native, and Flutter.`;
        responseHTML = `
        <p style="color:#c084fc;font-weight:700;font-size:15px;margin-bottom:8px;">💻 WaveMind Enterprise Tech Stack Architecture</p>
        <p>We build production-grade, highly scalable software using modern microservice architectures:</p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0;">
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(168,85,247,0.25);border-radius:10px;padding:12px;font-size:12px;">
            <strong style="color:#38bdf8;display:block;margin-bottom:4px">Frontend & Web Apps</strong>
            React 18, Vite, Next.js 14, TypeScript, Glassmorphic CSS
          </div>
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(168,85,247,0.25);border-radius:10px;padding:12px;font-size:12px;">
            <strong style="color:#a855f7;display:block;margin-bottom:4px">Mobile Apps</strong>
            React Native 0.74, Flutter 3.22, Swift (iOS), Kotlin (Android)
          </div>
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(168,85,247,0.25);border-radius:10px;padding:12px;font-size:12px;">
            <strong style="color:#34d399;display:block;margin-bottom:4px">Backend & Cloud</strong>
            Node.js Microservices, Python FastAPI, Redis, BullMQ
          </div>
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(168,85,247,0.25);border-radius:10px;padding:12px;font-size:12px;">
            <strong style="color:#fbbf24;display:block;margin-bottom:4px">Databases & AI RAG</strong>
            PostgreSQL + PGVector, SQLCipher, GPT-4o, Claude 3.5
          </div>
        </div>
      `;
        actionButtons = `
        <div class="ai-action-btn-row" style="margin-top:12px;">
          <button class="ai-action-trigger" onclick="document.querySelector('[data-card-id=web-app]').click()">💻 Open Web App Sandbox</button>
          <button class="ai-action-trigger" onclick="document.querySelector('[data-card-id=workflow]').click()">⚡ Open Workflow Architect</button>
        </div>
      `;
      }

      // 4. SECURITY, PRIVACY & SLA INTENT
      else if (lower.includes('security') || lower.includes('privacy') || lower.includes('sla') || lower.includes('ip') || lower.includes('code ownership') || lower.includes('warranty') || lower.includes('hipaa') || lower.includes('pci')) {
        responseTextRaw = `WaveMind provides 100% intellectual property code ownership, sub-50ms API latency guarantee, 30-day post-launch warranty, PCI-DSS payment compliance, and 12-hour proposal turnaround.`;
        responseHTML = `
        <p style="color:#c084fc;font-weight:700;font-size:15px;margin-bottom:8px;">📜 Security, Legal & SLA Warranties</p>
        <p>Every software solution developed by WaveMind Solutions comes with enterprise-grade warranties:</p>

        <ul style="margin:10px 0 12px 18px;font-size:13px;color:var(--color-text-muted);">
          <li>🔑 <strong>100% Intellectual Property Code Ownership:</strong> Full git repository & license transfer to client.</li>
          <li>⚡ <strong>Sub-50ms API Latency SLA:</strong> Engineered on high-speed CDN & Redis Caching microservices.</li>
          <li>🛡️ <strong>Compliance Ready:</strong> OWASP Mobile Top 10, PCI-DSS Level 1, and HIPAA / DISHA encryption standards.</li>
          <li>🛠️ <strong>30-Day Post-Launch Warranty:</strong> Free bug fixes, deployment monitoring, and server maintenance support.</li>
          <li>⏱️ <strong>12-Hour Proposal SLA:</strong> Guaranteed formal proposal turnaround for all client inquiries.</li>
        </ul>
      `;
        actionButtons = `
        <div class="ai-action-btn-row" style="margin-top:12px;">
          <button class="ai-action-trigger" style="background:linear-gradient(135deg,#a855f7,#6366f1);color:#fff" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'})">📩 Request Official Proposal</button>
        </div>
      `;
      }

      // 5. CUSTOM PROJECT REQUIREMENT & COST / DURATION ESTIMATION INTENT
      else {
        // Fuzzy Keyword & Typo Matchers
        const isFlutter = lower.includes('flutter') || lower.includes('fulter') || lower.includes('fluter') || lower.includes('fluttr') || lower.includes('dart');
        const isReactNative = lower.includes('react native') || lower.includes('rn app') || lower.includes('reactnative');
        const isECommerce = lower.includes('e-commerce') || lower.includes('ecommerce') || lower.includes('shop') || lower.includes('store') || lower.includes('product');
        const isAI = lower.includes('ai') || lower.includes('chatbot') || lower.includes('rag') || lower.includes('llm') || lower.includes('gpt') || lower.includes('bot');
        const isCRM = lower.includes('crm') || lower.includes('erp') || lower.includes('hr') || lower.includes('management') || lower.includes('portal');
        const isMobile = isFlutter || isReactNative || lower.includes('mobile') || lower.includes('ios') || lower.includes('android') || lower.includes('app');

        let projectCategory = 'Custom Software Solution';
        let basePrice = 45000;
        let baseWeeks = 3;
        let techStack = 'React 18, Node.js, PostgreSQL, Tailwind/Glassmorphic CSS';
        let featureList = [];
        let frameworkNote = '';

        const isWeb = lower.includes('web') || lower.includes('website') || lower.includes('portal');

        if (isFlutter && isWeb) {
          projectCategory = 'Flutter 3.22 High-Performance Web Application';
          basePrice = 55000;
          baseWeeks = 3;
          techStack = 'Flutter 3.22 (CanvasKit 60fps), Dart Web Engine, Node.js Microservices, PostgreSQL';
          featureList = [
            '🌐 CanvasKit High-Speed 60fps Web Rendering Engine',
            '📱 Single Codebase for Web, Desktop (Windows/Mac) & Mobile',
            '💳 Razorpay & UPI Payment Gateway Web SDK Integration',
            '🔒 Encrypted Local Storage & REST / GraphQL API Sync'
          ];
          frameworkNote = 'Flutter 3.22 CanvasKit framework se high-performance responsive web application build hogi.';
        } else if (isFlutter) {
          projectCategory = 'Flutter 3.22 Cross-Platform Mobile App (iOS & Android)';
          basePrice = 65000;
          baseWeeks = 3;
          techStack = 'Flutter 3.22 (Dart AOT), Native Swift & Kotlin Bridges, Node.js API, PostgreSQL';
          featureList = [
            '⚡ 60fps Native Smooth Performance with Shared Dart Codebase',
            '📱 Single Codebase for both Apple iOS & Google Android',
            '💳 Razorpay & UPI Payment Gateway Mobile SDK Integration',
            '🔒 Local Encrypted SQLite / WatermelonDB Offline Data Store'
          ];
          frameworkNote = 'Flutter 3.22 (Dart AOT Compiled) framework se iOS aur Android dono ke liye single codebase app banaya jayega.';
        } else if (isReactNative) {
          projectCategory = 'React Native 0.74 Cross-Platform Mobile App';
          basePrice = 65000;
          baseWeeks = 3;
          techStack = 'React Native 0.74, TypeScript, Reanimated 3, Redux Toolkit, Node.js Microservices';
          featureList = [
            '📱 Shared React Native JavaScript / TypeScript Codebase',
            '🔒 Biometric Keyring Authentication (FaceID & TouchID)',
            '⚡ MMKV High-Speed Offline Storage Caching',
            '🚀 OTA Hot Updates & Push Notification Infrastructure'
          ];
          frameworkNote = 'React Native 0.74 framework se high-speed cross-platform mobile application build hogi.';
        } else if (isECommerce) {
          projectCategory = 'Enterprise E-Commerce SaaS & Quick-Commerce App';
          basePrice = 65000;
          baseWeeks = 4;
          techStack = 'React 18 / React Native, Node.js, PGVector AI Search, Razorpay / UPI, PostgreSQL';
          featureList = [
            '🛍️ Product Catalog with Real-Time Inventory & Category Filters',
            '💳 Razorpay & UPI Instant Mobile Checkout Intent',
            '🤖 AI Vector Semantic Product Recommendation Engine',
            '📍 Live Order Tracking & Driver GPS Dispatcher'
          ];
          frameworkNote = 'Full-scale E-Commerce platform with Razorpay UPI payment gateway & AI product recommendations.';
        } else if (isAI) {
          projectCategory = 'Agentic AI & PGVector RAG Automation Engine';
          basePrice = 85000;
          baseWeeks = 4;
          techStack = 'Python FastAPI, PGVector, OpenAI GPT-4o / Claude 3.5 Sonnet, React 18 UI';
          featureList = [
            '📄 PGVector Semantic Document Retrieval (Zero-Hallucination RAG)',
            '🤖 Multi-Model LLM API Router with Automatic Fallback',
            '🎙️ Custom Voice Speech-to-Text & SpeechSynthesis TTS',
            '⚡ Real-Time Database Webhook Triggers & Automation'
          ];
          frameworkNote = 'Custom Enterprise AI Agent with RAG document retrieval & automated database triggers.';
        } else if (isCRM) {
          projectCategory = 'Enterprise Portal & Workforce CRM Solution';
          basePrice = 85000;
          baseWeeks = 4;
          techStack = 'React 18, TypeScript, Node.js, PostgreSQL, Redis Cache, Docker';
          featureList = [
            '👥 Role-Based Access Control (RBAC Admin & User Permissions)',
            '📊 Real-Time Analytics & Telemetry SVG Dashboard',
            '💬 Automated WhatsApp & Email Notification Dispatch',
            '📥 On-Demand CSV & Encrypted PDF Report Exporter'
          ];
          frameworkNote = 'Custom Enterprise CRM portal with role-based permissions & automated lead management.';
        } else if (isMobile) {
          projectCategory = 'Cross-Platform Mobile Application (iOS & Android)';
          basePrice = 65000;
          baseWeeks = 3;
          techStack = 'Flutter 3.22 / React Native, Node.js API, Firebase Push Alerts, PostgreSQL';
          featureList = [
            '📱 iOS & Android Mobile App Codebase',
            '🔔 Firebase Cloud Messaging (FCM) & Apple APNS Push Alerts',
            '🔒 Biometric User Authentication',
            '⚡ Sub-50ms Microservices Backend Architecture'
          ];
          frameworkNote = 'Cross-platform mobile application build for iOS App Store and Google Play Store.';
        } else {
          projectCategory = 'Enterprise High-Performance Web Application';
          basePrice = 45000;
          baseWeeks = 2;
          techStack = 'React 18, Vite, Node.js Microservices, Glassmorphism Design System';
          featureList = [
            '⚡ Sub-50ms API Response Microservice Architecture',
            '💎 Modern Glassmorphism Responsive UI Components',
            '🔍 Complete SEO, OpenGraph & Performance Optimization',
            '⏱️ 12-Hour SLA Turnaround & 30-Day Post-Launch Warranty'
          ];
          frameworkNote = 'High-speed React 18 Web Application with responsive glass UI.';
        }

        const priceMinStr = `₹${basePrice.toLocaleString('en-IN')}`;
        const priceMaxStr = `₹${(basePrice + 30000).toLocaleString('en-IN')}`;

        responseTextRaw = `WaveMind Solutions Kolkata se ${projectCategory} banane ka estimated investment ${priceMinStr} - ${priceMaxStr} hai aur delivery duration ${baseWeeks} - ${baseWeeks + 1} Weeks lagta hai.`;

        const projectScopeSummary = `Client Requirement: ${userText.replace(/"/g, '')} | Category: ${projectCategory} | Estimated Cost: ${priceMinStr} - ${priceMaxStr} | Stack: ${techStack}`;

        responseHTML = `
        <p style="color:#c084fc;font-weight:700;font-size:15px;margin-bottom:8px;">🎯 Requirement Intake & Architectural Proposal</p>
        <p style="font-size:14px;color:#fff;margin-bottom:10px;">
          WaveMind Solutions Kolkata se <strong>${escapeHTML(projectCategory)}</strong> banane ka estimated investment <strong style="color:#34d399">${priceMinStr} - ${priceMaxStr}</strong> hai aur delivery duration <strong style="color:#38bdf8">${baseWeeks} - ${baseWeeks + 1} Weeks</strong> lagta hai.
        </p>
        <p style="font-size:12px;color:#cbd5e1;margin-bottom:12px;"><em>${escapeHTML(frameworkNote)}</em></p>
        
        <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(168,85,247,0.3);border-radius:12px;padding:14px;margin:12px 0;">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px;">
            <span style="color:var(--color-text-muted)">Project Solution:</span>
            <strong style="color:#fff">${escapeHTML(projectCategory)}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px;">
            <span style="color:var(--color-text-muted)">Estimated Investment:</span>
            <strong style="color:#34d399;font-size:14px">${priceMinStr} - ${priceMaxStr}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px;">
            <span style="color:var(--color-text-muted)">Delivery Timeline:</span>
            <strong style="color:#38bdf8">${baseWeeks} - ${baseWeeks + 1} Weeks</strong>
          </div>
          <div style="font-size:12px;color:var(--color-text-muted);border-top:1px solid rgba(255,255,255,0.08);padding-top:8px;margin-top:8px;">
            <strong>Recommended Stack:</strong> ${escapeHTML(techStack)}
          </div>
        </div>

        <p style="font-weight:700;font-size:13px;margin-bottom:6px;color:#fff;">Key Architectural Modules:</p>
        <ul style="margin-bottom:12px;padding-left:18px;font-size:13px;color:var(--color-text-muted);">
          ${featureList.map(f => `<li>${escapeHTML(f)}</li>`).join('')}
        </ul>

        <p style="font-size:12px;color:#c084fc;">💡 <strong>Next Step:</strong> Click below to automatically send this proposal spec to WaveMind Kolkata architects!</p>
      `;

        actionButtons = `
        <div class="ai-action-btn-row" style="margin-top:12px;">
          <button class="ai-action-trigger" style="background:linear-gradient(135deg,#a855f7,#6366f1);color:#fff;font-weight:700;" onclick="sendSpecToContactForm('${escapeHTML(projectScopeSummary)}')">🚀 Send Proposal Spec to WaveMind Architects</button>
          <button class="ai-action-trigger" onclick="document.querySelector('[data-card-id=pricing]').click()">💰 Customize in Cost Calculator</button>
          <button class="ai-action-trigger" onclick="document.querySelector('[data-card-id=web-app]').click()">💻 Test Code Sandbox</button>
        </div>
      `;
      }

      contentEl.innerHTML = attachmentContextBox + responseHTML + actionButtons;
      messagesBox.scrollTop = messagesBox.scrollHeight;

      // Save AI response to thread history
      addMessageToActiveThread({
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        sender: 'ai',
        text: responseTextRaw || 'WaveMind AI Response Blueprint',
        html: attachmentContextBox + responseHTML + actionButtons,
        files: [],
        images: [],
        timestamp: new Date().toISOString()
      });

      // Optional SpeechSynthesis Voice Read Aloud
      if (ttsToggle && ttsToggle.checked && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(responseTextRaw);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    }, 1000);
  }
}

/**
 * Real LLM API Dispatcher (OpenAI & Gemini API Fetcher)
 */
async function fetchRealLLMResponse(provider, apiKey, userPrompt, activeHistory = []) {
  const systemPrompt = "You are WaveMind Solutions Kolkata's Lead AI Software Architect (Headquarters: 13, Kalupara Lane, Kolkata, WB 700029, India | Phone: +91 82828 43434). Provide ultra-detailed, highly specific, technical architectural blueprints, estimated ₹ INR pricing, delivery timelines in weeks, recommended stack, and module breakdowns for user inquiries. Write in a helpful, direct tone.";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    if (provider === 'openai') {
      const messagesPayload = [{ role: 'system', content: systemPrompt }];
      (activeHistory || []).slice(-4).forEach(m => {
        messagesPayload.push({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text || 'Context message'
        });
      });
      messagesPayload.push({ role: 'user', content: userPrompt });

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: messagesPayload,
          temperature: 0.7
        })
      });

      clearTimeout(timeoutId);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP ${res.status} OpenAI API Error`);
      }

      const data = await res.json();
      return data.choices[0]?.message?.content || 'No response returned from OpenAI API.';
    } else if (provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const contentsPayload = (activeHistory || []).slice(-4).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text || '' }]
      }));
      contentsPayload.push({
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nClient User Inquiry: ${userPrompt}` }]
      });

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: contentsPayload
        })
      });

      clearTimeout(timeoutId);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP ${res.status} Gemini API Error`);
      }

      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response returned from Gemini API.';
    }
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }

  throw new Error('Unsupported API provider selected.');
}

/**
 * Setup Real LLM Agent API Key Configuration Modal
 */
function setupAPIConfigHandler() {
  const btnOpen = document.getElementById('btn-open-api-config');
  const btnSave = document.getElementById('btn-save-api-key');
  const btnClear = document.getElementById('btn-clear-api-key');
  const providerSelect = document.getElementById('select-api-provider');
  const apiKeyInput = document.getElementById('input-custom-api-key');
  const statusToast = document.getElementById('api-key-status-toast');

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      openModal('modal-ai-api-config');
      if (apiKeyInput) apiKeyInput.value = localStorage.getItem('wavemind_api_key') || '';
      if (providerSelect) providerSelect.value = localStorage.getItem('wavemind_api_provider') || 'wavemind';
    });
  }

  if (btnSave) {
    btnSave.addEventListener('click', () => {
      const provider = providerSelect ? providerSelect.value : 'wavemind';
      const key = apiKeyInput ? apiKeyInput.value.trim() : '';

      localStorage.setItem('wavemind_api_provider', provider);
      localStorage.setItem('wavemind_api_key', key);

      if (statusToast) {
        statusToast.classList.remove('hidden');
        statusToast.textContent = key ? `✓ API Key Saved! Real ${provider.toUpperCase()} Agent Active.` : '✓ Switched to WaveMind Built-in Generative Engine.';
      }

      showToast('AI Agent API Configuration Saved! 🚀');
    });
  }

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      localStorage.removeItem('wavemind_api_key');
      localStorage.setItem('wavemind_api_provider', 'wavemind');
      if (apiKeyInput) apiKeyInput.value = '';
      if (providerSelect) providerSelect.value = 'wavemind';
      if (statusToast) {
        statusToast.classList.remove('hidden');
        statusToast.textContent = '✓ API Key Cleared. Switched to WaveMind Built-in Generative Engine.';
      }
      showToast('API Key cleared!');
    });
  }
}

// Global helper to auto-fill Contact Form from generated AI proposal spec
window.sendSpecToContactForm = function (specSummary) {
  const messageInput = document.getElementById('textarea-message');
  const contactSection = document.getElementById('contact');

  if (messageInput) {
    messageInput.value = specSummary;
  }

  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
    showToast('Proposal Blueprint copied to Contact Form! 🚀');
  }
};

/**
 * 8. Feature Cards & Quick Action Chips Interactivity
 */
function setupFeatureCardsAndChips() {
  const cards = document.querySelectorAll('.feature-card');
  const chips = document.querySelectorAll('.quick-chip-btn');
  const promptInput = document.getElementById('ai-prompt-input');
  const sendBtn = document.getElementById('btn-send-prompt');

  // Feature Card Clicks
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const cardId = card.getAttribute('data-card-id');

      if (cardId === 'web-app') {
        openModal('modal-sandbox-preview');
        sendAutoPrompt('Build a React web application with high performance');
      } else if (cardId === 'workflow') {
        openModal('modal-workflow-builder');
        sendAutoPrompt('Automate my workflow with AI LLM agents');
      } else if (cardId === 'mobile-app') {
        openModal('modal-mobile-strategy');
        sendAutoPrompt('Architect a cross-platform iOS & Android mobile app');
      } else if (cardId === 'pricing') {
        openModal('modal-pricing-calculator');
        sendAutoPrompt('Calculate project pricing tiers & delivery timeline');
      }
    });
  });

  // Quick Action Chips Clicks
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const promptText = chip.getAttribute('data-prompt');
      if (promptInput) {
        promptInput.value = promptText;
        if (sendBtn) sendBtn.click();
      }
    });
  });

  function sendAutoPrompt(msg) {
    if (promptInput && sendBtn) {
      promptInput.value = msg;
      sendBtn.click();
    }
  }
}

/**
 * 9. Pricing Calculator Logic (Multi-Currency & Promo Discount)
 */
function setupPricingCalculator() {
  const modal = document.getElementById('modal-pricing-calculator');
  const typeBtns = document.querySelectorAll('#calc-project-type .calc-type-btn');
  const addons = document.querySelectorAll('.calc-addon');
  const supportBtns = document.querySelectorAll('#calc-support-tier .calc-support-btn');
  const currencyBtns = document.querySelectorAll('.calc-currency-btn');
  const priceDisplay = document.getElementById('calc-price-display');
  const timelineDisplay = document.getElementById('calc-timeline-display');
  const couponInput = document.getElementById('input-coupon-code');
  const applyCouponBtn = document.getElementById('btn-apply-coupon');
  const couponBadge = document.getElementById('coupon-discount-badge');
  const downloadQuotationBtn = document.getElementById('btn-download-quotation');

  if (!priceDisplay) return;

  let currentCurrency = 'INR'; // INR, USD, EUR
  let isDiscountApplied = false;

  const exchangeRates = {
    INR: { symbol: '₹', rate: 1, locale: 'en-IN' },
    USD: { symbol: '$', rate: 1 / 83.5, locale: 'en-US' },
    EUR: { symbol: '€', rate: 1 / 91.2, locale: 'de-DE' }
  };

  function calculate() {
    let baseCost = 45000;
    let baseWeeks = 3;
    let selectedTypeName = 'Web Application';

    // Active project type
    typeBtns.forEach(btn => {
      if (btn.classList.contains('active')) {
        baseCost = parseInt(btn.getAttribute('data-base')) || 45000;
        baseWeeks = parseInt(btn.getAttribute('data-weeks')) || 3;
        selectedTypeName = btn.textContent.split('(')[0].trim();
      }
    });

    // Addons
    let addonCost = 0;
    let addonDays = 0;
    addons.forEach(cb => {
      if (cb.checked) {
        addonCost += parseInt(cb.getAttribute('data-cost')) || 0;
        addonDays += parseInt(cb.getAttribute('data-days')) || 0;
      }
    });

    // Support Tier
    let supportCost = 0;
    supportBtns.forEach(btn => {
      if (btn.classList.contains('active')) {
        supportCost = parseInt(btn.getAttribute('data-cost')) || 0;
      }
    });

    let rawTotalCost = baseCost + addonCost + supportCost;
    if (isDiscountApplied) {
      rawTotalCost = Math.round(rawTotalCost * 0.9); // 10% discount
    }

    const totalWeeks = Math.ceil(baseWeeks + (addonDays / 5));

    // Convert currency
    const currMeta = exchangeRates[currentCurrency] || exchangeRates.INR;
    const minVal = Math.round(rawTotalCost * currMeta.rate);
    const maxVal = Math.round((rawTotalCost + 15000) * currMeta.rate);

    const minFormatted = minVal.toLocaleString(currMeta.locale);
    const maxFormatted = maxVal.toLocaleString(currMeta.locale);

    priceDisplay.textContent = `${currMeta.symbol}${minFormatted} - ${currMeta.symbol}${maxFormatted}`;
    if (timelineDisplay) timelineDisplay.textContent = `${totalWeeks} - ${totalWeeks + 1} Weeks`;

    return {
      selectedTypeName,
      rawTotalCost,
      minFormatted,
      maxFormatted,
      symbol: currMeta.symbol,
      totalWeeks,
      currency: currentCurrency
    };
  }

  // Currency Switcher
  currencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currencyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCurrency = btn.getAttribute('data-curr') || 'INR';
      calculate();
    });
  });

  // Promo Coupon Engine
  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      if (code === 'WAVEMIND10' || code === 'KOLKATA2026') {
        isDiscountApplied = true;
        if (couponBadge) couponBadge.classList.remove('hidden');
        showToast('10% Discount Applied! 🎉');
        calculate();
      } else {
        showToast('Invalid Coupon Code! Try WAVEMIND10');
      }
    });
  }

  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      calculate();
    });
  });

  addons.forEach(cb => cb.addEventListener('change', calculate));

  supportBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      supportBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      calculate();
    });
  });

  // Download Quotation File Engine
  if (downloadQuotationBtn) {
    downloadQuotationBtn.addEventListener('click', () => {
      const calcData = calculate();
      const quotationText = `====================================================================
WAVEMIND SOLUTIONS (KOLKATA, INDIA) - OFFICIAL PROJECT QUOTATION
====================================================================
Official Domain: https://wavemindsolutions.in
Contact Email: info@wavemindsolutions.in | Phone: +91 82828 43434
Headquarters: 13, Kalupara Lane, Kolkata, West Bengal 700029, India
====================================================================

ESTIMATED PROJECT COST & TIMELINE QUOTATION
DATE ISSUED: ${new Date().toLocaleDateString('en-IN')}

[1. SCOPE BREAKDOWN]
   • Project Type: ${calcData.selectedTypeName}
   • Currency Selected: ${calcData.currency}
   • Estimated Investment: ${calcData.symbol}${calcData.minFormatted} - ${calcData.symbol}${calcData.maxFormatted}
   • Estimated Timeline: ${calcData.totalWeeks} - ${calcData.totalWeeks + 1} Weeks
   • Promo Discount Applied: ${isDiscountApplied ? '10% (WAVEMIND10)' : 'None'}

[2. INCLUDED SLA & WARRANTY]
   • 100% Intellectual Property Code Ownership
   • Sub-50ms API Latency SLA Guarantee
   • 30-Day Post-Launch Warranty & Support
   • 12-Hour Proposal Turnaround SLA

====================================================================
WaveMind Solutions Kolkata - Enterprise Software & AI Integrations
====================================================================`;

      const blob = new Blob([quotationText], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `WaveMind_Official_Project_Quotation.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Official Quotation downloaded! 📥');
    });
  }

  // Request proposal button
  const requestBtn = document.getElementById('btn-calc-request-proposal');
  if (requestBtn) {
    requestBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      const contactSection = document.getElementById('contact');
      if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Initial calculation
  calculate();
}

/**
 * 10. Live Web App Sandbox Preview Modal Logic (4 Interactive App Templates)
 */
function setupSandboxPreview() {
  const toggles = document.querySelectorAll('.device-toggle');
  const container = document.getElementById('sandbox-container');
  const iframe = document.getElementById('sandbox-iframe');
  const tabPreview = document.getElementById('tab-sandbox-preview');
  const tabCode = document.getElementById('tab-sandbox-code');
  const codeContainer = document.getElementById('sandbox-code-container');
  const codeTextarea = document.getElementById('sandbox-code-textarea');
  const runBtn = document.getElementById('btn-run-sandbox-code');
  const appPresets = document.querySelectorAll('.sandbox-app-preset');
  const exportCodeBtn = document.getElementById('btn-export-sandbox-code');

  const appTemplates = {
    saas: {
      name: 'Enterprise SaaS Analytics Dashboard',
      title: '📊 Enterprise SaaS Analytics Dashboard - Live App Preview',
      code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; background: #070710; color: #fff; margin: 0; padding: 24px; box-sizing: border-box; }
    .nav { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(168,85,247,0.3); padding-bottom: 16px; margin-bottom: 24px; }
    .brand { font-size: 18px; font-weight: 800; color: #c084fc; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
    .stat-card { background: rgba(18, 14, 38, 0.85); border: 1px solid rgba(168,85,247,0.25); border-radius: 12px; padding: 18px; text-align: left; }
    .stat-label { font-size: 12px; color: #94a3b8; margin-bottom: 6px; }
    .stat-val { font-size: 24px; font-weight: 800; color: #fff; }
    .chart-box { background: rgba(18, 14, 38, 0.85); border: 1px solid rgba(168,85,247,0.25); border-radius: 12px; padding: 20px; text-align: left; }
    .btn { background: linear-gradient(135deg, #a855f7, #6366f1); color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; }
  </style>
</head>
<body>
  <div class="nav">
    <div class="brand">📊 WaveMind SaaS Telemetry</div>
    <div><button class="btn" onclick="alert('Refreshed SaaS Analytics Stream!')">⚡ Live Sync</button></div>
  </div>

  <div class="grid">
    <div class="stat-card">
      <div class="stat-label">Daily Active Users</div>
      <div class="stat-val" id="val-dau">142,850</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">API Latency (Sub-50ms)</div>
      <div class="stat-val" style="color:#38bdf8">14.2 ms</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Monthly Recurring Revenue</div>
      <div class="stat-val" style="color:#34d399">₹28,50,000</div>
    </div>
  </div>

  <div class="chart-box">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <strong style="color:#c084fc">Real-Time Request Throughput</strong>
      <span style="font-size:12px;color:#34d399">● 99.99% Uptime</span>
    </div>
    <svg viewBox="0 0 500 120" style="width:100%;height:120px;">
      <path d="M 0 80 Q 60 30 120 70 T 240 40 T 360 80 T 500 20 L 500 120 L 0 120 Z" fill="rgba(168,85,247,0.2)" stroke="#a855f7" stroke-width="3"/>
    </svg>
  </div>
</body>
</html>`
    },
    aichat: {
      name: 'AI Customer RAG Support Hub',
      title: '🤖 AI Customer RAG Support Hub - Live App Preview',
      code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; background: #070710; color: #fff; margin: 0; padding: 20px; box-sizing: border-box; }
    .chat-box { background: rgba(18, 14, 38, 0.9); border: 1px solid rgba(168,85,247,0.3); border-radius: 16px; padding: 20px; max-width: 550px; margin: 0 auto; height: 380px; display: flex; flex-direction: column; }
    .chat-messages { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
    .msg { padding: 10px 14px; border-radius: 12px; font-size: 13px; max-width: 80%; }
    .msg-user { background: rgba(168,85,247,0.25); border: 1px solid rgba(168,85,247,0.4); align-self: flex-end; color: #fff; }
    .msg-ai { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); align-self: flex-start; color: #e2e8f0; }
    .input-row { display: flex; gap: 8px; }
    input { flex: 1; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 10px; border-radius: 8px; outline: none; }
    .btn { background: #a855f7; color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 700; cursor: pointer; }
  </style>
</head>
<body>
  <div class="chat-box">
    <div style="font-weight:700;color:#c084fc;margin-bottom:12px;">🤖 WaveMind AI Support Agent (RAG Mode)</div>
    <div class="chat-messages" id="msgs">
      <div class="msg msg-ai">Hello! How can I assist you with your project requirements today?</div>
    </div>
    <div class="input-row">
      <input type="text" id="prompt-input" placeholder="Type your query..." onkeydown="if(event.key==='Enter')sendMsg()">
      <button class="btn" onclick="sendMsg()">Send</button>
    </div>
  </div>

  <script>
    function sendMsg() {
      const inp = document.getElementById('prompt-input');
      const box = document.getElementById('msgs');
      if (!inp.value.trim()) return;
      
      const userDiv = document.createElement('div');
      userDiv.className = 'msg msg-user';
      userDiv.textContent = inp.value;
      box.appendChild(userDiv);
      
      const text = inp.value;
      inp.value = '';
      
      setTimeout(() => {
        const aiDiv = document.createElement('div');
        aiDiv.className = 'msg msg-ai';
        aiDiv.innerHTML = '✨ Analyzed query "' + text + '". WaveMind PGVector RAG Index matched relevant docs with 99.4% accuracy.';
        box.appendChild(aiDiv);
        box.scrollTop = box.scrollHeight;
      }, 600);
    }
  </script>
</body>
</html>`
    },
    ecommerce: {
      name: 'E-Commerce Quick-Commerce Portal',
      title: '🛒 E-Commerce Quick-Commerce Portal - Live App Preview',
      code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; background: #070710; color: #fff; margin: 0; padding: 20px; box-sizing: border-box; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .prod-card { background: rgba(18,14,38,0.85); border: 1px solid rgba(168,85,247,0.25); border-radius: 12px; padding: 16px; text-align: left; }
    .prod-img { height: 90px; background: rgba(168,85,247,0.15); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 32px; margin-bottom: 12px; }
    .prod-title { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
    .prod-price { font-size: 16px; font-weight: 800; color: #34d399; margin-bottom: 10px; }
    .btn { width: 100%; background: linear-gradient(135deg, #a855f7, #6366f1); color: #fff; border: none; padding: 8px; border-radius: 6px; font-weight: 700; cursor: pointer; }
  </style>
</head>
<body>
  <div class="header">
    <strong style="color:#c084fc;font-size:18px">🛒 QuickStore AI Catalog</strong>
    <span style="background:rgba(52,211,153,0.15);border:1px solid #34d399;color:#34d399;padding:4px 10px;border-radius:20px;font-size:12px">Cart: <span id="cart-cnt">0</span> items</span>
  </div>

  <div class="grid">
    <div class="prod-card">
      <div class="prod-img">📱</div>
      <div class="prod-title">WaveMind AI Smartphone</div>
      <div class="prod-price">₹45,999</div>
      <button class="btn" onclick="addCart()">Add to Cart (Razorpay UPI)</button>
    </div>
    <div class="prod-card">
      <div class="prod-img">🎧</div>
      <div class="prod-title">Noise-Canceling Wireless Pods</div>
      <div class="prod-price">₹4,999</div>
      <button class="btn" onclick="addCart()">Add to Cart (Razorpay UPI)</button>
    </div>
  </div>

  <script>
    let cnt = 0;
    function addCart() {
      cnt++;
      document.getElementById('cart-cnt').textContent = cnt;
      alert('Item added to cart! Razorpay One-Click UPI Checkout Ready.');
    }
  </script>
</body>
</html>`
    },
    fintech: {
      name: 'FinTech & Crypto Asset Portfolio',
      title: '💼 FinTech & Crypto Asset Portfolio - Live App Preview',
      code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; background: #070710; color: #fff; margin: 0; padding: 20px; box-sizing: border-box; }
    .box { background: rgba(18,14,38,0.85); border: 1px solid rgba(168,85,247,0.25); border-radius: 16px; padding: 20px; text-align: left; }
    .val { font-size: 32px; font-weight: 800; color: #34d399; margin: 8px 0 16px 0; }
    .row { display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding: 10px 0; font-size: 13px; }
    .btn { background: #38bdf8; color: #000; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; }
  </style>
</head>
<body>
  <div class="box">
    <div style="font-size:12px;color:#94a3b8">Total Asset Portfolio Value</div>
    <div class="val">₹14,85,200.00</div>

    <div style="font-size:14px;font-weight:700;color:#c084fc;margin-bottom:10px">Live Holdings & Ticker</div>

    <div class="row">
      <span>Bitcoin (BTC)</span>
      <strong style="color:#34d399">₹58,40,000 (+4.2%)</strong>
    </div>
    <div class="row">
      <span>Ethereum (ETH)</span>
      <strong style="color:#34d399">₹2,85,000 (+2.8%)</strong>
    </div>
    <div class="row">
      <span>Solana (SOL)</span>
      <strong style="color:#ef4444">₹12,400 (-1.1%)</strong>
    </div>

    <div style="margin-top:16px;display:flex;gap:10px;">
      <button class="btn" onclick="alert('Deposit via Razorpay UPI Instant Transfer')">Deposit INR</button>
      <button class="btn" style="background:#a855f7;color:#fff" onclick="alert('Sub-50ms Trade Executed')">Execute Trade</button>
    </div>
  </div>
</body>
</html>`
    }
  };

  let activeAppKey = 'saas';

  function updateIframeCode(htmlCode) {
    if (iframe) {
      iframe.srcdoc = htmlCode;
    }
  }

  appPresets.forEach(btn => {
    btn.addEventListener('click', () => {
      appPresets.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeAppKey = btn.getAttribute('data-app') || 'saas';

      const appData = appTemplates[activeAppKey] || appTemplates.saas;

      const windowTitle = document.getElementById('sandbox-title');
      if (windowTitle) windowTitle.textContent = appData.title;

      if (codeTextarea) codeTextarea.value = appData.code;
      updateIframeCode(appData.code);
    });
  });

  // Initial load
  const initialApp = appTemplates.saas;
  if (codeTextarea) codeTextarea.value = initialApp.code;
  updateIframeCode(initialApp.code);

  // Run button handler
  if (runBtn && codeTextarea) {
    runBtn.addEventListener('click', () => {
      updateIframeCode(codeTextarea.value);
      if (tabPreview) tabPreview.click();
      showToast('Live Application Code Executed! ▶');
    });
  }

  // Source Code File Downloader Engine
  if (exportCodeBtn && codeTextarea) {
    exportCodeBtn.addEventListener('click', () => {
      const appData = appTemplates[activeAppKey] || appTemplates.saas;
      const codeContent = codeTextarea.value || appData.code;

      const blob = new Blob([codeContent], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `WaveMind_${activeAppKey.toUpperCase()}_SourceCode.jsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Web App Source Code downloaded! 📥');
    });
  }

  // Device viewports switcher
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      toggles.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const width = btn.getAttribute('data-width');
      if (container) container.style.width = width;
    });
  });

  // Tab switching (Preview vs Code)
  if (tabPreview && tabCode && container && codeContainer) {
    tabPreview.addEventListener('click', () => {
      tabPreview.classList.add('active');
      tabCode.classList.remove('active');
      container.classList.remove('hidden');
      codeContainer.classList.add('hidden');
    });

    tabCode.addEventListener('click', () => {
      tabCode.classList.add('active');
      tabPreview.classList.remove('active');
      codeContainer.classList.remove('hidden');
      container.classList.add('hidden');
    });
  }
}

// Global helper to send Web App specs to Contact Form
window.sendWebAppToContact = function () {
  const messageInput = document.getElementById('textarea-message');
  const contactSection = document.getElementById('contact');

  if (messageInput) {
    messageInput.value = "Web Application Project Request: I want WaveMind Solutions Kolkata to build, engineer, and deploy a high-performance React 18 + Glassmorphism Web Application (Sub-50ms API Latency, Responsive Glass UI, PGVector RAG AI & Razorpay Payment Integration).";
  }

  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
    showToast('Web App Spec copied to Contact Form! 🚀');
  }
};

/**
 * 11. Visual Workflow Builder Modal Logic
 */
function setupWorkflowBuilder() {
  const testBtn = document.getElementById('btn-test-workflow');
  const exportJsonBtn = document.getElementById('btn-export-workflow-json');
  const logOutput = document.getElementById('workflow-log-output');
  const presetBtns = document.querySelectorAll('.workflow-preset-pill');

  const presetData = {
    support: {
      name: 'Customer Support AI Ticket Workflow',
      trigger: '⚡ Incoming Support Webhook (Zendesk / Intercom)',
      agent: '🤖 LLM Sentiment & Urgency Classifier',
      action: '💾 Sync Customer Ticket to PostgreSQL',
      notify: '💬 Slack & WhatsApp Alert to Support Team',
      logSuccess: 'Customer support ticket classified (High Priority), logged to PostgreSQL & notified support team via Slack.'
    },
    cart: {
      name: 'E-Commerce Cart Recovery & Razorpay Sync',
      trigger: '🛒 Abandoned Cart Event (Shopify / Custom SaaS)',
      agent: '🤖 AI Personal Discount Generator Agent',
      action: '💳 Razorpay Coupon Code API Generation',
      notify: '📩 Automated WhatsApp & Email Discount Link',
      logSuccess: 'Abandoned cart processed, Razorpay 10% coupon generated & dispatched via WhatsApp API.'
    },
    whatsapp: {
      name: 'WhatsApp Lead Scoring & CRM Intake',
      trigger: '💬 Incoming WhatsApp Inquiry Message',
      agent: '🤖 LLM Intent & BANT Qualification Model',
      action: '💾 Create Lead in WaveMind PostgreSQL CRM',
      notify: '🔔 High-Value Lead Alert to Sales Team',
      logSuccess: 'WhatsApp lead qualified (BANT Score 8.5/10), saved to CRM & alert sent to Kolkata sales team.'
    },
    refund: {
      name: 'Automated Invoice & Refund Processor',
      trigger: '💳 Stripe / Razorpay Refund Request Webhook',
      agent: '🤖 Policy Validation & Fraud Detection AI',
      action: '⚡ Automated Bank Refund Dispatched',
      notify: '📧 Email Confirmation & Ledger Audit Sync',
      logSuccess: 'Refund request validated by AI fraud classifier, approved & bank refund initiated.'
    }
  };

  let activePresetKey = 'support';

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePresetKey = btn.getAttribute('data-preset') || 'support';

      const data = presetData[activePresetKey] || presetData.support;

      const n1Title = document.getElementById('node-1-title');
      const n2Title = document.getElementById('node-2-title');
      const n3Title = document.getElementById('node-3-title');
      const n4Title = document.getElementById('node-4-title');

      if (n1Title) n1Title.textContent = data.trigger;
      if (n2Title) n2Title.textContent = data.agent;
      if (n3Title) n3Title.textContent = data.action;
      if (n4Title) n4Title.textContent = data.notify;

      if (logOutput) {
        logOutput.innerHTML = `[Preset Loaded] Selected "${escapeHTML(data.name)}". Click "Run Test Execution Simulation" to test pipeline.`;
      }
    });
  });

  // Animated Node Simulation Execution
  if (testBtn && logOutput) {
    testBtn.addEventListener('click', () => {
      const data = presetData[activePresetKey] || presetData.support;
      testBtn.disabled = true;

      const n1Status = document.getElementById('node-1-status');
      const n2Status = document.getElementById('node-2-status');
      const n3Status = document.getElementById('node-3-status');
      const n4Status = document.getElementById('node-4-status');

      if (n1Status) n1Status.textContent = 'Triggering...';
      if (n2Status) n2Status.textContent = 'Queued';
      if (n3Status) n3Status.textContent = 'Queued';
      if (n4Status) n4Status.textContent = 'Queued';

      logOutput.innerHTML = `[00:00.100] ⏳ Triggering event: ${escapeHTML(data.trigger)}...`;

      setTimeout(() => {
        if (n1Status) n1Status.textContent = 'Active';
        if (n2Status) n2Status.textContent = 'Processing...';
        logOutput.innerHTML += `<br>[00:00.400] 🤖 AI Agent analyzing payload with PGVector embeddings...`;
      }, 500);

      setTimeout(() => {
        if (n2Status) n2Status.textContent = 'Passed';
        if (n3Status) n3Status.textContent = 'Syncing...';
        logOutput.innerHTML += `<br>[00:00.900] 💾 Executing action: ${escapeHTML(data.action)}...`;
      }, 1000);

      setTimeout(() => {
        if (n3Status) n3Status.textContent = 'Synced';
        if (n4Status) n4Status.textContent = 'Dispatched';
        logOutput.innerHTML += `<br>[00:01.300] 💬 ${escapeHTML(data.notify)}...`;
        logOutput.innerHTML += `<br><strong style="color:#34d399;font-size:13px;">✅ Pipeline Executed Successfully in 1.3s!</strong><br><span style="color:#c084fc;">Log: ${escapeHTML(data.logSuccess)}</span>`;
        testBtn.disabled = false;
      }, 1500);
    });
  }

  // Export JSON Blueprint File Downloader
  if (exportJsonBtn) {
    exportJsonBtn.addEventListener('click', () => {
      const data = presetData[activePresetKey] || presetData.support;
      const specObj = {
        company: "WaveMind Solutions (Kolkata, India)",
        domain: "https://wavemindsolutions.in",
        workflowName: data.name,
        createdDate: new Date().toISOString(),
        nodes: [
          { step: 1, type: "TRIGGER", title: data.trigger, status: "CONFIGURED" },
          { step: 2, type: "AI_AGENT", title: data.agent, model: "GPT-4o / Claude 3.5", status: "ACTIVE" },
          { step: 3, type: "ACTION", title: data.action, status: "SYNCED" },
          { step: 4, type: "NOTIFICATION", title: data.notify, status: "ENABLED" }
        ],
        sla: "12-Hour Proposal Turnaround Guarantee"
      };

      const blob = new Blob([JSON.stringify(specObj, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `WaveMind_${activePresetKey.toUpperCase()}_Workflow_Blueprint.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Workflow JSON Blueprint downloaded! 📥');
    });
  }
}

// Global helper to send workflow spec to Contact Form
window.sendWorkflowToContact = function () {
  const messageInput = document.getElementById('textarea-message');
  const contactSection = document.getElementById('contact');

  if (messageInput) {
    messageInput.value = "Automated AI Workflow Request: I want WaveMind Solutions to build and deploy a custom Automated Workflow Pipeline (Webhook Trigger + LLM Decision Agent + Database Sync + WhatsApp/Slack Notifications).";
  }

  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
    showToast('Workflow Spec copied to Contact Form! 🚀');
  }
};

/**
 * 12. Mobile App Strategy Planner Modal Logic (10 Industry Strategies)
 */
function setupMobileStrategyPlanner() {
  const osBtns = document.querySelectorAll('.btn-os-switch');
  const osLabel = document.getElementById('phone-os-label');
  const exportBtn = document.getElementById('btn-export-mobile-spec');
  const strategyBtns = document.querySelectorAll('.strategy-pill-btn');
  const phoneBody = document.getElementById('phone-app-body-content');
  const specTitle = document.getElementById('strategy-spec-title');
  const specContent = document.getElementById('strategy-spec-content');

  const strategyData = {
    ecommerce: {
      title: '🛒 E-Commerce & Quick-Commerce App Strategy',
      phoneHeader: '🛒 E-Commerce App Experience',
      cards: [
        { title: '🤖 AI Vector Recommendation Engine', desc: 'Personalized product suggestions & semantic search.' },
        { title: '💳 Razorpay & UPI Instant Checkout', desc: 'GPay, PhonePe, Paytm & Card payment intent flow.' },
        { title: '📍 Live Order GPS Delivery Tracker', desc: 'Real-time rider position streaming on interactive map.' }
      ],
      specs: [
        'Core Framework: React Native 0.74 / Flutter 3.22 (Shared Core)',
        'Payment Gateway: Razorpay SDK, UPI Intent, Stripe Elements',
        'State Management: Redux Toolkit with MMKV Persistent Storage',
        'Push Alerts: Firebase Cloud Messaging (FCM) + Apple APNS',
        'Security: AES-256 Encrypted Keychain & Certificate Pinning'
      ]
    },
    fintech: {
      title: '🏦 FinTech & UPI Mobile Banking App Strategy',
      phoneHeader: '🏦 FinTech Banking Experience',
      cards: [
        { title: '🔒 Biometric Auth & FaceID', desc: 'Hardware-backed Secure Enclave Keyring authentication.' },
        { title: '⚡ Fast UPI Transfer & QR Scanner', desc: 'Zero-friction scan & pay transaction processing.' },
        { title: '📊 AI Spend Analytics & Budget Alerts', desc: 'Automated category classification & ledger charts.' }
      ],
      specs: [
        'Core Framework: Native Swift (iOS) & Kotlin (Android) or Flutter',
        'Security: PCI-DSS Level 1, OWASP Mobile Top 10 Compliance',
        'Biometrics: iOS LocalAuthentication & Android BiometricPrompt',
        'Database: Encrypted SQLCipher with KeyStore AES Keys',
        'SLA Guarantee: Sub-50ms API Latency with 99.99% Uptime'
      ]
    },
    telehealth: {
      title: '🩺 Telehealth & Patient AI Portal Strategy',
      phoneHeader: '🩺 Telehealth App Experience',
      cards: [
        { title: '🎥 HD WebRTC Video Consultation', desc: 'End-to-end encrypted doctor-patient video calls.' },
        { title: '📄 AI Prescription OCR Scanner', desc: 'Scans & digitizes paper prescriptions automatically.' },
        { title: '📅 Appointment & Vital Health Tracker', desc: 'Syncs with Apple HealthKit & Google Health Connect.' }
      ],
      specs: [
        'Core Framework: React Native with WebRTC Audio/Video SDK',
        'Compliance: HIPAA & DISHA Compliant Encrypted Storage',
        'AI Engine: PGVector Vision OCR & Symptom Classifier',
        'Health Sync: HealthKit (iOS) & Health Connect (Android)',
        'Storage: Encrypted AWS S3 BUCKET for Medical Vault'
      ]
    },
    logistics: {
      title: '🚗 Ride-Sharing & Logistics Fleet App Strategy',
      phoneHeader: '🚗 Logistics Fleet Experience',
      cards: [
        { title: '🗺️ High-Precision Mapbox GPS', desc: 'Sub-second driver coordinates broadcast via WebSockets.' },
        { title: '🚕 Dynamic Fare Calculator Engine', desc: 'Calculates surge pricing, distance, & toll fees.' },
        { title: '📦 Proof of Delivery Camera Scan', desc: 'Capture barcode scan & signature on glass.' }
      ],
      specs: [
        'Core Framework: Flutter 3.22 for smooth 60fps Map rendering',
        'Location Engine: Background Location Tracking Daemon',
        'Messaging: Socket.io / MQTT Real-Time Pub-Sub Engine',
        'Backend: Node.js Microservices + Redis Spatial Geospatial Index',
        'Database: PostgreSQL with PostGIS Spatial Extensions'
      ]
    },
    edtech: {
      title: '🎓 EdTech & Live Streaming Learning App Strategy',
      phoneHeader: '🎓 EdTech Learning Experience',
      cards: [
        { title: '📺 DRM Protected HLS Video Stream', desc: 'Prevents screen recording & unauthorized downloads.' },
        { title: '📝 Interactive AI Quiz & Doubt Solver', desc: 'Instant solution breakdown from video timestamps.' },
        { title: '📥 Offline Video Encrypted Downloads', desc: 'Study on-the-go without active mobile data connection.' }
      ],
      specs: [
        'Core Framework: React Native with ExoPlayer (Android) & AVPlayer (iOS)',
        'Streaming: HLS / DASH Adaptive Bitrate Video over CloudFront',
        'Security: Widevine DRM & FairPlay Streaming License Keys',
        'Offline Cache: AES-128 Chunked Video Encrypted Storage',
        'Analytics: Video Engagement Timeline Telemetry Analytics'
      ]
    },
    realestate: {
      title: '🏠 Real Estate & AR 3D Home Tour Strategy',
      phoneHeader: '🏠 Real Estate App Experience',
      cards: [
        { title: '🕶️ ARKit / ARCore 3D Room Furniture', desc: 'Visualize furniture in your room using phone camera.' },
        { title: '🏙️ 360-Degree Panoramic Virtual Tour', desc: 'Immersive property walk-through rendering.' },
        { title: '💬 Direct Agent Instant Call & Chat', desc: 'Schedule property site visits with 1-click.' }
      ],
      specs: [
        'Core Framework: Flutter with Unity / SceneKit / ARCore Integration',
        '3D Engine: Three.js / SceneView GL Engine integration',
        'Location: Geo-fence Property Radar Search Radius',
        'Media: Cloudinary / AWS S3 Image & Video Optimization',
        'Lead Engine: Auto-sync to WaveMind Enterprise CRM'
      ]
    },
    fooddelivery: {
      title: '🍔 Food Delivery & Cloud Kitchen Strategy',
      phoneHeader: '🍔 Cloud Kitchen Experience',
      cards: [
        { title: '🍕 Live Kitchen Cam & Order Stream', desc: 'Watch your food preparation live on video stream.' },
        { title: '🛵 Real-Time Rider ETA & Map', desc: 'Sub-minute accurate delivery time countdown.' },
        { title: '🎁 Loyalty Scratch Cards & Rewards', desc: 'Gamified rewards & instant discount coupons.' }
      ],
      specs: [
        'Core Framework: React Native 0.74 with Reanimated 3 Animations',
        'Payment: Razorpay UPI Auto-Pay Subscriptions',
        'Order Engine: Distributed Queue Architecture (BullMQ + Redis)',
        'Push Alerts: APNS Silent Push & FCM High-Priority Notifications',
        'Map SDK: Google Maps SDK / Ola Maps API'
      ]
    },
    fitness: {
      title: '🏋️ Fitness AI & Wearable Tracker Strategy',
      phoneHeader: '🏋️ Fitness AI Experience',
      cards: [
        { title: '⌚ Apple Watch & Galaxy Watch Sync', desc: 'Real-time heart rate & calorie burn telemetry.' },
        { title: '🥗 AI Meal Photo Calorie Counter', desc: 'Upload food photo to estimate macros & calories.' },
        { title: '🏋️ Camera Pose Estimation Coach', desc: 'AI counts squat & push-up reps via front camera.' }
      ],
      specs: [
        'Core Framework: Native iOS (SwiftUI + HealthKit) & Android (Jetpack Compose)',
        'AI Vision: TensorFlow Lite / CoreML Pose Detection Engine',
        'Sensors: Accelerometer, Gyroscope & Bluetooth LE Wearables',
        'Sync Engine: Background Sync with Server Delta Cache',
        'UI Design: High-contrast Dark Mode with Neon Glass Accents'
      ]
    },
    crm: {
      title: '💼 Enterprise Field Workforce CRM Strategy',
      phoneHeader: '💼 Field CRM Experience',
      cards: [
        { title: '📍 Geo-Fence Attendance Check-In', desc: 'Verifies employee GPS location at client office site.' },
        { title: '📝 Offline Draft Lead Data Intake', desc: 'Fill forms without internet; auto-syncs when online.' },
        { title: '📊 Daily Performance Telemetry Chart', desc: 'Track sales calls, visits, and closed deals.' }
      ],
      specs: [
        'Core Framework: React Native with WatermelonDB Offline-First SQLite',
        'Sync Protocol: Operational Transformation (OT) Lead Merger',
        'Security: OAuth 2.0 + OIDC Multi-Factor Authentication',
        'Export Engine: On-device PDF Report Generator',
        'Backend: Node.js Microservices on AWS Elastic Kubernetes'
      ]
    },
    mediastream: {
      title: '🎵 Media Streaming & Short Video Strategy',
      phoneHeader: '🎵 Media Streaming Experience',
      cards: [
        { title: '⚡ Sub-100ms Infinite Video Feed', desc: 'Seamless vertical swipe with pre-buffered video chunks.' },
        { title: '🎙️ Audio Dubbing & Creator Studio', desc: 'Record audio overlays & apply visual filters.' },
        { title: '❤️ Real-Time Live Stream Gift Chat', desc: 'Interact with creators via WebSocket live chat.' }
      ],
      specs: [
        'Core Framework: Flutter 3.22 with Custom Video Pre-Cache Controller',
        'CDN Engine: AWS CloudFront + Fastly Edge Video Distribution',
        'Video Encoder: H.264 / HEVC Adaptive Bitrate Transcoding',
        'WebSockets: Distributed Socket Cluster for Live Chat',
        'Storage: Distributed S3 Storage with CDN Caching'
      ]
    }
  };

  let activeStrategyKey = 'ecommerce';

  strategyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      strategyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeStrategyKey = btn.getAttribute('data-strategy') || 'ecommerce';

      const data = strategyData[activeStrategyKey] || strategyData.ecommerce;

      if (phoneBody) {
        phoneBody.innerHTML = data.cards.map(c => `
          <div class="app-card-item">
            <div class="app-card-title">${escapeHTML(c.title)}</div>
            <p>${escapeHTML(c.desc)}</p>
          </div>
        `).join('');
      }

      if (osLabel) osLabel.textContent = data.phoneHeader;
      if (specTitle) specTitle.textContent = data.title;

      if (specContent) {
        specContent.innerHTML = `
          <ul class="specs-list">
            ${data.specs.map(s => `<li><strong>${escapeHTML(s.split(':')[0])}:</strong> ${escapeHTML(s.split(':')[1] || '')}</li>`).join('')}
          </ul>
        `;
      }
    });
  });

  osBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      osBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const os = btn.getAttribute('data-os');
      const data = strategyData[activeStrategyKey] || strategyData.ecommerce;
      if (osLabel) {
        osLabel.textContent = os === 'ios' ? `${data.phoneHeader} (iOS View)` : `${data.phoneHeader} (Android View)`;
      }
    });
  });

  // Report File Downloader Engine
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const data = strategyData[activeStrategyKey] || strategyData.ecommerce;
      const reportText = `====================================================================
WAVEMIND SOLUTIONS (KOLKATA, INDIA) - MOBILE APP STRATEGY REPORT
====================================================================
Official Domain: https://wavemindsolutions.in
Contact Email: info@wavemindsolutions.in | Phone: +91 82828 43434
Headquarters: 13, Kalupara Lane, Kolkata, West Bengal 700029, India
====================================================================

SELECTED STRATEGY BLUEPRINT: ${data.title}
DATE GENERATED: ${new Date().toLocaleDateString('en-IN')}

[1. CORE MOBILE FEATURE MODULES]
${data.cards.map((c, i) => `   ${i + 1}. ${c.title}
      Details: ${c.desc}`).join('\n\n')}

[2. TECHNICAL ARCHITECTURE RECOMMENDATIONS]
${data.specs.map(s => `   • ${s}`).join('\n')}

[3. SLA & CODE OWNERSHIP WARRANTY]
   • 100% Intellectual Property Code Ownership
   • Sub-50ms API Latency SLA Guarantee
   • 30-Day Post-Launch Warranty & Deployment Support
   • 12-Hour Proposal Turnaround SLA

====================================================================
WaveMind Solutions Kolkata - Architecting Enterprise Digital Scale
====================================================================`;

      const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `WaveMind_${activeStrategyKey.toUpperCase()}_Mobile_Strategy_Report.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Mobile Strategy Report downloaded! 📥');
    });
  }
}

/**
 * Helper: Modal Open / Close Handler
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('hidden');
}

document.querySelectorAll('[data-close-modal]').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-close-modal');
    const modal = document.getElementById(targetId);
    if (modal) modal.classList.add('hidden');
  });
});

/**
 * 13. Contact Form Submission Simulation
 */
function setupContactFormValidation() {
  const form = document.getElementById('contact-form');
  const successBox = document.getElementById('form-success-box');
  const resetBtn = document.getElementById('btn-form-reset');

  if (!form || !successBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('btn-submit');
    const btnText = document.getElementById('btn-text');
    const spinner = document.getElementById('btn-spinner');

    if (submitBtn && btnText && spinner) {
      submitBtn.disabled = true;
      btnText.textContent = 'Submitting...';
      spinner.classList.add('show');

      setTimeout(() => {
        submitBtn.disabled = false;
        btnText.textContent = 'Submit Request';
        spinner.classList.remove('show');
        form.style.display = 'none';
        successBox.classList.add('show');
      }, 1200);
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'block';
      successBox.classList.remove('show');
    });
  }
}

/**
 * 14. Executive Interviewer Showcase Portfolio Modal
 */
function setupInterviewerShowcaseModal() {
  const showcaseBtn = document.getElementById('btn-open-showcase');
  const modal = document.getElementById('modal-interviewer-showcase');
  const tabBtns = document.querySelectorAll('.showcase-tab-btn');
  const tabContents = document.querySelectorAll('.showcase-tab-content');

  if (showcaseBtn && modal) {
    showcaseBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTabId = btn.getAttribute('data-showcase-tab');
      tabContents.forEach(content => {
        if (content.getAttribute('id') === targetTabId) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      });
    });
  });
}

/**
 * 15. Interactive Background Particle Canvas Mesh
 */
function setupParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 45;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particleCount; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(192, 132, 252, 0.4)';
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particleCount; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p2.x - p.x, p2.y - p.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.18 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/**
 * 16. Industry Prompt Templates Gallery Modal Logic
 */
function setupPromptTemplatesModal() {
  const openBtn = document.getElementById('btn-open-templates');
  const modal = document.getElementById('modal-prompt-templates');
  const templateCards = document.querySelectorAll('.template-card');
  const promptInput = document.getElementById('ai-prompt-input');
  const sendBtn = document.getElementById('btn-send-prompt');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });
  }

  templateCards.forEach(card => {
    card.addEventListener('click', () => {
      const templatePrompt = card.getAttribute('data-template-prompt');
      if (promptInput && sendBtn && templatePrompt) {
        promptInput.value = templatePrompt;
        modal.classList.add('hidden');
        sendBtn.click();
      }
    });
  });
}

/**
 * 17. Keyboard Shortcuts (Ctrl+K) & Back-to-Top FAB
 */
function setupKeyboardShortcutsAndFAB() {
  const fab = document.getElementById('btn-back-to-top');
  const promptInput = document.getElementById('ai-prompt-input');
  const agenticSection = document.getElementById('agentic-ai');

  // Back-to-Top FAB scroll visibility & click
  window.addEventListener('scroll', () => {
    if (fab) {
      if (window.scrollY > 400) {
        fab.classList.remove('hidden');
      } else {
        fab.classList.add('hidden');
      }
    }
  });

  if (fab && agenticSection) {
    fab.addEventListener('click', () => {
      agenticSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Keyboard Shortcuts: Ctrl + K or / to focus AI console
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      focusConsole();
    } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      focusConsole();
    }
  });

  function focusConsole() {
    if (promptInput) {
      if (agenticSection) agenticSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => promptInput.focus(), 300);
      showToast('AI Console Focused (Ctrl + K active)');
    }
  }
}

/**
 * Toast Notification Helper
 */
function showToast(message) {
  const box = document.getElementById('toast-notification-box');
  const msgEl = document.getElementById('toast-msg');
  if (!box || !msgEl) return;

  msgEl.textContent = message;
  box.classList.remove('hidden');

  setTimeout(() => {
    box.classList.add('hidden');
  }, 2500);
}

/**
 * 18. Real-Time Glassmorphic AI Telemetry & Data Visualization Charts
 */
function setupAITelemetryCharts() {
  const toggleBtn = document.getElementById('btn-toggle-telemetry');
  const bodyGrid = document.getElementById('telemetry-content-body');
  const canvasLatency = document.getElementById('chart-canvas-latency');
  const canvasQps = document.getElementById('chart-canvas-throughput');
  const liveLatencyEl = document.getElementById('live-val-latency');
  const liveQpsEl = document.getElementById('live-val-qps');

  if (toggleBtn && bodyGrid) {
    toggleBtn.addEventListener('click', () => {
      const isHidden = bodyGrid.classList.toggle('hidden');
      toggleBtn.textContent = isHidden ? 'Show Charts ▴' : 'Hide Charts ▾';
    });
  }

  // Live Latency Line Chart Render
  if (canvasLatency) {
    const ctx = canvasLatency.getContext('2d');
    const points = [14, 12, 16, 11, 15, 13, 18, 14, 12, 15, 13, 14];

    function drawLatencyChart() {
      const w = (canvasLatency.width = canvasLatency.clientWidth);
      const h = (canvasLatency.height = canvasLatency.clientHeight);
      ctx.clearRect(0, 0, w, h);

      // Shift data point
      points.shift();
      const nextVal = (Math.random() * 6 + 11).toFixed(1);
      points.push(parseFloat(nextVal));
      if (liveLatencyEl) liveLatencyEl.textContent = `${nextVal} ms`;

      // Draw Gradient Line
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

      ctx.beginPath();
      const step = w / (points.length - 1);
      points.forEach((val, i) => {
        const x = i * step;
        const y = h - (val / 30) * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Area fill
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    }

    setInterval(drawLatencyChart, 1500);
    drawLatencyChart();
  }

  // Live Vector QPS Bar Chart Render
  if (canvasQps) {
    const ctx = canvasQps.getContext('2d');
    const bars = [2100, 2350, 2420, 2280, 2500, 2410, 2390, 2460];

    function drawQpsChart() {
      const w = (canvasQps.width = canvasQps.clientWidth);
      const h = (canvasQps.height = canvasQps.clientHeight);
      ctx.clearRect(0, 0, w, h);

      bars.shift();
      const nextVal = Math.floor(Math.random() * 300 + 2250);
      bars.push(nextVal);
      if (liveQpsEl) liveQpsEl.textContent = `${nextVal.toLocaleString()} rps`;

      const barWidth = w / bars.length - 6;
      bars.forEach((val, i) => {
        const barH = (val / 3000) * h;
        const x = i * (barWidth + 6) + 3;
        const y = h - barH;

        ctx.fillStyle = i === bars.length - 1 ? '#c084fc' : 'rgba(168, 85, 247, 0.35)';
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barH, 4);
        ctx.fill();
      });
    }

    setInterval(drawQpsChart, 1800);
    drawQpsChart();
  }
}

/**
 * 19. Footer Newsletter Subscription Handler
 */
function setupNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  const emailInput = document.getElementById('newsletter-email');

  if (form && emailInput) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (email) {
        showToast('Subscribed to WaveMind AI Digest! 📩');
        emailInput.value = '';
      }
    });
  }
}

/**
 * 20. FAQ Accordion Expansion Logic
 */
function setupFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer-content');

    if (btn && answer) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer-content');
          if (otherAnswer) otherAnswer.classList.add('hidden');
        });

        // Toggle clicked item
        if (!isActive) {
          item.classList.add('active');
          answer.classList.remove('hidden');
        }
      });
    }
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g,
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Initial Seed Threads for instant presentation upon opening Past Threads History
const SEED_PAST_THREADS = [
  {
    id: 'thread_seed_1',
    title: '🏢 Corporate AI Architecture & Kolkata Office Details',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    model: '🤖 WaveMind Agentic 2.0',
    messages: [
      {
        id: 'msg_s1',
        sender: 'user',
        text: 'Who is WaveMind Solutions? Where is your Kolkata office located?',
        files: [],
        images: [],
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'msg_s2',
        sender: 'ai',
        text: 'WaveMind Solutions Kolkata HQ: 13 Kalupara Lane, Kolkata 700029, WB, India. Phone: +91 82828 43434.',
        html: `<p style="color:#c084fc;font-weight:700;font-size:15px;margin-bottom:8px;">🏢 WaveMind Solutions Kolkata - Corporate Credentials</p><p>WaveMind Solutions is a leading Indian digital transformation and AI engineering enterprise based in Kolkata, West Bengal, India.</p><div style="background:rgba(255,255,255,0.04);border:1px solid rgba(168,85,247,0.3);border-radius:12px;padding:14px;margin:12px 0;"><div style="margin-bottom:8px;font-size:13px;">📍 <strong>Headquarters Address:</strong> 13, Kalupara Lane, Kolkata, West Bengal 700029, India</div><div style="margin-bottom:8px;font-size:13px;">📞 <strong>Official Phone / WhatsApp:</strong> +91 82828 43434</div><div style="font-size:13px;">📧 <strong>Official Email:</strong> info@wavemindsolutions.in</div></div>`,
        files: [],
        images: [],
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ]
  },
  {
    id: 'thread_seed_2',
    title: '💻 High-Performance React 18 & Node.js Microservices',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    model: '🚀 GPT-4o Enterprise',
    messages: [
      {
        id: 'msg_s3',
        sender: 'user',
        text: 'What tech stack do you recommend for an AI-powered SaaS dashboard with sub-50ms latency?',
        files: [],
        images: [],
        timestamp: new Date(Date.now() - 3600000 * 18).toISOString()
      },
      {
        id: 'msg_s4',
        sender: 'ai',
        text: 'Recommended Stack: React 18 + Node.js + PostgreSQL PGVector + Redis Caching.',
        html: `<p style="color:#c084fc;font-weight:700;font-size:15px;margin-bottom:8px;">💻 Recommended SaaS Architecture Blueprint</p><p>Frontend: React 18 + Vite + Tailwind/Glassmorphism CSS<br>Backend: Node.js Microservices + Redis + PostgreSQL (PGVector)<br>AI RAG: OpenAI GPT-4o with sub-50ms vector caching.</p>`,
        files: [],
        images: [],
        timestamp: new Date(Date.now() - 3600000 * 18).toISOString()
      }
    ]
  },
  {
    id: 'thread_seed_3',
    title: '📱 Cross-Platform Flutter & iOS App Quotation Blueprint',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    model: '⚡ Claude 3.5 Sonnet',
    messages: [
      {
        id: 'msg_s5',
        sender: 'user',
        text: 'Estimate cost for a cross-platform mobile app with Razorpay payment integration.',
        files: [],
        images: [],
        timestamp: new Date(Date.now() - 3600000 * 36).toISOString()
      },
      {
        id: 'msg_s6',
        sender: 'ai',
        text: 'Mobile App Quotation: ₹1,80,000 - ₹3,50,000 INR with 4-6 Weeks SLA.',
        html: `<p style="color:#c084fc;font-weight:700;font-size:15px;margin-bottom:8px;">📱 Mobile App Quotation Blueprint</p><p>Estimated Cost: ₹1,80,000 - ₹3,50,000 INR.<br>Delivery SLA: 4 - 6 Weeks.<br>Includes iOS & Android builds, admin console, and Razorpay gateway.</p>`,
        files: [],
        images: [],
        timestamp: new Date(Date.now() - 3600000 * 36).toISOString()
      }
    ]
  }
];

/**
 * 21. Past Thread Storage & History API Handler
 */
function initPastThreadHistory() {
  const stored = localStorage.getItem('wavemind_past_threads');
  if (stored) {
    try {
      state.pastThreads = JSON.parse(stored);
    } catch (e) {
      state.pastThreads = SEED_PAST_THREADS;
    }
  } else {
    state.pastThreads = SEED_PAST_THREADS;
    localStorage.setItem('wavemind_past_threads', JSON.stringify(SEED_PAST_THREADS));
  }

  if (state.pastThreads.length > 0) {
    const lastActiveId = localStorage.getItem('wavemind_active_thread_id');
    const target = state.pastThreads.find(t => t.id === lastActiveId) || state.pastThreads[0];
    state.activeThreadId = target.id;
    state.activeChatHistory = target.messages || [];
  }

  updatePastThreadsCountBadge();
  renderQuickThreadChips();
}

function savePastThreadsToStorage() {
  localStorage.setItem('wavemind_past_threads', JSON.stringify(state.pastThreads));
  if (state.activeThreadId) {
    localStorage.setItem('wavemind_active_thread_id', state.activeThreadId);
  }
  updatePastThreadsCountBadge();
  renderQuickThreadChips();
}

function updatePastThreadsCountBadge() {
  const badge = document.getElementById('past-threads-count');
  if (badge) badge.textContent = state.pastThreads.length;
}

function renderQuickThreadChips() {
  const container = document.getElementById('quick-threads-chips-container');
  if (!container) return;

  container.innerHTML = '';
  if (!state.pastThreads || state.pastThreads.length === 0) {
    container.innerHTML = `<span style="font-size:11px;color:var(--color-text-subtle);">No past history threads</span>`;
    return;
  }

  const recent = state.pastThreads.slice(0, 4);
  recent.forEach(t => {
    const isActive = t.id === state.activeThreadId;
    const btn = document.createElement('button');
    btn.className = 'strategy-pill-btn' + (isActive ? ' active' : '');
    btn.style.cssText = `font-size:11px;padding:4px 10px;border-radius:12px;white-space:nowrap;max-width:170px;overflow:hidden;text-overflow:ellipsis;${isActive ? 'background:linear-gradient(135deg,#a855f7,#6366f1);color:#fff;border-color:#c084fc;' : 'background:rgba(255,255,255,0.06);color:#cbd5e1;border:1px solid rgba(255,255,255,0.1);'}`;
    btn.textContent = '💬 ' + t.title;
    btn.title = t.title;
    btn.onclick = () => {
      loadThreadIntoChat(t.id);
    };
    container.appendChild(btn);
  });
}

function createNewThread(initialTitle) {
  const modelSelect = document.getElementById('select-ai-model');
  const modelName = modelSelect ? modelSelect.options[modelSelect.selectedIndex].text : '🤖 WaveMind Agentic 2.0';

  const newThread = {
    id: 'thread_' + Date.now(),
    title: initialTitle || 'New AI Conversation Thread',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    model: modelName,
    messages: []
  };

  state.pastThreads.unshift(newThread);
  state.activeThreadId = newThread.id;
  state.activeChatHistory = [];

  const messagesBox = document.getElementById('chat-messages-box');
  if (messagesBox) messagesBox.innerHTML = '';

  const titleDisplay = document.getElementById('active-thread-title-display');
  if (titleDisplay) titleDisplay.textContent = newThread.title;

  savePastThreadsToStorage();
  return newThread;
}

function addMessageToActiveThread(msgObj) {
  let thread = state.pastThreads.find(t => t.id === state.activeThreadId);
  if (!thread) {
    const titleSnippet = msgObj.text ? (msgObj.text.slice(0, 42) + (msgObj.text.length > 42 ? '...' : '')) : 'AI Chat Thread';
    thread = createNewThread(titleSnippet);
  }

  if (msgObj.sender === 'user' && (thread.title === 'New AI Conversation Thread' || thread.title.startsWith('Thread #'))) {
    thread.title = msgObj.text.slice(0, 45) + (msgObj.text.length > 45 ? '...' : '');
  }

  thread.updatedAt = new Date().toISOString();
  thread.messages.push(msgObj);
  state.activeChatHistory = thread.messages;

  const titleDisplay = document.getElementById('active-thread-title-display');
  if (titleDisplay) titleDisplay.textContent = thread.title;

  savePastThreadsToStorage();
}

function loadThreadIntoChat(threadId) {
  const thread = state.pastThreads.find(t => t.id === threadId);
  if (!thread) return;

  state.activeThreadId = thread.id;
  state.activeChatHistory = thread.messages || [];
  localStorage.setItem('wavemind_active_thread_id', thread.id);

  const chatThread = document.getElementById('ai-chat-thread');
  const messagesBox = document.getElementById('chat-messages-box');
  const titleDisplay = document.getElementById('active-thread-title-display');

  if (titleDisplay) titleDisplay.textContent = thread.title;
  if (chatThread) chatThread.classList.remove('hidden');

  if (messagesBox) {
    messagesBox.innerHTML = '';
    (thread.messages || []).forEach(msg => {
      renderStoredChatMessage(msg);
    });
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }

  const modal = document.getElementById('modal-thread-history');
  if (modal) modal.classList.add('hidden');

  renderQuickThreadChips();
  showToast(`Loaded Past Thread: "${thread.title.slice(0, 25)}..." 📜`);
}

function renderStoredChatMessage(msg) {
  const messagesBox = document.getElementById('chat-messages-box');
  if (!messagesBox) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg chat-msg-${msg.sender === 'user' ? 'user' : 'ai'}`;

  const avatar = msg.sender === 'user' ? '👤' : '✨';
  const name = msg.sender === 'user' ? 'You' : 'WaveMind AI';

  let attachmentsHTML = '';
  if ((msg.files && msg.files.length > 0) || (msg.images && msg.images.length > 0)) {
    const fileChips = (msg.files || []).map(f => `<span class="attachment-chip">📄 ${escapeHTML(f)}</span>`).join(' ');
    const imgChips = (msg.images || []).map(i => `<span class="attachment-chip">🖼️ ${escapeHTML(i)}</span>`).join(' ');
    attachmentsHTML = `<div style="margin-bottom:8px;display:flex;flex-wrap:wrap;gap:6px;">${fileChips} ${imgChips}</div>`;
  }

  const contentHTML = msg.html || `<div class="msg-content">${escapeHTML(msg.text || '')}</div>`;

  msgDiv.innerHTML = `
    <div class="chat-avatar">${avatar}</div>
    <div class="chat-bubble">
      <div style="font-weight:700;font-size:12px;margin-bottom:4px;color:${msg.sender === 'user' ? '#818cf8' : '#c084fc'}">${name}</div>
      ${attachmentsHTML}
      ${contentHTML}
    </div>
  `;

  messagesBox.appendChild(msgDiv);
}

function deleteThread(threadId) {
  state.pastThreads = state.pastThreads.filter(t => t.id !== threadId);
  if (state.activeThreadId === threadId) {
    if (state.pastThreads.length > 0) {
      loadThreadIntoChat(state.pastThreads[0].id);
    } else {
      createNewThread();
    }
  }
  savePastThreadsToStorage();
  renderPastThreadsList();
  showToast('Chat thread deleted! 🗑️');
}

function clearAllThreads() {
  if (confirm('Are you sure you want to delete all past conversation thread history?')) {
    state.pastThreads = [];
    state.activeThreadId = null;
    state.activeChatHistory = [];
    savePastThreadsToStorage();
    createNewThread('New AI Conversation Thread');
    renderPastThreadsList();
    showToast('All past threads cleared! 🧹');
  }
}

function exportThreadsJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.pastThreads, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `wavemind_thread_history_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('Past thread history exported as JSON! 📥');
}

function renderPastThreadsList(searchQuery = '') {
  const container = document.getElementById('past-threads-list-container');
  if (!container) return;

  const query = searchQuery.toLowerCase().trim();
  const filtered = state.pastThreads.filter(t => {
    if (!query) return true;
    const titleMatch = t.title.toLowerCase().includes(query);
    const msgMatch = (t.messages || []).some(m => (m.text || '').toLowerCase().includes(query));
    return titleMatch || msgMatch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:40px 20px;color:var(--color-text-muted);">
        <div style="font-size:36px;margin-bottom:12px;">📭</div>
        <p style="font-weight:700;font-size:15px;color:#fff;">No Past Chat Threads Found</p>
        <p style="font-size:13px;margin-top:4px;">${query ? 'No matching threads for your query.' : 'Start chatting with WaveMind AI to save thread history!'}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  filtered.forEach(thread => {
    const card = document.createElement('div');
    card.className = 'past-thread-card';
    card.style.cssText = `
      background: rgba(18, 14, 38, 0.75);
      border: 1px solid ${thread.id === state.activeThreadId ? 'rgba(192, 132, 252, 0.6)' : 'rgba(168, 85, 247, 0.2)'};
      border-radius: 14px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      transition: all 0.2s ease;
    `;

    const lastMsg = thread.messages && thread.messages.length > 0 ? thread.messages[thread.messages.length - 1].text : 'No messages';
    const msgCount = thread.messages ? thread.messages.length : 0;
    const timeFormatted = formatTimeAgo(thread.updatedAt || thread.createdAt);
    const isActive = thread.id === state.activeThreadId;

    card.innerHTML = `
      <div style="flex:1;min-width:0;cursor:pointer;" onclick="window.loadThreadIntoChatGlobal('${thread.id}')">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap;">
          <span style="font-weight:700;font-size:14px;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHTML(thread.title)}</span>
          ${isActive ? '<span style="background:rgba(16,185,129,0.2);border:1px solid rgba(16,185,129,0.4);color:#34d399;font-size:10px;font-weight:700;padding:2px 8px;border-radius:12px;">Active Thread</span>' : ''}
          <span style="background:rgba(168,85,247,0.2);border:1px solid rgba(168,85,247,0.3);color:#c084fc;font-size:10px;font-weight:600;padding:2px 8px;border-radius:12px;">${escapeHTML(thread.model || 'WaveMind AI')}</span>
        </div>
        <div style="font-size:12px;color:var(--color-text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:6px;">
          💬 ${escapeHTML(lastMsg)}
        </div>
        <div style="font-size:11px;color:var(--color-text-subtle);display:flex;gap:12px;align-items:center;">
          <span>🕒 ${timeFormatted}</span>
          <span>💬 ${msgCount} messages</span>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
        <button class="btn-primary" style="padding:6px 12px;font-size:12px;" onclick="window.loadThreadIntoChatGlobal('${thread.id}')">📖 Open</button>
        <button class="btn-secondary" style="padding:6px 10px;font-size:12px;border-color:#ef4444;color:#ef4444;" onclick="window.deleteThreadGlobal('${thread.id}')" title="Delete Thread">🗑️</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function formatTimeAgo(isoString) {
  if (!isoString) return 'Just now';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

window.loadThreadIntoChatGlobal = loadThreadIntoChat;
window.deleteThreadGlobal = deleteThread;

function setupThreadHistoryUI() {
  initPastThreadHistory();

  const btnOpen = document.getElementById('btn-open-thread-history');
  const btnHeaderOpen = document.getElementById('btn-header-thread-history');
  const btnNewThread = document.getElementById('btn-start-new-thread');
  const btnExport = document.getElementById('btn-export-threads-json');
  const btnClearAll = document.getElementById('btn-clear-all-threads');
  const searchInput = document.getElementById('input-search-past-threads');
  const btnQuickNew = document.getElementById('btn-quick-new-thread');
  const btnQuickAll = document.getElementById('btn-quick-all-history');

  const openHistoryModal = () => {
    openModal('modal-thread-history');
    renderPastThreadsList();
  };

  if (btnOpen) btnOpen.addEventListener('click', openHistoryModal);
  if (btnHeaderOpen) btnHeaderOpen.addEventListener('click', openHistoryModal);
  if (btnQuickAll) btnQuickAll.addEventListener('click', openHistoryModal);

  const startNewThreadHandler = () => {
    const thread = createNewThread('New AI Conversation Thread');
    const modal = document.getElementById('modal-thread-history');
    if (modal) modal.classList.add('hidden');
    const chatThread = document.getElementById('ai-chat-thread');
    if (chatThread) chatThread.classList.remove('hidden');
    showToast('Started New AI Chat Thread! 🚀');
  };

  if (btnNewThread) btnNewThread.addEventListener('click', startNewThreadHandler);
  if (btnQuickNew) btnQuickNew.addEventListener('click', startNewThreadHandler);

  if (btnExport) btnExport.addEventListener('click', exportThreadsJSON);
  if (btnClearAll) btnClearAll.addEventListener('click', clearAllThreads);

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderPastThreadsList(e.target.value);
    });
  }
}







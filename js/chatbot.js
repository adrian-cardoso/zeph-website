/**
 * Zeph Chatbot — Core Engine
 * IIFE pattern for isolation. Injects DOM, handles keyword matching,
 * message rendering, typing animation, session persistence, accessibility.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'zeph-chat-history';
  var MIN_SCORE_THRESHOLD = 2;
  var TYPING_DELAY = 600;

  // ===== DOM Injection =====
  function buildDOM() {
    // Floating action button
    var fab = document.createElement('button');
    fab.className = 'zeph-chat-fab';
    fab.setAttribute('aria-label', 'Open chat assistant');
    fab.setAttribute('aria-expanded', 'false');
    fab.innerHTML =
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>' +
      '<path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>' +
      '</svg>';

    // Chat window
    var win = document.createElement('div');
    win.className = 'zeph-chat-window';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'Zeph Chat Assistant');
    win.innerHTML =
      '<div class="zeph-chat-header">' +
        '<div class="zeph-chat-header-title">' +
          '<div class="zeph-chat-header-avatar">Z</div>' +
          '<div><div>Zeph Assistant</div><div class="zeph-chat-header-status">Online</div></div>' +
        '</div>' +
        '<button class="zeph-chat-close" aria-label="Close chat">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
          '</svg>' +
        '</button>' +
      '</div>' +
      '<div class="zeph-chat-messages" aria-live="polite" aria-relevant="additions"></div>' +
      '<div class="zeph-chat-quick-replies"></div>' +
      '<div class="zeph-chat-input-area">' +
        '<input class="zeph-chat-input" type="text" placeholder="Type a message..." aria-label="Chat message input">' +
        '<button class="zeph-chat-send" aria-label="Send message">' +
          '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>' +
        '</button>' +
      '</div>';

    document.body.appendChild(fab);
    document.body.appendChild(win);

    return {
      fab: fab,
      win: win,
      closeBtn: win.querySelector('.zeph-chat-close'),
      messages: win.querySelector('.zeph-chat-messages'),
      quickReplies: win.querySelector('.zeph-chat-quick-replies'),
      input: win.querySelector('.zeph-chat-input'),
      sendBtn: win.querySelector('.zeph-chat-send')
    };
  }

  // ===== Markdown-lite: bold, links, newlines, lists =====
  function formatMessage(text) {
    // Escape HTML
    var s = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Markdown links [text](url)
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Bold **text**
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // List items (• at start of line)
    s = s.replace(/^• (.+)$/gm, '<span style="display:block;padding-left:12px;text-indent:-12px;">• $1</span>');

    // Numbered list items
    s = s.replace(/^(\d+)\. (.+)$/gm, '<span style="display:block;padding-left:16px;text-indent:-16px;">$1. $2</span>');

    // Line breaks
    s = s.replace(/\n/g, '<br>');

    return s;
  }

  // ===== Keyword Matching =====
  function findBestMatch(input) {
    var normalizedInput = input.toLowerCase().trim();
    var entries = ZephChatbotData.entries;
    var bestScore = 0;
    var bestEntry = null;

    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      var score = 0;

      for (var j = 0; j < entry.keywords.length; j++) {
        var group = entry.keywords[j];
        var words = group.words;

        for (var k = 0; k < words.length; k++) {
          if (normalizedInput.indexOf(words[k].toLowerCase()) !== -1) {
            score += group.weight;
            break; // Only count each keyword group once
          }
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestEntry = entry;
      }
    }

    if (bestScore >= MIN_SCORE_THRESHOLD && bestEntry) {
      return { answer: bestEntry.answer, quickReplies: bestEntry.quickReplies || [] };
    }

    return ZephChatbotData.fallbackResponse;
  }

  // ===== Session Persistence =====
  function saveHistory(messages) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      // Storage full or unavailable — silently ignore
    }
  }

  function loadHistory() {
    try {
      var data = sessionStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  // ===== Main Init =====
  function init() {
    if (typeof ZephChatbotData === 'undefined') return;

    var el = buildDOM();
    var isOpen = false;
    var chatHistory = []; // Array of { role: 'bot'|'user', text: string }

    // --- Toggle ---
    function openChat() {
      isOpen = true;
      el.win.classList.add('zeph-chat-open');
      el.fab.setAttribute('aria-expanded', 'true');
      el.input.focus();
      trapFocus();
    }

    function closeChat() {
      isOpen = false;
      el.win.classList.remove('zeph-chat-open');
      el.fab.setAttribute('aria-expanded', 'false');
      el.fab.focus();
    }

    el.fab.addEventListener('click', function () {
      if (isOpen) {
        closeChat();
      } else {
        openChat();
      }
    });

    el.closeBtn.addEventListener('click', closeChat);

    // --- Render a message bubble ---
    function renderMessage(role, text, skipSave) {
      var msgDiv = document.createElement('div');
      msgDiv.className = 'zeph-chat-msg zeph-chat-msg-' + role;

      if (role === 'bot') {
        msgDiv.innerHTML =
          '<div class="zeph-chat-avatar">Z</div>' +
          '<div class="zeph-chat-bubble">' + formatMessage(text) + '</div>';
      } else {
        msgDiv.innerHTML =
          '<div class="zeph-chat-bubble">' + formatMessage(text) + '</div>';
      }

      el.messages.appendChild(msgDiv);
      el.messages.scrollTop = el.messages.scrollHeight;

      if (!skipSave) {
        chatHistory.push({ role: role, text: text });
        saveHistory(chatHistory);
      }
    }

    // --- Show quick replies ---
    function showQuickReplies(replies) {
      el.quickReplies.innerHTML = '';
      if (!replies || replies.length === 0) return;

      for (var i = 0; i < replies.length; i++) {
        var btn = document.createElement('button');
        btn.className = 'zeph-chat-quick-btn';
        btn.textContent = replies[i];
        btn.addEventListener('click', (function (text) {
          return function () {
            handleUserInput(text);
          };
        })(replies[i]));
        el.quickReplies.appendChild(btn);
      }
    }

    // --- Typing indicator ---
    function showTyping() {
      var typingDiv = document.createElement('div');
      typingDiv.className = 'zeph-chat-typing';
      typingDiv.id = 'zeph-chat-typing';
      typingDiv.innerHTML =
        '<div class="zeph-chat-avatar">Z</div>' +
        '<div class="zeph-chat-typing-dots">' +
          '<div class="zeph-chat-typing-dot"></div>' +
          '<div class="zeph-chat-typing-dot"></div>' +
          '<div class="zeph-chat-typing-dot"></div>' +
        '</div>';
      el.messages.appendChild(typingDiv);
      el.messages.scrollTop = el.messages.scrollHeight;
    }

    function hideTyping() {
      var typing = document.getElementById('zeph-chat-typing');
      if (typing) typing.remove();
    }

    // --- Handle user input ---
    function handleUserInput(text) {
      if (!text.trim()) return;

      // Clear quick replies
      el.quickReplies.innerHTML = '';

      // Render user message
      renderMessage('user', text);

      // Show typing indicator
      showTyping();

      // Find response and render after delay
      var result = findBestMatch(text);

      setTimeout(function () {
        hideTyping();
        renderMessage('bot', result.answer);
        showQuickReplies(result.quickReplies);
      }, TYPING_DELAY);
    }

    // --- Input handling ---
    el.input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var text = el.input.value;
        el.input.value = '';
        handleUserInput(text);
      }
    });

    el.sendBtn.addEventListener('click', function () {
      var text = el.input.value;
      el.input.value = '';
      handleUserInput(text);
    });

    // --- Keyboard: ESC to close ---
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closeChat();
      }
    });

    // --- Focus trapping ---
    function trapFocus() {
      // Get all focusable elements inside chat window
      var focusable = el.win.querySelectorAll(
        'button, input, a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      el.win.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab' || !isOpen) return;

        // Refresh focusable list (quick reply buttons change)
        var currentFocusable = el.win.querySelectorAll(
          'button, input, a[href], [tabindex]:not([tabindex="-1"])'
        );
        if (currentFocusable.length === 0) return;

        var currentFirst = currentFocusable[0];
        var currentLast = currentFocusable[currentFocusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === currentFirst) {
            e.preventDefault();
            currentLast.focus();
          }
        } else {
          if (document.activeElement === currentLast) {
            e.preventDefault();
            currentFirst.focus();
          }
        }
      });
    }

    // --- Restore session history ---
    var saved = loadHistory();
    if (saved && saved.length > 0) {
      chatHistory = saved;
      for (var i = 0; i < saved.length; i++) {
        renderMessage(saved[i].role, saved[i].text, true);
      }
      // Show quick replies from last bot message
      var lastBotText = null;
      for (var j = saved.length - 1; j >= 0; j--) {
        if (saved[j].role === 'bot') {
          lastBotText = saved[j].text;
          break;
        }
      }
      if (lastBotText) {
        var match = findBestMatchByAnswer(lastBotText);
        if (match) showQuickReplies(match);
      }
    } else {
      // Show welcome message
      var welcome = ZephChatbotData.welcomeMessage;
      renderMessage('bot', welcome.answer);
      showQuickReplies(welcome.quickReplies);
    }

    // Find quick replies by matching answer text
    function findBestMatchByAnswer(answerText) {
      var entries = ZephChatbotData.entries;
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].answer === answerText) {
          return entries[i].quickReplies || [];
        }
      }
      if (ZephChatbotData.welcomeMessage.answer === answerText) {
        return ZephChatbotData.welcomeMessage.quickReplies;
      }
      if (ZephChatbotData.fallbackResponse.answer === answerText) {
        return ZephChatbotData.fallbackResponse.quickReplies;
      }
      return null;
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

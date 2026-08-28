/**
 * RAKI AI OS - Universal Embeddable Assistant Widget
 * Compatible with all websites (Internship, Rynaty AI, TSAR IT Services, HMS, Billing)
 * Load via: <script src="/raki-ai/widget.js" defer></script>
 */
(function() {
    if (window.__RAKI_AI_WIDGET_INITIALIZED__) return;
    window.__RAKI_AI_WIDGET_INITIALIZED__ = true;

    // Detect Host API endpoint
    const scriptSrc = document.currentScript ? document.currentScript.src : '';
    let apiBase = '';
    if (scriptSrc && scriptSrc.includes('/raki-ai/')) {
        apiBase = scriptSrc.split('/raki-ai/')[0] + '/raki-ai';
    } else if (window.location.port === '8000') {
        apiBase = window.location.origin;
    } else {
        apiBase = 'https://internship.tsaritservices.com/raki-ai';
    }

    // Determine current site context from hostname
    const host = window.location.hostname.toLowerCase();
    let siteContext = 'internship';
    let brandName = 'RAKI AI';
    let brandSubtitle = 'Autonomous Technical Architect & Mentor';

    if (host.includes('rynaty')) {
        siteContext = 'rynatyai';
        brandName = 'Rynaty AI • Powered by RAKI';
        brandSubtitle = 'Enterprise Autonomous Multi-Agent Swarm';
    } else if (host.includes('billing')) {
        siteContext = 'billing';
        brandName = 'RAKI AI Billing Copilot';
        brandSubtitle = 'Intelligent Invoicing & Financial Auditor';
    } else if (host.includes('hms')) {
        siteContext = 'hms';
        brandName = 'RAKI AI Clinical Copilot';
        brandSubtitle = 'Hospital & Patient Care Assistant';
    } else if (host.includes('tsaritservices')) {
        siteContext = 'tsaritservices';
        brandName = 'RAKI AI Solutions Architect';
        brandSubtitle = 'Enterprise Cloud & Software Advisory';
    }

    // Inject Styles
    const style = document.createElement('style');
    style.textContent = `
        #raki-ai-widget-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        .raki-ai-btn-glow {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%);
            box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.5), 0 0 20px rgba(6, 182, 212, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 2px solid rgba(255, 255, 255, 0.2);
        }
        .raki-ai-btn-glow:hover {
            transform: scale(1.08) rotate(5deg);
            box-shadow: 0 15px 30px -5px rgba(99, 102, 241, 0.7), 0 0 25px rgba(6, 182, 212, 0.6);
        }
        .raki-ai-window {
            position: fixed;
            bottom: 96px;
            right: 24px;
            width: 400px;
            max-width: calc(100vw - 32px);
            height: 580px;
            max-height: calc(100vh - 120px);
            background: #0f172a;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 30px rgba(99, 102, 241, 0.2);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            pointer-events: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(16px);
        }
        .raki-ai-window.open {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: auto;
        }
        .raki-ai-header {
            padding: 16px 20px;
            background: linear-gradient(to right, #1e1b4b, #0f172a);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .raki-ai-msg-area {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .raki-ai-bubble {
            padding: 10px 14px;
            border-radius: 14px;
            font-size: 13.5px;
            line-height: 1.5;
            max-width: 85%;
            word-break: break-word;
        }
        .raki-ai-bubble.user {
            align-self: flex-end;
            background: #4f46e5;
            color: #ffffff;
            border-bottom-right-radius: 2px;
        }
        .raki-ai-bubble.assistant {
            align-self: flex-start;
            background: #1e293b;
            color: #e2e8f0;
            border-bottom-left-radius: 2px;
            border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .raki-ai-bubble pre {
            background: #090d16;
            padding: 10px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 8px 0;
            border: 1px solid rgba(255, 255, 255, 0.1);
            font-family: monospace;
            font-size: 12px;
        }
        .raki-ai-footer {
            padding: 12px 16px;
            background: #090d16;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            gap: 8px;
            align-items: center;
        }
        .raki-ai-input {
            flex: 1;
            background: #1e293b;
            border: 1px solid rgba(255, 255, 255, 0.12);
            color: #f8fafc;
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 13px;
            outline: none;
            transition: border 0.2s;
        }
        .raki-ai-input:focus {
            border-color: #6366f1;
        }
        .raki-ai-send-btn {
            background: #6366f1;
            color: white;
            border: none;
            width: 38px;
            height: 38px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.2s;
        }
        .raki-ai-send-btn:hover {
            background: #4f46e5;
        }
        .raki-chip {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            background: rgba(99, 102, 241, 0.15);
            border: 1px solid rgba(99, 102, 241, 0.3);
            color: #818cf8;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .raki-chip:hover {
            background: rgba(99, 102, 241, 0.3);
            color: #ffffff;
        }
    `;
    document.head.appendChild(style);

    // Build DOM
    const container = document.createElement('div');
    container.id = 'raki-ai-widget-container';
    container.innerHTML = `
        <!-- Floating Trigger Button -->
        <div id="raki-ai-trigger" class="raki-ai-btn-glow" title="Ask RAKI AI">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a8 8 0 0 0-8 8c0 3.36 2.07 6.24 5 7.42V20a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2.58c2.93-1.18 5-4.06 5-7.42a8 8 0 0 0-8-8z"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
                <path d="M9.5 13a3.5 3.5 0 0 0 5 0"></path>
            </svg>
        </div>

        <!-- Chat Window -->
        <div id="raki-ai-window" class="raki-ai-window">
            <div class="raki-ai-header">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981;"></div>
                    <div>
                        <div style="color: #ffffff; font-weight: 700; font-size: 14px;">${brandName}</div>
                        <div style="color: #94a3b8; font-size: 11px;">${brandSubtitle}</div>
                    </div>
                </div>
                <button id="raki-ai-close" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 18px;">✕</button>
            </div>

            <!-- Messages Area -->
            <div id="raki-ai-messages" class="raki-ai-msg-area">
                <div class="raki-ai-bubble assistant">
                    👋 <strong>Hello! I am RAKI AI.</strong><br>
                    How can I assist you with your project, curriculum track, code debugging, or technical inquiry today?
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
                    <span class="raki-chip" data-prompt="Explain TSAR IT Internship Tracks and Certification.">🎓 Internship Tracks</span>
                    <span class="raki-chip" data-prompt="Can you review and optimize my code?">💻 Code Review</span>
                    <span class="raki-chip" data-prompt="Give me a quick mock technical interview question.">⚡ Mock Quiz</span>
                </div>
            </div>

            <!-- Input Area -->
            <div class="raki-ai-footer">
                <input id="raki-ai-input" class="raki-ai-input" placeholder="Type your question or code..." />
                <button id="raki-ai-send" class="raki-ai-send-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(container);

    // Event Listeners
    const trigger = document.getElementById('raki-ai-trigger');
    const win = document.getElementById('raki-ai-window');
    const closeBtn = document.getElementById('raki-ai-close');
    const sendBtn = document.getElementById('raki-ai-send');
    const input = document.getElementById('raki-ai-input');
    const msgArea = document.getElementById('raki-ai-messages');

    trigger.onclick = () => win.classList.toggle('open');
    closeBtn.onclick = () => win.classList.remove('open');

    // Quick chip handlers
    container.querySelectorAll('.raki-chip').forEach(chip => {
        chip.onclick = () => {
            const prompt = chip.getAttribute('data-prompt');
            if (prompt) {
                input.value = prompt;
                sendMessage();
            }
        };
    });

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // Render User Message
        const userDiv = document.createElement('div');
        userDiv.className = 'raki-ai-bubble user';
        userDiv.textContent = text;
        msgArea.appendChild(userDiv);
        input.value = '';
        msgArea.scrollTop = msgArea.scrollHeight;

        // Render Assistant Typing placeholder
        const assistantDiv = document.createElement('div');
        assistantDiv.className = 'raki-ai-bubble assistant';
        assistantDiv.innerHTML = '<em>Synthesizing response with RAKI AI...</em>';
        msgArea.appendChild(assistantDiv);
        msgArea.scrollTop = msgArea.scrollHeight;

        try {
            const response = await fetch(`${apiBase}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: text }],
                    site_context: siteContext,
                    temperature: 0.7
                })
            });

            if (!response.ok) throw new Error('API status ' + response.status);
            const data = await response.json();
            
            // Format response (basic markdown linebreaks & pre tags)
            let formatted = data.response
                .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
                .replace(/\n/g, '<br>');

            assistantDiv.innerHTML = formatted;
        } catch (err) {
            assistantDiv.innerHTML = '<span style="color: #ef4444;">⚠️ Unable to reach RAKI AI OS. Please ensure backend is active.</span>';
        }
        msgArea.scrollTop = msgArea.scrollHeight;
    }

    sendBtn.onclick = sendMessage;
    input.onkeydown = (e) => {
        if (e.key === 'Enter') sendMessage();
    };
})();

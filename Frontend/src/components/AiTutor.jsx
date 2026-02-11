import React, { useState, useRef, useEffect } from 'react';
import './AiTutor.css';

const AiTutor = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your AI Tutor. Ask me anything about your courses!", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage.text }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();
            const aiMessage = { text: data.response, sender: 'ai' };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error asking AI:", error);
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now.", sender: 'ai' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="ai-tutor-container">
            {!isOpen && (
                <button className="ai-tutor-button" onClick={toggleChat}>
                    🤖 AI Tutor
                </button>
            )}

            {isOpen && (
                <div className="ai-tutor-window">
                    <div className="ai-tutor-header">
                        <h3>AI Tutor</h3>
                        <button className="close-button" onClick={toggleChat}>×</button>
                    </div>

                    <div className="ai-tutor-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                <div className="message-content">
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && <div className="message ai"><div className="message-content">Thinking...</div></div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="ai-tutor-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask a question..."
                            disabled={loading}
                        />
                        <button onClick={handleSendMessage} disabled={loading || !input.trim()}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AiTutor;

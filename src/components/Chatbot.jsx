import React, { useState, useRef, useEffect } from 'react';

// --- (All your Icon components are still here) ---
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);
// --- (End of Icons) ---

// Get the API Key from the .env file
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Check if the API key is missing and log a helpful error
if (!GEMINI_API_KEY) {
    console.error("FATAL: VITE_GEMINI_API_KEY is not defined.");
    console.error("This can happen if your build target is too old (e.g., 'es2015') or the .env file is missing.");
    console.error("Please ensure you have a .env file in the root of your project with VITE_GEMINI_API_KEY=... and restart your dev server.");
}

// This is the component that will be placed inside the Dashboard
const Chatbot = () => {
    // Updated initial message to reflect configuration status
    const initialMessage = GEMINI_API_KEY
        ? { id: 1, text: "Hi! I'm your Oasis assistant. How can I help you?", isBot: true }
        : { id: 1, text: "Hi! The Oasis Assistant is not configured. Please add your VITE_GEMINI_API_KEY to the .env file and restart the server.", isBot: true };

    const [messages, setMessages] = useState([initialMessage]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const callGeminiAPI = async (text) => {
        if (!GEMINI_API_KEY) {
            return "I'm sorry, I am not connected right now. (Missing API Key)";
        }
        
        setIsLoading(true);
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;

        const payload = {
            contents: [{
                parts: [{
                    text: "You are 'Oasis Assistant', a kind and supportive chatbot for a digital wellness app. Your goal is to help users manage screen time, stress, and stay mindful. Keep your answers concise, positive, and related to digital wellness." 
                }, {
                    text: text 
                }]
            }]
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            const result = await response.json();
            const botResponseText = result.candidates[0]?.content?.parts[0]?.text;
            return botResponseText || "I'm not sure how to respond to that.";
        } catch (error) {
            console.error("Gemini API call failed:", error);
            return "I'm having a little trouble connecting right now.";
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || isLoading || !GEMINI_API_KEY) return;
        const userMessage = { id: Date.now(), text: inputText, isBot: false };
        setMessages(prev => [...prev, userMessage]);
        setInputText("");
        const botResponseText = await callGeminiAPI(inputText);
        const botMessage = { id: Date.now() + 1, text: botResponseText, isBot: true };
        setMessages(prev => [...prev, botMessage]);
    };

    // This component is designed to be flexible and fill its container
    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="bg-brand-primary p-4 text-white flex justify-between items-center border-b border-brand-dark">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 ${!GEMINI_API_KEY ? 'bg-red-500' : (isLoading ? 'bg-yellow-300' : 'bg-green-300')} rounded-full animate-pulse`}></div>
                    <span className="font-semibold text-sm">{!GEMINI_API_KEY ? 'Not Configured' : (isLoading ? 'Assistant is typing...' : 'Oasis Assistant')}</span>
                </div>
                {/* You could add a minimize button here if needed */}
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[85%] p-3 rounded-2xl ${msg.isBot ? 'bg-white text-gray-800 border border-gray-200 rounded-tl-none' : 'bg-brand-primary text-white rounded-tr-none'}`}>
                                {msg.text.split('\n').map((line, i) => (
                                    <p key={i} className="text-sm">{line}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                    {isLoading && GEMINI_API_KEY && (
                        <div className="flex justify-start">
                            <div className="p-3 rounded-2xl bg-white text-gray-800 border border-gray-200 rounded-tl-none">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            
            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={!GEMINI_API_KEY ? 'Chatbot is not configured' : 'Type a message...'}
                    disabled={!GEMINI_API_KEY}
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 disabled:bg-gray-200"
                />
                <button 
                    type="submit"
                    disabled={!inputText.trim() || isLoading || !GEMINI_API_KEY}
                    className="bg-brand-primary text-white p-2 rounded-full hover:bg-brand-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <SendIcon />
                </button>
            </form>
        </div>
    );
};

export default Chatbot;   
import React, { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getApiUrl, API_ENDPOINTS } from "../../config/api";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  source?: "local" | "ai" | "fallback";
}

interface HistoryItem {
  role: "user" | "assistant";
  content: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Halo! Selamat datang di PT Surya Inti Gas. Ada yang bisa saya bantu?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const messageToSend = inputValue;

    setInputValue("");
    setIsLoading(true);

    try {
      // Build history
      const history: HistoryItem[] = messages
        .filter(
          (msg) => msg.sender !== "bot" || msg.source !== "local"
        )
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        }));

      // Create empty bot message
      const botMessageId = crypto.randomUUID();

      const botMessage: Message = {
        id: botMessageId,
        text: "",
        sender: "bot",
        timestamp: new Date(),
        source: "ai",
      };

      setMessages((prev) => [...prev, botMessage]);

      // Fetch SSE stream
      const response = await fetch(
        `${getApiUrl(API_ENDPOINTS.CHAT)}?stream=true`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({
            message: messageToSend,
            history,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to connect to server");
      }

      // Check if response is JSON (fallback mode) or stream
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        // Fallback to non-streaming response
        const data = await response.json();
        
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? {
                  ...msg,
                  text: data.data?.message || "Maaf, terjadi kesalahan.",
                  source: data.data?.source || "fallback",
                }
              : msg
          )
        );
        
        setIsLoading(false);
        return;
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();

      const decoder = new TextDecoder();

      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, {
          stream: true,
        });

        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          const jsonString = line
            .replace("data: ", "")
            .trim();

          if (!jsonString) continue;

          try {
            const data = JSON.parse(jsonString);

            // Append streamed text
            if (data.chunk) {
              fullText += data.chunk;

              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMessageId
                    ? {
                        ...msg,
                        text: fullText,
                      }
                    : msg
                )
              );
            }

            // Done streaming
            if (data.done) {
              setIsLoading(false);
            }

            // Handle server error
            if (data.error) {
              throw new Error(data.error);
            }
          } catch (err) {
            console.error("Stream parse error:", err);
          }
        }
      }
    } catch (error) {
      console.error(error);

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: "Maaf, terjadi kesalahan. Silakan coba lagi nanti.",
        sender: "bot",
        timestamp: new Date(),
        source: "fallback",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-7 left-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <MessageCircle size={24} />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: 20,
            }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-[7rem] left-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Bot size={24} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Asisten Virtual
                  </h3>

                  <p className="text-xs text-blue-100">
                    PT Surya Inti Gas
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    message.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                      <Bot
                        size={16}
                        className="text-blue-600"
                      />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-white text-gray-800 rounded-bl-md shadow-sm"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.text}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <p
                        className={`text-xs ${
                          message.sender === "user"
                            ? "text-blue-100"
                            : "text-gray-400"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>

                      {message.sender === "bot" &&
                        message.source && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              message.source === "local"
                                ? "bg-green-100 text-green-700"
                                : message.source === "ai"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {message.source === "local"
                              ? "FAQ"
                              : message.source === "ai"
                              ? "AI"
                              : "Default"}
                          </span>
                        )}
                    </div>
                  </div>

                  {message.sender === "user" && (
                    <div className="bg-gray-200 p-2 rounded-full flex-shrink-0">
                      <User
                        size={16}
                        className="text-gray-600"
                      />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Loading */}
              {isLoading &&
                messages[messages.length - 1]?.sender !==
                  "bot" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                      <Bot
                        size={16}
                        className="text-blue-600"
                      />
                    </div>

                    <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />

                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{
                            animationDelay: "0.1s",
                          }}
                        />

                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{
                            animationDelay: "0.2s",
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) =>
                    setInputValue(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Ketik pesan Anda..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />

                <button
                
                  onClick={handleSendMessage}
                  disabled={
                    isLoading || !inputValue.trim()
                  }
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-2 text-center">
                Tekan Enter untuk mengirim
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
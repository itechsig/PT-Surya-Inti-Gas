# Chatbot Streaming Implementation

## Backend sudah diupdate dengan streaming support!

### Endpoint Streaming
**POST** `/api/chat/stream`

### Frontend Implementation Examples

## Example 1: Vanilla JavaScript (Server-Sent Events)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Chatbot Streaming</title>
    <style>
        .chat-container {
            max-width: 600px;
            margin: 50px auto;
            font-family: Arial, sans-serif;
        }
        .message {
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
        }
        .user-message {
            background-color: #e3f2fd;
            margin-left: 20px;
        }
        .bot-message {
            background-color: #f5f5f5;
            margin-right: 20px;
        }
        .input-area {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        #userInput {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        #sendBtn {
            padding: 10px 20px;
            background-color: #1976d2;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .typing-cursor {
            display: inline-block;
            width: 2px;
            height: 1em;
            background-color: #333;
            animation: blink 1s infinite;
        }
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <h2>Chatbot Streaming</h2>
        <div id="chatMessages"></div>
        <div class="input-area">
            <input type="text" id="userInput" placeholder="Ketik pesan Anda...">
            <button id="sendBtn">Kirim</button>
        </div>
    </div>

    <script>
        const chatMessages = document.getElementById('chatMessages');
        const userInput = document.getElementById('userInput');
        const sendBtn = document.getElementById('sendBtn');

        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        async function sendMessage() {
            const message = userInput.value.trim();
            if (!message) return;

            // Add user message
            addMessage(message, 'user');
            userInput.value = '';

            // Create bot message container
            const botMessageDiv = addMessage('', 'bot');
            const messageText = document.createElement('span');
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            botMessageDiv.appendChild(messageText);
            botMessageDiv.appendChild(cursor);

            try {
                const response = await fetch('/api/chat/stream', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'text/event-stream',
                    },
                    body: JSON.stringify({
                        message: message,
                        history: []
                    })
                });

                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = JSON.parse(line.slice(6));

                            if (data.done) {
                                cursor.remove();
                                break;
                            }

                            if (data.char) {
                                messageText.textContent += data.char;
                                // Scroll to bottom
                                chatMessages.scrollTop = chatMessages.scrollHeight;
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                messageText.textContent = 'Error: ' + error.message;
                cursor.remove();
            }
        }

        function addMessage(text, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}-message`;
            messageDiv.textContent = text;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return messageDiv;
        }
    </script>
</body>
</html>
```

## Example 2: React Implementation

```jsx
import React, { useState, useRef, useEffect } from 'react';

const ChatbotStreaming = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isStreaming) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

        // Add empty bot message for streaming
        const botMessageIndex = messages.length + 1;
        setMessages(prev => [...prev, { role: 'bot', content: '' }]);
        setIsStreaming(true);

        try {
            const response = await fetch('/api/chat/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream',
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages.slice(-10) // Send last 10 messages
                })
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let streamedText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = JSON.parse(line.slice(6));

                        if (data.done) {
                            setIsStreaming(false);
                            break;
                        }

                        if (data.char) {
                            streamedText += data.char;
                            setMessages(prev => {
                                const newMessages = [...prev];
                                newMessages[botMessageIndex] = {
                                    role: 'bot',
                                    content: streamedText
                                };
                                return newMessages;
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[botMessageIndex] = {
                    role: 'bot',
                    content: 'Error: ' + error.message
                };
                return newMessages;
            });
            setIsStreaming(false);
        }
    };

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.role}-message`}
                    >
                        {msg.role === 'bot' && isStreaming && index === messages.length - 1 ? (
                            <span>
                                {msg.content}
                                <span className="typing-cursor">|</span>
                            </span>
                        ) : (
                            msg.content
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ketik pesan Anda..."
                    disabled={isStreaming}
                />
                <button onClick={sendMessage} disabled={isStreaming}>
                    {isStreaming ? '...' : 'Kirim'}
                </button>
            </div>

            <style jsx>{`
                .chat-container {
                    max-width: 600px;
                    margin: 50px auto;
                    font-family: Arial, sans-serif;
                }
                .messages {
                    min-height: 400px;
                    max-height: 600px;
                    overflow-y: auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
                .message {
                    padding: 10px;
                    margin: 10px 0;
                    border-radius: 5px;
                }
                .user-message {
                    background-color: #e3f2fd;
                    margin-left: 20px;
                }
                .bot-message {
                    background-color: #f5f5f5;
                    margin-right: 20px;
                }
                .input-area {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }
                input {
                    flex: 1;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
                button {
                    padding: 10px 20px;
                    background-color: #1976d2;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
                button:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }
                .typing-cursor {
                    animation: blink 1s infinite;
                }
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default ChatbotStreaming;
```

## Example 3: Vue.js Implementation

```vue
<template>
  <div class="chat-container">
    <div class="messages">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['message', `${msg.role}-message`]"
      >
        <span v-if="msg.role === 'bot' && isStreaming && index === messages.length - 1">
          {{ msg.content }}<span class="typing-cursor">|</span>
        </span>
        <span v-else>{{ msg.content }}</span>
      </div>
    </div>

    <div class="input-area">
      <input
        v-model="input"
        @keypress.enter="sendMessage"
        placeholder="Ketik pesan Anda..."
        :disabled="isStreaming"
      />
      <button @click="sendMessage" :disabled="isStreaming">
        {{ isStreaming ? '...' : 'Kirim' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [],
      input: '',
      isStreaming: false
    }
  },
  methods: {
    async sendMessage() {
      if (!this.input.trim() || this.isStreaming) return;

      const userMessage = this.input.trim();
      this.input = '';
      this.messages.push({ role: 'user', content: userMessage });

      // Add empty bot message for streaming
      const botMessageIndex = this.messages.length;
      this.messages.push({ role: 'bot', content: '' });
      this.isStreaming = true;

      try {
        const response = await fetch('/api/chat/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
          },
          body: JSON.stringify({
            message: userMessage,
            history: this.messages.slice(-10)
          })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let streamedText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6));

              if (data.done) {
                this.isStreaming = false;
                break;
              }

              if (data.char) {
                streamedText += data.char;
                this.messages[botMessageIndex].content = streamedText;
              }
            }
          }
        }
      } catch (error) {
        console.error('Error:', error);
        this.messages[botMessageIndex].content = 'Error: ' + error.message;
        this.isStreaming = false;
      }
    }
  }
}
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 50px auto;
  font-family: Arial, sans-serif;
}
.messages {
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.message {
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
}
.user-message {
  background-color: #e3f2fd;
  margin-left: 20px;
}
.bot-message {
  background-color: #f5f5f5;
  margin-right: 20px;
}
.input-area {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
button {
  padding: 10px 20px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.typing-cursor {
  animation: blink 1s infinite;
}
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>
```

## Configuration

### Adjust Typing Speed
Untuk mengubah kecepatan mengetik, ubah nilai `usleep(30000)` di `ChatbotController.php`:

```php
usleep(30000); // 30ms per karakter (default)
usleep(15000); // 15ms per karakter (lebih cepat)
usleep(50000); // 50ms per karakter (lebih lambat)
```

## Testing

Untuk testing streaming endpoint, kamu bisa menggunakan:

```bash
curl -X POST http://localhost:8000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message":"Halo","history":[]}'
```

## Notes

- Streaming menggunakan Server-Sent Events (SSE)
- Setiap karakter dikirim dengan delay 30ms
- Cursor blinking effect ditambahkan untuk UX yang lebih baik
- Auto-scroll ke bawah saat karakter baru muncul
- Frontend harus handle SSE response dengan benar

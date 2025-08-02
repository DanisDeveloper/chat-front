<template>
  <div class="chat-wrapper">
    <h1>WebSocket Chat</h1>
    <div class="chat-block">
      <chat-list class="chat-list"/>
      <div class="chat">
        <div class="chat-messages">
          <message
              v-for="(message, index) in messages"
              :key="index"
              :message="message"
              :is-author="message.author_id === this.$store.state.author_id"
          />
        </div>
        <form @submit.prevent="sendMessage" class="chat-form">
          <textarea
              class="chat-form-input"
              v-model="messageText"
              autocomplete="off"
              @keydown.enter.exact.prevent="sendMessage"
              @keydown.shift.enter="insertNewline"
              placeholder="Write a message..."
          ></textarea>
          <button class="chat-form-button" type="submit">Send</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import ChatList from "@/components/ChatList.vue";
import Message from "@/components/Message.vue";

export default {
  components: {Message, ChatList},
  data() {
    return {
      messages: [],
      messageText: "",
      ws: null,
      wsReady: false,
      messageQueue: [],
      API_URL: import.meta.env.VITE_API_URL,
      WEBSOCKET_API_URL: import.meta.env.VITE_WEBSOCKET_API_URL,
    };
  },
  methods: {
    sendMessage() {
      if (this.messageText.trim() === "") return;

      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(this.messageText);

      } else if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
        console.log("WebSocket ещё подключается, добавим в очередь");
        this.messageQueue.push(this.messageText);

      } else {
        console.warn("WebSocket закрыт или не инициализирован");
      }

      this.messageText = '';
    },
    insertNewline(event) {
      const textarea = event.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      textarea.value = value.substring(0, start) + '\n' + value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 1;
      event.preventDefault();
    }
  },
  mounted() {
    this.ws = new WebSocket(`${this.WEBSOCKET_API_URL}/ws`);

    this.ws.onopen = () => {
      console.log("WebSocket открыт");
      this.wsReady = true;

      // Отправим сообщения из очереди
      this.messageQueue.forEach(msg => this.ws.send(msg));
      this.messageQueue = [];
    };

    this.ws.onmessage = (event) => {
      console.log("Получено:", event.data);
      const data = JSON.parse(event.data);
      if (data.type === "init") {
        this.$store.commit('setAuthorId', data.author_id);
      } else {
        this.messages.push(data);
      }
    };

    this.ws.onclose = () => {
      console.warn("WebSocket закрыт");
      this.wsReady = false;
    };

    this.ws.onerror = (e) => {
      console.error("WebSocket ошибка:", e);
    };
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.chat-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.chat-block {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.chat-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.chat {
  display: flex;
  flex-direction: column;
  flex: 2;
  overflow-y: hidden;
  background-color: #072b3d;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.chat-form {
  margin-top: auto;
  background-color: #0a415c;
  border: none;
  display: flex;
  align-items: center;
}

.chat-form-input {
  width: 100%;
  border: none;
  padding: 0.5rem;
  background: none;
  color: #f0f9fd;
  outline: none;
  resize: none;
  border-radius: 5px;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.chat-form-button {
  padding: 0 10px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  background-color: #4a84cf;
  color: #f0f9fd;
  cursor: pointer;
}
</style>

<template>
  <h1>WebSocket Chat</h1>
  <form @submit.prevent="sendMessage">
    <input type="text" v-model="messageText" autocomplete="off"/>
    <button type="submit">Send</button>
  </form>
  <ul>
    <li v-for="(message, index) in messages" :key="index">{{ message }}</li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      messages: [],
      messageText: "",
      ws: null,
      wsReady: false,
      messageQueue: []
    };
  },
  methods: {
    sendMessage() {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(this.messageText);
      } else if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
        console.log("WebSocket ещё подключается, добавим в очередь");
        this.messageQueue.push(this.messageText);
      } else {
        console.warn("WebSocket закрыт или не инициализирован");
      }
      this.messageText = '';
    }
  },
  mounted() {
    this.ws = new WebSocket("ws://192.168.204.87:8000/ws");

    this.ws.onopen = () => {
      console.log("WebSocket открыт");
      this.wsReady = true;

      // Отправим сообщения из очереди
      this.messageQueue.forEach(msg => this.ws.send(msg));
      this.messageQueue = [];
    };

    this.ws.onmessage = (event) => {
      console.log("Получено:", event.data);
      this.messages.push(event.data);
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

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>

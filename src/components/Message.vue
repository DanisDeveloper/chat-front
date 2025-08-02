<template>
  <div class="message" :class="{'isAuthor': isAuthor}">
    {{ message.author_id }}: {{ message.text }}
  </div>
</template>


<script>
export default {
  name: "Message",
  props: {
    message: {
      type: Object,
      required: true
    },
    isAuthor: {
      type: Boolean,
      default: false
    }
  }
}
</script>


<style scoped>
.message {
  max-width: 70%;
  word-wrap: break-word;
  width: auto;
  padding: 10px;
  border-radius: 10px;
  margin: 5px;
  background-color: #0a415c;
  align-self: start;
  color: #f0f9fd;
}

.message.isAuthor {
  background-color: #1481b8;
}
</style>
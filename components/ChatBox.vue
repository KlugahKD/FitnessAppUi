<template>
  <Card
    class="max-w-2xl w-full mx-auto mt-10 flex flex-col h-[80vh] bg-muted/50"
  >
    <CardContent class="flex-1 overflow-y-auto p-4 space-y-4" ref="scrollRef">
      <!-- Centered start message -->
      <div
        v-if="messages.length === 0 && !loading"
        class="flex flex-col items-center justify-center h-full text-center text-muted-foreground space-y-4"
      >
        <Avatar class="w-16 h-16">
          <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=bot" />
          <AvatarFallback>🤖</AvatarFallback>
        </Avatar>
        <div class="text-lg font-medium">Start a conversation</div>
        <p class="text-sm text-muted-foreground max-w-xs">
          Ask me anything or just say hi!
        </p>
      </div>

      <div
        v-for="msg in messages"
        :key="msg.id"
        class="flex items-start"
        :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'"
      >
        <!-- Left avatar for bot -->
        <div v-if="msg.sender === 'bot'" class="mr-2">
          <Avatar>
            <AvatarImage
              src="https://api.dicebear.com/7.x/bottts/svg?seed=bot"
            />
            <AvatarFallback>🤖</AvatarFallback>
          </Avatar>
        </div>

        <!-- Message bubble -->
        <div
          :class="[
            'rounded-xl px-4 py-2 max-w-[75%] whitespace-pre-wrap break-words',
            msg.sender === 'user'
              ? 'bg-primary text-white'
              : 'bg-muted text-muted-foreground',
          ]"
        >
          {{ msg.text }}
          <div class="text-xs text-muted-foreground mt-1 text-right">
            {{ msg.timestamp }}
          </div>
        </div>

        <!-- Right avatar for user -->
        <div v-if="msg.sender === 'user'" class="ml-2">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <!-- Bot is typing -->
      <div class="flex items-start justify-start" v-if="loading">
        <div class="mr-2">
          <Avatar>
            <AvatarImage
              src="https://api.dicebear.com/7.x/bottts/svg?seed=bot"
            />
            <AvatarFallback>🤖</AvatarFallback>
          </Avatar>
        </div>
        <div
          class="bg-muted text-muted-foreground rounded-xl px-4 py-2 max-w-[75%] animate-pulse"
        >
          Typing...
        </div>
      </div>
    </CardContent>

    <form @submit.prevent="handleSend" class="p-4 border-t flex gap-2">
      <Input v-model="input" placeholder="Type a message..." class="flex-1" />
      <Button type="submit">Send</Button>
    </form>
  </Card>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { useChatBot } from "@/composables/useChatBot";
import { getData } from "nuxt-storage/local-storage";

// Replace with dynamic user ID if needed
const userId = ref("");
const userData = getData("user");
if (userData) {
  userId.value = userData.data.userId;
}
const input = ref("");
const scrollRef = ref<HTMLElement | null>(null);
const { messages, loading, sendMessage } = useChatBot(userId.value);
const scrollToBottom = () => {
  nextTick(() => {
    if (scrollRef.value) {
      scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
    }
  });
};

const handleSend = async () => {
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  await sendMessage(text);
  scrollToBottom();
};
</script>

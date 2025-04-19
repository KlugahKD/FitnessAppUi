// composables/useChatBot.ts
import { ref } from "vue";
import { useFetch } from "#app";

interface ChatMessage {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export const useChatBot = (userId: string) => {
  const messages = ref<ChatMessage[]>([]);
  const loading = ref(false);
  let id = 0;

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const timestamp = new Date().toLocaleTimeString();
    messages.value.push({ id: ++id, sender: "user", text, timestamp });

    loading.value = true;

    try {
      const { data, error } = await Fetch("/Avatar/response", {
        method: "POST",
        query: { userId },
        body: JSON.stringify(text),
      });

      const botReply = error.value
        ? "Oops! Something went wrong."
        : (data.value.data as string);

      messages.value.push({
        id: ++id,
        sender: "bot",
        text: botReply,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (e) {
      messages.value.push({
        id: ++id,
        sender: "bot",
        text: "Network error. Try again later.",
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      loading.value = false;
    }
  };

  return {
    messages,
    loading,
    sendMessage,
  };
};

import { FormEvent, useEffect, useRef, useState } from "react";
import OpenAI from "openai";
type messageType = {
  isUser: boolean;
  text: string;
};
export const useAISubmit = () => {
  const scrollToBottom = () => {
    if (messagesEndRef.current && chatContainer.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      messagesEndRef.current.scroll(0, messagesEndRef.current.scrollHeight);
    }
  };
  const isBrowser = () => typeof window !== "undefined";
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const chatContainer = useRef<null | HTMLDivElement>(null);
  const [messages, setMessages] = useState<messageType[]>([]);
  const [input, setInput] = useState("");
  const [isDone, setIsDone] = useState<boolean>(true);
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_NEXTAPI_KEY as string,
    dangerouslyAllowBrowser: true,
    organization: process.env.NEXT_PUBLIC_NEXTORG_KEY as string,
  });
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (input.trim() === "") {
      return;
    }
    setMessages([...messages, { isUser: true, text: input.trim() }]);
    setInput("");
    setIsDone(false);
    // setMessages((prev) => [
    //   ...prev,
    //   {
    //     isUser: false,
    //     text: "......",
    //   },
    // ]);
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a highly trained AI-powered chatbot named Moe who is to answer only web3 and crypto related questions. Any question asked that isn't web3 related reply that you are only trained to answer web3 related questions. ${input}`,
          },
        ],
        model: "gpt-3.5-turbo",
      });
      const aiMessage =
        completion.choices[0].message.content ||
        "Sorry, I couldn't understand your message";
      setMessages((prev) => {
        return [
          ...prev,
          {
            isUser: false,
            text: aiMessage,
          },
        ];
      });
      setIsDone(true);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          isUser: false,
          text: "Error loading AI response. \t\n\n" + error,
        },
      ]);
    }
    setIsDone(true);
    if (!isBrowser()) return;
    scrollToBottom();
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return {
    handleSubmit,
    isDone,
    input,
    chatContainer,
    messagesEndRef,
    messages,
    setInput,
  };
};

export const useHandleKeyUp = () => {
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (formRef.current) {
      if (e.key === "Enter" && !e.shiftKey) {
        formRef.current.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
      }
    }
  };
  return { formRef, handleKeyUp };
};

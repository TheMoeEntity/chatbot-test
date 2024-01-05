"use client";
import "./chat.css";
import Script from "next/script";
import { useState, useRef, FormEvent, useEffect } from "react";
import { useSnackbar } from "notistack";
import OpenAI from "openai";
import Loader from "../Loader/Loader";
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_NEXTAPI_KEY as string,
  dangerouslyAllowBrowser: true,
  organization: process.env.NEXT_PUBLIC_NEXTORG_KEY as string,
});
type messageType = {
  isUser: boolean;
  text: string;
};
const Chatscreen = ({ show, close }: any) => {
  const isBrowser = () => typeof window !== "undefined";
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [messages, setMessages] = useState<messageType[]>([]);
  const [input, setInput] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isDone, setIsDone] = useState<boolean>(true);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (!isBrowser()) return;
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (formRef.current) {
      if (e.key === "Enter" && !e.shiftKey) {
        formRef.current.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (input.trim() === "") {
      return;
    }
    setMessages([...messages, { isUser: true, text: input.trim() }]);
    setInput("");
    setIsDone(false);
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a highly trained AI chatbot who is to answer only web3 and crypto related questions. Any question asked that isn't web3 related reply that you are only trained to answer web3 related questions. ${input}`,
          },
        ],
        model: "gpt-3.5-turbo",
      });
      const aiMessage =
        completion.choices[0].message.content ||
        "Sorry, I couldn't understand your message";
      setMessages((prev) => [
        ...prev,
        {
          isUser: false,
          text: aiMessage,
        },
      ]);
      setIsDone(true);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          isUser: false,
          text: "Error loading AI response. \n\n" + error,
        },
      ]);
      setIsDone(true);
      scrollToBottom();
      if (!isBrowser()) return;
      window.scrollTo({ top: 200, behavior: "smooth" });
    }
  };

  return (
    <div
      // style={{ bottom: show ? "0" : "-150%" }}
      className="chat-container open"
    >
      <Loader done={isDone} />
      <div className="close">&times;</div>
      <div className="chat-header">
        <div>AI ChatBot</div>
      </div>
      <div ref={messagesEndRef} className="chat-body">
        {messages.map((x, i) => (
          <div
            key={i}
            className={`chat-message ${
              x.isUser ? "user-message" : "ai-message"
            }`}
          >
            <div className="messsage-user-identification">
              <p>
                {x.isUser ? (
                  <span style={{ marginRight: "10px" }}>&#x1F7E2;</span>
                ) : (
                  <span style={{ marginRight: "10px" }}>&#x1F534;</span>
                )}
                {x.isUser ? "Moe Man" : "AI Chat"}
              </p>
            </div>
            <p className="chatBox" style={{ paddingTop: "10px" }}>
              {x.text}
            </p>
          </div>
        ))}
      </div>
      <form className="chat-input" ref={formRef} onSubmit={handleSubmit}>
        <textarea
          name=""
          id=""
          // cols={30}
          rows={0}
          placeholder="Type message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => handleKeyUp(e)}
        />
        <button className="send-button" type="submit">
          <i className="fa fa-paper-plane" aria-hidden="true"></i>
        </button>
      </form>
      <Script
        src="https://kit.fontawesome.com/4ef8c63dd7.js"
        crossOrigin="anonymous"
      />
    </div>
  );
};

export default Chatscreen;

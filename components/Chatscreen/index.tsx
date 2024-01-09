"use client";
import "./chat.css";
import Script from "next/script";
import Loader from "../Loader/Loader";
import aiImg from "../../public/images/gpt.png";
import Image from "next/image";
import { useAISubmit, useHandleKeyUp } from "@/Helpers/hooks";

const Chatscreen = ({ show, close }: any) => {
  const { formRef, handleKeyUp } = useHandleKeyUp();
  const {
    handleSubmit,
    isDone,
    input,
    chatContainer,
    messagesEndRef,
    messages,
    setInput,
  } = useAISubmit();

  return (
    <div
      // style={{ bottom: show ? "0" : "-150%" }}
      ref={chatContainer}
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
                {x.isUser ? "Moe" : "OpenAI Chatbot"}
              </p>
            </div>
            <p className="chatBox" style={{ paddingTop: "10px" }}>
              {x.text}
            </p>

            {!x.isUser && (
              <div className="chatImage">
                <Image
                  src={aiImg}
                  alt="logo"
                  fill={true}
                  quality={100}
                  priority={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}

            <div className={`chatBubble ${x.isUser ? "user-flip" : "ai-flip"}`}>
              <i className="fa-solid fa-comment"></i>
            </div>
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

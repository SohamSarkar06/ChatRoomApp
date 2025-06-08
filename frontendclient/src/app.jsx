import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;  // Prevent sending empty messages
    socket.emit("send_message", { message });
    setChat([...chat, { message, type: "sent" }]);
    setMessage("");
  };

  useEffect(() => {
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("receive_message", (data) => {
    console.log("Message received:", data);
    setChat((prev) => [...prev, { ...data, type: "received" }]);
  });

  return () => socket.off("receive_message");
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>💬SAGA Chatroom</h2>
      <div
        style={{
          border: "1px solid gray",
          height: "300px",
          overflowY: "scroll",
          marginBottom: 10,
          maxWidth: "600px",
          margin: "0 auto",
          fontFamily: "Arial, sans-serif",
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
          backgroundColor: "#f9f9f9",
          marginBottom: "15px",

        }}
      >
        {chat.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: msg.type === "sent" ? "flex-end" : "flex-start",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                backgroundColor: msg.type === "sent" ? "#dcf8c6" : "#e6e6e6",
                color: "#000",
                padding: "10px 15px",
                borderRadius: "20px",
                maxWidth: "70%",
                wordWrap: "break-word",
              }}
            >
              {msg.message}
            </div>
          </div>

        ))}
      </div>
      <form
        onSubmit={sendMessage}
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          id="chatMessage"
          name="chatMessage"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#4CAF50",
            color: "white",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </form>

    </div>
  );
}

export default App;

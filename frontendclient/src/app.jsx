import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, { ...data, type: "received" }]);
    });

    return () => socket.off("receive_message");
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoggedIn(true);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    const data = { message, sender: username };
    socket.emit("send_message", data);
    setChat([...chat, { ...data, type: "sent" }]);
    setMessage("");
  };

  if (!isLoggedIn) {
    return (
      <div style={{ padding: 20, maxWidth: 400, margin: "auto" }}>
        <h2>Login to Chatroom</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <button type="submit" style={{ padding: "10px", width: "100%" }}>
            Join Chat
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>💬 SAGA Chatroom</h2>
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
              textAlign: msg.type === "sent" ? "right" : "left",
              marginBottom: "8px",
            }}
          >
            <p
              style={{
                background: msg.type === "sent" ? "#dcf8c6" : "#e6e6e6",
                color: msg.type === "sent" ?   "#333333": "#808080" ,
                display: "inline-block",
                padding: "10px",
                borderRadius: "15px",
                maxWidth: "80%",
              }}
            >
              <strong>{msg.sender}:</strong> {msg.message}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ display: "flex", gap: "10px" }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "20px",
            border: "1px solid #ccc",
          }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Send
        </button>
      </form>
    </div>
  );
}


export default App;

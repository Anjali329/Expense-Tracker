import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:5000/ping")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => {
        console.error(err);
        setMessage("Backend not connected");
      });
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>AI Expense Tracker</h1>
      <h2>Backend Status</h2>
      <p>{message}</p>
    </div>
  );
}

export default App;
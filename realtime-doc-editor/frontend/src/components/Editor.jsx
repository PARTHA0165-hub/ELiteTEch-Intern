import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Editor() {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/docs/${id}`)
      .then(res => {
        setContent(res.data.content || "");
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading document:", err);
        setLoading(false);
      });
  }, [id]);

  const handleSave = () => {
    axios.put(`/api/docs/${id}`, { content })
      .then(() => alert("✅ Document saved successfully!"))
      .catch(err => {
        console.error("Error saving document:", err);
        alert("❌ Failed to save document");
      });
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <p>Loading document...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Editing Document: {id}</h2>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows="15"
        cols="70"
        style={{
          padding: "10px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          width: "100%",
        }}
      />

      <div style={{ marginTop: "15px" }}>
        <button
          onClick={handleSave}
          style={{
            padding: "8px 16px",
            marginRight: "10px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Save
        </button>

        <button
          onClick={handleDownload}
          style={{
            padding: "8px 16px",
            background: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Download
        </button>
      </div>
    </div>
  );
}

export default Editor;

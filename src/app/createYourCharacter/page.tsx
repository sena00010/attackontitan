"use client";

import { useState } from "react";

export default function CreateYourCharacter() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setImage(null);

    try {
      const res = await fetch("/api/create_your_character", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Görsel oluşturulurken bir hata oluştu");
      } else {
        // Base64 formatındaki görseli doğrudan kullan
        setImage(`data:image/jpeg;base64,${data.image}`);
      }
    } catch (err) {
      setError("Bir hata oluştu");
    }
    setLoading(false);
  };

  return (
    // New full-page centered container with background gradient
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Centered card container */}
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "2rem",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <h1
          style={{ textAlign: "center", marginBottom: "1.5rem", color: "#333" }}
        >
          Anime Karakter Görseli Oluşturucu
        </h1>
        <form onSubmit={generateImage}>
          <input
            type="text"
            placeholder="Anime karakterinizi tanımlayın..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              marginBottom: "1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Oluştur
          </button>
        </form>

        {loading && (
          <p style={{ textAlign: "center", marginTop: "1rem" }}>
            Görsel oluşturuluyor...
          </p>
        )}
        {error && (
          <p style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>
            {error}
          </p>
        )}
        {image && (
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <h2 style={{ marginBottom: "1rem" }}>Oluşturulan Görsel:</h2>
            <img
              src={image}
              alt="Anime karakter"
              style={{ maxWidth: "100%", height: "auto", borderRadius: "4px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

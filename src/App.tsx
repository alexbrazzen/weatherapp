import React, { useEffect, useState } from "react";

export default function App() {
  const [temp, setTemp] = useState<number | null>(null);
  const [desc, setDesc] = useState("");

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=55.6059&longitude=13.0007&current_weather=true&timezone=Europe/Stockholm")
      .then((r) => r.json())
      .then((d) => {
        setTemp(Math.round(d.current_weather.temperature));
        setDesc(d.current_weather.windspeed + " m/s vind");
      });
  }, []);

  return (
    <div style={{ background: "#0f1117", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", color: "#e8eaf0" }}>
      <div style={{ fontSize: "20px", color: "#c5d8f5", marginBottom: "16px", letterSpacing: "2px" }}>himmel</div>
      <div style={{ fontSize: "80px", lineHeight: 1 }}>{temp !== null ? temp + "°" : "..."}</div>
      <div style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", marginTop: "8px" }}>Malmö · {desc}</div>
    </div>
  );
}

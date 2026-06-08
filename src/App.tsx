import { useEffect, useState } from "react";

interface Hour {
  h: number;
  temp: number;
  code: number;
  rain: number;
}

interface CurrentWeather {
  temperature: number;
  weathercode: number;
}

const WMO: Record<number, string> = {0:"Klart",1:"Mest klart",2:"Delvis molnigt",3:"Mulet",45:"Dimma",51:"Duggregn",61:"Regn",63:"Regn",65:"Kraftigt regn",71:"Snö",80:"Skurar",95:"Åska"};
const ICON: Record<number, string> = {0:"☀️",1:"🌤",2:"⛅",3:"☁️",45:"🌫",51:"🌦",61:"🌧",63:"🌧",65:"🌧",71:"❄️",80:"🌦",95:"⛈"};

export default function App() {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [hours, setHours] = useState<Hour[]>([]);

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=55.6059&longitude=13.0007&hourly=temperature_2m,weathercode,precipitation&current_weather=true&timezone=Europe/Stockholm&forecast_days=1")
      .then((r) => r.json())
      .then((d) => {
        setWeather(d.current_weather);
        const now = new Date().getHours();
        const result: Hour[] = [];
        for (let i = 0; i < 8; i++) {
          result.push({
            h: new Date(d.hourly.time[now + i]).getHours(),
            temp: Math.round(d.hourly.temperature_2m[now + i]),
            code: d.hourly.weathercode[now + i],
            rain: d.hourly.precipitation[now + i],
          });
        }
        setHours(result);
      });
  }, []);

  if (!weather) {
    return <div style={{background:"#0f1117",minHeight:"100vh",fontFamily:"sans-serif",color:"rgba(255,255,255,0.3)",padding:"60px 24px"}}>Hämtar väder...</div>;
  }

  return (
    <div style={{background:"#0f1117",minHeight:"100vh",fontFamily:"sans-serif",color:"#e8eaf0"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 24px",borderBottom:"0.5px solid rgba(255,255,255,0.07)"}}>
        <span style={{fontSize:"20px",color:"#c5d8f5",fontWeight:"300",letterSpacing:"1px"}}>himmel</span>
        <span style={{fontSize:"11px",color:"rgba(255,255,255,0.25)"}}>● live · Malmö</span>
      </div>
      <div style={{padding:"32px 24px"}}>
        <div style={{fontSize:"72px",lineHeight:1,marginBottom:"8px"}}>{Math.round(weather.temperature)}°</div>
        <div style={{fontSize:"16px",color:"rgba(255,255,255,0.45)",marginBottom:"32px"}}>{WMO[weather.weathercode] || "–"}</div>
        <div style={{display:"flex",gap:"8px",overflowX:"auto",paddingBottom:"8px"}}>
          {hours.map((h, i) => (
            <div key={i} style={{minWidth:"60px",background:i===0?"rgba(122,179,232,0.12)":"rgba(255,255,255,0.04)",border:`0.5px solid ${i===0?"rgba(122,179,232,0.3)":"rgba(255,255,255,0.07)"}`,borderRadius:"10px",padding:"10px 8px",textAlign:"center",flexShrink:0}}>
              <div style={{fontSize:"11px",color:"rgba(255,255,255,0.3)",marginBottom:"6px"}}>{i===0?"Nu":h.h+":00"}</div>
              <div style={{fontSize:"20px"}}>{ICON[h.code]||"🌡"}</div>
              <div style={{fontSize:"14px",fontWeight:"500",marginTop:"6px"}}>{h.temp}°</div>
              {h.rain > 0 && <div style={{fontSize:"11px",color:"#5DCAA5",marginTop:"3px"}}>{h.rain}mm</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

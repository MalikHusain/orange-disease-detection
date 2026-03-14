import { useState } from "react";
import "./DiseasesPage.css";

const DISEASES = [
  {
    name: "Healthy",
    icon: "🌿",
    color: "#22c55e",
    bgColor: "#f0fdf4",
    severity: "None",
    description: "A healthy orange leaf shows vibrant green color with no visible lesions, spots, or discoloration. The leaf has uniform coloration and intact structure.",
    symptoms: ["Vibrant, uniform green color", "No spots or lesions", "Normal leaf structure", "No yellowing or wilting"],
    treatments: ["Maintain regular watering", "Apply balanced NPK fertilizer", "Monitor for early disease signs", "Ensure adequate sunlight"],
    prevention: ["Regular inspection", "Proper drainage", "Good air circulation"],
    funFact: "A healthy orange tree can produce up to 200 oranges per year and live for over 50 years."
  },
  {
    name: "Citrus Canker",
    icon: "🦠",
    color: "#ef4444",
    bgColor: "#fef2f2",
    severity: "High",
    description: "A bacterial disease caused by Xanthomonas axonopodis pv. citri. One of the most damaging diseases affecting all parts of the citrus plant.",
    symptoms: ["Raised, corky lesions with water-soaked margins", "Brown spots with yellow halo", "Lesions on leaves, twigs, and fruit", "Premature leaf and fruit drop"],
    treatments: ["Apply copper-based bactericides", "Remove and burn infected plant parts", "Avoid overhead irrigation", "Disinfect pruning tools", "Protective sprays every 2-3 weeks"],
    prevention: ["Use disease-free certified plants", "Windbreaks to reduce spread", "Quarantine infected plants"],
    funFact: "Citrus Canker can spread through infected tools, contaminated soil, and even splashing rainwater."
  },
  {
    name: "Black Spot",
    icon: "⬛",
    color: "#f59e0b",
    bgColor: "#fffbeb",
    severity: "Medium",
    description: "A fungal disease caused by Guignardia citricarpa affecting leaves, twigs, and fruits. More common in warm, humid climates.",
    symptoms: ["Black, sunken spots on leaves and fruit", "Yellow halo surrounding spots", "Hard, corky tissue in spots", "Premature fruit drop"],
    treatments: ["Apply mancozeb or copper-based fungicides", "Remove and destroy fallen leaves", "Improve air circulation by pruning", "Avoid excessive moisture", "Lime sulfur during dormant season"],
    prevention: ["Collect and destroy fallen leaves", "Avoid dense planting", "Regular fungicide program"],
    funFact: "Black Spot spores can survive in fallen leaves for up to 6 months, making cleanup critical."
  },
  {
    name: "Greening Disease",
    icon: "🤢",
    color: "#8b5cf6",
    bgColor: "#f5f3ff",
    severity: "Critical",
    description: "Also called HLB (Huanglongbing), caused by Candidatus Liberibacter asiaticus. Considered the most devastating citrus disease worldwide with no known cure.",
    symptoms: ["Blotchy mottled yellowing of leaves", "Asymmetric chlorosis", "Stunted growth and twig dieback", "Small, misshapen, bitter fruits", "Greening of normally colored fruit"],
    treatments: ["Control Asian citrus psyllid vectors", "Remove and destroy infected trees immediately", "Nutritional sprays to manage symptoms", "Systemic insecticide applications", "Regular monitoring and early removal"],
    prevention: ["Use certified disease-free nursery stock", "Control psyllid population rigorously", "Quarantine new plants for 90 days"],
    funFact: "HLB has no cure and has devastated citrus industries globally, including wiping out over 70% of Florida's citrus production."
  },
];

const SEV_STYLE = {
  None:     { bg: "#f0fdf4", color: "#15803d" },
  Medium:   { bg: "#fffbeb", color: "#b45309" },
  High:     { bg: "#fef2f2", color: "#dc2626" },
  Critical: { bg: "#fef2f2", color: "#dc2626" },
};

export default function DiseasesPage() {
  const [active, setActive] = useState(0);
  const d = DISEASES[active];

  return (
    <div className="diseases-page fade-up">
      <div className="diseases-header">
        <h1 className="section-title">Disease Encyclopedia</h1>
        <p className="section-sub">Learn about orange leaf diseases, their symptoms, and treatment strategies.</p>
      </div>

      {/* Tabs */}
      <div className="disease-tabs">
        {DISEASES.map((dis, i) => (
          <button
            key={i}
            className={`disease-tab ${active === i ? "active" : ""}`}
            style={active === i ? { borderColor: dis.color, background: dis.bgColor } : {}}
            onClick={() => setActive(i)}
          >
            <span className="tab-icon">{dis.icon}</span>
            <span className="tab-name">{dis.name.replace(/_/g, " ")}</span>
            <span
              className="tab-severity"
              style={SEV_STYLE[dis.severity]}
            >
              {dis.severity}
            </span>
          </button>
        ))}
      </div>

      {/* Detail */}
      <div className="disease-detail card" key={active}>
        <div className="detail-banner" style={{ background: d.bgColor, borderColor: d.color }}>
          <div className="detail-icon">{d.icon}</div>
          <div className="detail-title-block">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#1c1917" }}>
              {d.name.replace(/_/g, " ")}
            </h2>
            <span
              className="severity-pill"
              style={{ background: SEV_STYLE[d.severity].bg, color: SEV_STYLE[d.severity].color }}
            >
              Severity: {d.severity}
            </span>
          </div>
        </div>

        <div className="detail-body">
          <p className="detail-desc">{d.description}</p>

          <div className="detail-grid">
            <div className="detail-section">
              <h3>🔍 Symptoms</h3>
              <ul>
                {d.symptoms.map((s, i) => (
                  <li key={i} style={{ "--accent": d.color }}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <h3>💊 Treatments</h3>
              <ol>
                {d.treatments.map((t, i) => (
                  <li key={i}><span className="t-num" style={{ background: d.color }}>{i+1}</span>{t}</li>
                ))}
              </ol>
            </div>

            <div className="detail-section">
              <h3>🛡️ Prevention</h3>
              <ul>
                {d.prevention.map((p, i) => (
                  <li key={i} style={{ "--accent": d.color }}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="detail-section fun-fact">
              <div className="funfact-label">💡 Did you know?</div>
              <p>{d.funFact}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

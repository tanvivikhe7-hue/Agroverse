// ── AGROVERSE AI TOOLS COMPONENT ──

class AgroAI {
  static async detectCropDisease(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_BASE}/detect-crop-disease`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  }

  static async analyzeSoil(data, file) {
    const formData = new FormData();
    if (file) formData.append('image', file);
    for (const key in data) {
      formData.append(key, data[key]);
    }

    const response = await fetch(`${API_BASE}/soil-analysis`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  }

  static renderResultCard(type, result) {
    if (type === 'crop') {
      const isHealthy = result.status === 'healthy';
      return `
        <div class="ai-result-card ${isHealthy ? 'healthy' : 'diseased'}">
          <div class="ai-result-header">
            <span class="ai-icon">${isHealthy ? '🌿' : '🦠'}</span>
            <div>
              <h4>${isHealthy ? 'Plant Health: Healthy' : 'Plant Health: Diseased'}</h4>
              <p>${result.disease_name}</p>
            </div>
            <div class="ai-confidence">${result.confidence}% Confidence</div>
          </div>
          <div class="ai-severity ${result.severity}">${result.severity.toUpperCase()} SEVERITY</div>
          <div class="ai-details">
            <div class="ai-detail-item"><strong>💊 Treatment:</strong> ${result.treatment}</div>
            <div class="ai-detail-item"><strong>🌱 Prevention:</strong> ${result.prevention}</div>
          </div>
          <button class="btn btn-ghost" onclick="resetAI('crop')" style="width:100%;margin-top:12px">Re-scan</button>
        </div>
      `;
    } else {
      const health = result.soil_health;
      return `
        <div class="ai-result-card soil-${health}">
          <div class="ai-result-header">
            <span class="ai-icon">🌱</span>
            <div>
              <h4>Soil Health: ${health.toUpperCase()}</h4>
              <p>Type: ${result.soil_type}</p>
            </div>
          </div>
          <div class="npk-grid">
            <div class="npk-item ${result.nutrients.nitrogen}">N: ${result.nutrients.nitrogen}</div>
            <div class="npk-item ${result.nutrients.phosphorus}">P: ${result.nutrients.phosphorus}</div>
            <div class="npk-item ${result.nutrients.potassium}">K: ${result.nutrients.potassium}</div>
          </div>
          <div class="ai-details">
            <div class="ai-detail-item"><strong>💊 Recommended Fertilizer:</strong> ${result.recommended_fertilizer}</div>
            <div class="ai-detail-item"><strong>📦 Quantity:</strong> ${result.quantity}</div>
            <div class="ai-detail-item"><strong>🌾 Suitable Crops:</strong> ${result.suitable_crops.join(', ')}</div>
            ${result.warnings !== "None" ? `<div class="ai-detail-item" style="color:var(--red)"><strong>⚠️ Warnings:</strong> ${result.warnings}</div>` : ''}
          </div>
          <button class="btn btn-ghost" onclick="resetAI('soil')" style="width:100%;margin-top:12px">New Analysis</button>
        </div>
      `;
    }
  }
}

// Add CSS for AI cards
const aiStyles = `
.ai-result-card { background:#fff; border-radius:16px; padding:20px; box-shadow:var(--shadow-lg); border-top:6px solid var(--leaf); animation: fadeIn 0.5s; }
.ai-result-card.diseased { border-top-color: var(--red); }
.ai-result-card.soil-poor { border-top-color: var(--red); }
.ai-result-card.soil-moderate { border-top-color: #E8A020; }
.ai-result-header { display:flex; gap:14px; align-items:center; margin-bottom:16px; }
.ai-icon { font-size:32px; }
.ai-confidence { margin-left:auto; font-size:11px; font-weight:700; background:rgba(82,183,136,0.1); color:var(--leaf); padding:4px 10px; border-radius:12px; }
.ai-severity { font-size:10px; font-weight:900; letter-spacing:1px; margin-bottom:12px; padding:2px 8px; border-radius:4px; display:inline-block; }
.ai-severity.high { background:rgba(217,79,61,0.1); color:var(--red); }
.ai-severity.medium { background:rgba(232,160,32,0.1); color:#8B6914; }
.ai-severity.none { background:rgba(82,183,136,0.1); color:var(--leaf); }
.ai-details { display:grid; gap:10px; }
.ai-detail-item { font-size:12px; color:var(--gray); line-height:1.5; }
.ai-detail-item strong { color:var(--dark); }
.npk-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; margin-bottom:16px; }
.npk-item { text-align:center; padding:6px; border-radius:8px; font-size:11px; font-weight:700; text-transform:uppercase; }
.npk-item.low { background:#fff5f5; color:var(--red); border:1px solid #ffcfcf; }
.npk-item.medium { background:#fffdf0; color:#8B6914; border:1px solid #fdf3cc; }
.npk-item.high { background:#f0faf5; color:var(--leaf); border:1px solid #d4f0e2; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = aiStyles;
document.head.appendChild(styleSheet);

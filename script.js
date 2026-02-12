/* ==========================================
   1. MOTOR DE MERCADO (API BRAPI)
   ========================================== */
const BRAPI_TOKEN = 'oRA929ZKJEMTKDC198biWG';
let charts = {};

async function renderDashboard() {
    const tableBody = document.getElementById('table-body');
    if(!tableBody) return; // Só executa se estiver na página do consolidador

    const data = JSON.parse(localStorage.getItem('nodo_db') || '[]');
    const tickers = data.filter(a => a.type === 'VARIAVEL').map(a => a.name).join(',');
    let livePrices = {};

    if (tickers) {
        try {
            const response = await fetch(`https://brapi.dev/api/quote/${tickers}?token=${BRAPI_TOKEN}`);
            const result = await response.json();
            result.results?.forEach(s => {
                livePrices[s.symbol] = { price: s.regularMarketPrice, change: s.regularMarketChangePercent };
            });
        } catch (e) { console.error("Erro API:", e); }
    }

    // ... (restante da lógica de renderização que já usamos)
}

/* ==========================================
   2. ANIMAÇÕES DA HOME (CONTADORES)
   ========================================== */
const countElements = document.querySelectorAll('.counter');
const startCounter = (el) => {
    const target = +el.getAttribute('data-target');
    let count = 0;
    const updateCount = () => {
        const increment = target / 30;
        if (count < target) {
            count += increment;
            el.innerText = Math.ceil(count) + (target === 100 ? "%" : "");
            setTimeout(updateCount, 30);
        } else { el.innerText = (target === 14 ? "+" : "") + target + (target === 100 ? "%" : ""); }
    };
    updateCount();
};

const dataObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if(entry.isIntersecting) startCounter(entry.target); });
}, { threshold: 0.5 });

countElements.forEach(el => dataObserver.observe(el));

window.onload = () => { if(document.getElementById('table-body')) renderDashboard(); };
/* ==========================================================================
   1. ANIMAÇÃO DOS CONTADORES (DATA STRIP)
   ========================================================================== */
const countElements = document.querySelectorAll('.counter');

const startCounter = (el) => {
    const target = +el.getAttribute('data-target');
    
    // Define velocidades diferentes baseadas no valor do alvo
    const speedFactor = (target > 500) ? 15 : 40; 
    let count = 0;

    const updateCount = () => {
        const increment = target / speedFactor;
        
        if (count < target) {
            count += increment;
            let displayValue = Math.ceil(count);
            
            // Formatação especial baseada no tipo de dado
            if (target === 14) el.innerText = "+" + displayValue;
            else if (target === 100) el.innerText = displayValue + "%";
            else el.innerText = displayValue;
            
            setTimeout(updateCount, 20);
        } else {
            // Garante o valor final exato
            if (target === 14) el.innerText = "+" + target;
            else if (target === 100) el.innerText = target + "%";
            else el.innerText = target;
        }
    };

    updateCount();
};

// Ativa o contador apenas quando o elemento aparece na tela
const dataObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startCounter(entry.target);
            dataObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

countElements.forEach(el => dataObserver.observe(el));


/* ==========================================================================
   2. ENVIO DO FORMULÁRIO (VIA FETCH API)
   ========================================================================== */
const form = document.getElementById("my-form");

if (form) {
    async function handleSubmit(event) {
        event.preventDefault(); // Impede o redirecionamento padrão
        
        const status = document.getElementById("status");
        const data = new FormData(event.target);
        const btn = document.getElementById("submit-btn");

        // Estado visual de carregamento
        btn.innerText = "Enviando...";
        btn.disabled = true;

        fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                form.style.display = "none"; // Esconde o form após sucesso
                if (status) status.style.display = "block"; // Mostra mensagem de sucesso
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert("Ocorreu um erro. Tente novamente.");
                    }
                });
            }
        }).catch(error => {
            alert("Erro de conexão. Verifique sua internet.");
        }).finally(() => {
            // Restaura o botão caso haja erro
            btn.innerText = "Solicitar Diagnóstico Estratégico";
            btn.disabled = false;
        });
    }

    form.addEventListener("submit", handleSubmit);
}

/* ==========================================================================
   3. SISTEMA DE REVEAL (EFEITO LUXO)
   ========================================================================== */
const revealElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Opcional: para a animação rodar apenas uma vez, descomente a linha abaixo:
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.50 // Começa a animação quando 15% do elemento aparece
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};

// Inicia o sistema de reveal
window.addEventListener('DOMContentLoaded', revealElements);

function toggleMenu() {
    const nav = document.querySelector('.main-nav');
    const icon = document.querySelector('.mobile-menu-icon');
    nav.classList.toggle('active');
    icon.classList.toggle('open');
}

/* ==========================================================================
   SISTEMA DE INTERATIVIDADE NODO (OTIMIZADO)
   ========================================================================== */

// 1. Controle do Menu Mobile (Hambúrguer)
function toggleMenu() {
    const nav = document.querySelector('.main-nav');
    const icon = document.querySelector('.mobile-menu-icon');
    if (nav && icon) {
        nav.classList.toggle('active');
        icon.classList.toggle('open');
    }
}

// 2. Sistema de Reveal (Seguro para Desktop e Mobile)
const setupReveal = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1, // Dispara com apenas 10% do elemento na tela
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};

// 3. Inicialização Protegida
document.addEventListener('DOMContentLoaded', () => {
    // Inicia animações
    setupReveal();

    // Fecha menu ao clicar em links (Apenas se os elementos existirem)
    const navLinks = document.querySelectorAll('.nav-link');
    const nav = document.querySelector('.main-nav');
    const icon = document.querySelector('.mobile-menu-icon');

    if (navLinks.length > 0 && nav && icon) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                icon.classList.remove('open');
            });
        });
    }
});

/* ==========================================================================
   CONTROLO SEGURO DO MENU
   ========================================================================== */
function toggleMenu() {
    const nav = document.querySelector('.main-nav');
    const icon = document.querySelector('.mobile-menu-icon');
    if (nav && icon) {
        nav.classList.toggle('active');
        icon.classList.toggle('open');
    }
}

// Fecha o menu ao carregar a página e ao clicar em links
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.main-nav');
    const icon = document.querySelector('.mobile-menu-icon');

    // Reset inicial para evitar que o menu comece aberto
    if(nav) nav.classList.remove('active');
    if(icon) icon.classList.remove('open');

    // Fecha ao clicar em links
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
            nav.classList.remove('active');
            icon.classList.remove('open');
        }
    });
});

/* ==========================================================================
   SISTEMA DE MENU E VISIBILIDADE
   ========================================================================== */

function toggleMenu() {
    const nav = document.querySelector('.main-nav');
    const icon = document.querySelector('.mobile-menu-icon');
    if (nav) nav.classList.toggle('active');
    if (icon) icon.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Reset de Menu (Segurança para Mobile)
    const nav = document.querySelector('.main-nav');
    if (nav) nav.classList.remove('active');

    // 2. Sistema de Reveal Otimizado (Threshold baixo para não sumir no Desktop)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 3. Fechar menu ao clicar em links
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
            const icon = document.querySelector('.mobile-menu-icon');
            if (nav) nav.classList.remove('active');
            if (icon) icon.classList.remove('open');
        }
    });
});

// Dados de mercado simulados (Selic e IPCA)
const MARKET_DATA = {
    SELIC_DAILY: 0.00041, // Aproximadamente 10.75% a.a.
    IPCA_MONTHLY: 0.004 // 0.4% ao mês
};

function calculateAndSave() {
    const asset = {
        name: document.getElementById('assetName').value,
        platform: document.getElementById('assetPlatform').value,
        value: parseFloat(document.getElementById('assetValue').value),
        rate: parseFloat(document.getElementById('assetRate').value),
        date: new Date(document.getElementById('assetDate').value),
        index: document.getElementById('assetIndex').value,
        maturity: document.getElementById('assetMaturity').value
    };

    // Lógica de Valor Presente Simples (VPA)
    const today = new Date();
    const daysHeld = Math.floor((today - asset.date) / (1000 * 60 * 60 * 24));
    
    let currentValue = asset.value;

    if (asset.index === 'CDI') {
        // Cálculo: Valor * (1 + (TaxaCDI * %Contratada))^Dias
        const dailyRate = MARKET_DATA.SELIC_DAILY * (asset.rate / 100);
        currentValue = asset.value * Math.pow((1 + dailyRate), daysHeld);
    }

    console.log(`Ativo: ${asset.name} | Valor Atualizado: R$ ${currentValue.toFixed(2)}`);
    
    // Armazenar localmente para a próxima fase
    let myPortfolio = JSON.parse(localStorage.getItem('nodo_portfolio') || '[]');
    myPortfolio.push({...asset, currentValue});
    localStorage.setItem('nodo_portfolio', JSON.stringify(myPortfolio));

    toggleModal(false);
    alert("Ativo cadastrado com sucesso! Valor atualizado calculado.");
}

function updateSummary() {
    document.getElementById('sumName').innerText = document.getElementById('assetName').value || "Novo Ativo";
    const val = parseFloat(document.getElementById('assetValue').value) || 0;
    document.getElementById('totalPreview').innerText = `R$ ${val.toLocaleString('pt-BR')}`;
}

const BRAPI_TOKEN = 'oRA929ZKJEMTKDC198biWG';
let charts = {};

// Funções de Controle do Modal
function openModal() { document.getElementById('modal').style.display = 'flex'; goToStep(1); }
function closeModal() { document.getElementById('modal').style.display = 'none'; }

function goToStep(step, type = null) {
    if(type) currentType = type;
    document.querySelectorAll('.step-content').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.step-dot').forEach(d => d.classList.remove('active'));
    document.getElementById('step' + step).style.display = 'block';
    document.getElementById('dot' + step).classList.add('active');
    if(step === 2) renderFields();
}

function renderFields() {
    const container = document.getElementById('dynamic-fields');
    if(currentType === 'FIXA') {
        document.getElementById('step2-title').innerText = "Configuração Renda Fixa";
        container.innerHTML = `
            <div class="input-group" style="grid-column: span 2"><label>NOME DO TÍTULO</label><input type="text" id="asset-name" placeholder="Ex: CDB Inter 110%"></div>
            <div class="input-group"><label>INDEXADOR</label><select id="index"><option value="CDI">CDI</option><option value="IPCA">IPCA+</option></select></div>
            <div class="input-group"><label>TAXA (%)</label><input type="number" id="rate" placeholder="110"></div>
            <div class="input-group" style="grid-column: span 2"><label>VALOR APLICADO</label><input type="number" id="invested" placeholder="R$ 0,00"></div>
        `;
    } else {
        document.getElementById('step2-title').innerText = "Configuração Renda Variável";
        container.innerHTML = `
            <div class="input-group" style="grid-column: span 2"><label>TICKER (B3)</label><input type="text" id="asset-name" placeholder="Ex: PETR4"></div>
            <div class="input-group"><label>QUANTIDADE</label><input type="number" id="qty" placeholder="100"></div>
            <div class="input-group"><label>PREÇO MÉDIO</label><input type="number" id="price" placeholder="R$ 0,00"></div>
        `;
    }
}

// Salvar Ativo
function saveAsset() {
    const name = document.getElementById('asset-name').value.toUpperCase().trim();
    const date = document.getElementById('date').value;
    const platform = document.getElementById('platform').value;

    let asset = { name, type: currentType, platform, date };

    if(currentType === 'FIXA') {
        const val = parseFloat(document.getElementById('invested').value);
        asset.value = val;
        asset.currentValue = val; // Inicialmente igual, será atualizado pelo cálculo de CDI
    } else {
        const qty = parseFloat(document.getElementById('qty').value);
        const prc = parseFloat(document.getElementById('price').value);
        asset.quantity = qty;
        asset.avgPrice = prc;
        asset.value = qty * prc;
        asset.currentValue = qty * prc; // Será atualizado pela API
    }

    let db = JSON.parse(localStorage.getItem('nodo_db') || '[]');
    db.push(asset);
    localStorage.setItem('nodo_db', JSON.stringify(db));
    closeModal();
    renderDashboard();
}

// Renderizar Dashboard com Dados da API
async function renderDashboard() {
    const data = JSON.parse(localStorage.getItem('nodo_db') || '[]');
    const tableBody = document.getElementById('table-body');
    const kpiArea = document.getElementById('kpi-area');

    if(data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:40px;">Nenhum ativo cadastrado.</td></tr>';
        return;
    }

    // Preparar busca na API para Renda Variável
    const tickers = data.filter(a => a.type === 'VARIAVEL').map(a => a.name).join(',');
    let livePrices = {};

    if (tickers) {
        try {
            const response = await fetch(`https://brapi.dev/api/quote/${tickers}?token=${BRAPI_TOKEN}`);
            const result = await response.json();
            if (result.results) {
                result.results.forEach(s => {
                    livePrices[s.symbol] = { price: s.regularMarketPrice, change: s.regularMarketChangePercent };
                });
            }
        } catch (e) { console.error("Erro na API Brapi:", e); }
    }

    let totalActual = 0;
    let totalInvested = 0;
    let totalDayChange = 0;

    const rows = data.map(a => {
        let currentPricePerUnit = a.avgPrice || 0;
        let dayChangePct = 0;

        if (a.type === 'VARIAVEL' && livePrices[a.name]) {
            currentPricePerUnit = livePrices[a.name].price;
            dayChangePct = livePrices[a.name].change;
            a.currentValue = currentPricePerUnit * a.quantity;
            totalDayChange += (a.currentValue * (dayChangePct / 100));
        } else if (a.type === 'FIXA') {
            // Simulação de acúmulo de Renda Fixa (0.04% ao dia útil aprox.)
            a.currentValue = a.value * 1.005; 
        }

        const pnl = a.currentValue - a.value;
        const yieldPct = ((a.currentValue / a.value) - 1) * 100;
        
        totalActual += a.currentValue;
        totalInvested += a.value;

        return `
            <tr>
                <td><b>${a.name}</b><br><small style="color:var(--muted)">${a.type} | ${a.platform}</small></td>
                <td>R$ ${a.currentValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                <td class="${pnl >= 0 ? 'positive' : 'negative'}">R$ ${Math.abs(pnl).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                <td class="${pnl >= 0 ? 'positive' : 'negative'}">${yieldPct.toFixed(2)}%</td>
                <td style="font-weight:700">${((a.currentValue / (totalActual || 1)) * 100).toFixed(1)}%</td>
            </tr>
        `;
    }).join('');

    tableBody.innerHTML = rows;

    const totalProfit = totalActual - totalInvested;
    kpiArea.innerHTML = `
        <div class="kpi-card"><small>PATRIMÔNIO ATUAL</small><h2>R$ ${totalActual.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h2></div>
        <div class="kpi-card"><small>LUCRO TOTAL</small><h2 class="${totalProfit >= 0 ? 'positive' : 'negative'}">R$ ${totalProfit.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h2></div>
        <div class="kpi-card"><small>VARIAÇÃO DO DIA</small><h2 class="${totalDayChange >= 0 ? 'positive' : 'negative'}">R$ ${totalDayChange.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h2></div>
    `;

    updateCharts(data);
}

function updateCharts(data) {
    if(charts.alloc) charts.alloc.destroy();
    const types = { 'FIXA': 0, 'VARIAVEL': 0 };
    data.forEach(a => types[a.type] += a.currentValue);

    const ctx = document.getElementById('allocChart').getContext('2d');
    charts.alloc = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Fixa', 'Variável'],
            datasets: [{ data: [types.FIXA, types.VARIAVEL], backgroundColor: ['#d1a686', '#1f1f23'], borderWidth: 0 }]
        },
        options: { cutout: '80%', plugins: { legend: { position: 'bottom', labels: { color: '#71717a' } } } }
    });
}

window.onload = renderDashboard;


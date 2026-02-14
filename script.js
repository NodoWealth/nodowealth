/* ==========================================================================
   CONFIGURAÇÕES GLOBAIS E NAVEGAÇÃO
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    
    // Inicializa o Terminal Nodo se os elementos existirem
    const btnReveal = document.getElementById('btn-reveal');
    if (btnReveal) {
        initTerminalNodo(btnReveal);
    }

    // Inicializa Contadores da Home
    if (document.querySelector('.counter')) {
        initCounters();
    }
});

let evolutionChartInstance = null;

function initNavigation() {
    const menuIcon = document.querySelector('.mobile-menu-icon');
    const nav = document.querySelector('.main-nav');
    if (menuIcon && nav) {
        menuIcon.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuIcon.classList.toggle('open');
        });
    }
}

function initScrollEffects() {
    // Efeito de Header ao rolar
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.padding = "15px 5%";
            header.style.background = "rgba(5, 5, 5, 0.95)";
        } else {
            header.style.padding = "0 5%";
            header.style.background = "rgba(5, 5, 5, 0.6)";
        }
    });

    // Reveal animation
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    reveals.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   LÓGICA DO TERMINAL NODO: INTELIGÊNCIA FINANCEIRA
   ========================================================================== */
let myChart = null;

function initTerminalNodo(btn) {
    btn.addEventListener('click', () => {
        // 1. Coleta de dados
        const inicial = parseFloat(document.getElementById('initial-val').value) || 0;
        const mensal = parseFloat(document.getElementById('monthly-val').value) || 0;
        const taxaAnual = parseFloat(document.getElementById('rate-val').value) || 0;
        const tempoAnos = parseInt(document.getElementById('period-val').value) || 0;

        if (tempoAnos <= 0) {
            alert("Por favor, insira um período válido.");
            return;
        }

        // 2. Cálculos Financeiros
        const meses = tempoAnos * 12;
        const taxaMensal = Math.pow(1 + (taxaAnual / 100), 1/12) - 1;
        
        let total = inicial;
        let investido = inicial;
        let historicoValores = [inicial];
        let labelsAnos = ['Início'];

        for (let i = 1; i <= meses; i++) {
            total = (total + mensal) * (1 + taxaMensal);
            investido += mensal;
            
            // Guarda o valor a cada 12 meses para o gráfico
            if (i % 12 === 0) {
                historicoValores.push(total.toFixed(2));
                labelsAnos.push(`Ano ${i/12}`);
            }
        }

        const juros = total - investido;
        const percJuros = (juros / total) * 100;

        // 3. Atualizar Interface (Textos e Barras Neon)
        document.getElementById('res-total-value').innerText = total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
        document.getElementById('res-invested').innerText = investido.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
        document.getElementById('res-interest').innerText = juros.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
        
        document.getElementById('bar-inv').style.width = (100 - percJuros) + "%";
        document.getElementById('bar-int').style.width = percJuros + "%";

        // 4. MUDANÇA DE ESTADO (Esconde formulário, mostra resultado)
        document.getElementById('state-lock').classList.remove('active');
        document.getElementById('state-lock').style.display = 'none';
        const finalState = document.getElementById('state-final');
        finalState.classList.add('active');
        finalState.style.display = 'block';

        // 5. GERAR O GRÁFICO (Aqui está o segredo)
        const ctx = document.getElementById('evolutionChart').getContext('2d');
        
        if (evolutionChartInstance) {
            evolutionChartInstance.destroy(); // Limpa o gráfico antigo
        }

        evolutionChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labelsAnos,
                datasets: [{
                    label: 'Evolução Patrimonial',
                    data: historicoValores,
                    borderColor: '#d1a686',
                    backgroundColor: 'rgba(209, 166, 134, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: '#d1a686'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { ticks: { color: '#52525b' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { ticks: { color: '#52525b' }, grid: { display: false } }
                }
            }
        });

        // Opcional: Enviar os dados (Lead)
        logLead(inicial, total, tempoAnos);
    });

function executarEngineAlpha(nome, fone, inicial, mensal, taxaAnual, anos) {
    const taxaMensal = (taxaAnual / 100) / 12;
    const mesesTotais = anos * 12;
    
    let labels = [];
    let dataInvestido = [];
    let dataTotal = [];

    // Cálculo mês a mês para o gráfico
    for (let i = 0; i <= mesesTotais; i++) {
        const montante = inicial * Math.pow(1 + taxaMensal, i) + 
                         mensal * ((Math.pow(1 + taxaMensal, i) - 1) / taxaMensal);
        const investido = inicial + (mensal * i);

        // Salva pontos anuais + o ponto final
        if (i % 12 === 0 || i === mesesTotais) {
            labels.push(`Ano ${i/12}`);
            dataInvestido.push(investido.toFixed(2));
            dataTotal.push(montante.toFixed(2));
        }
    }

    // Renderização dos resultados textuais
    const totalFinal = parseFloat(dataTotal[dataTotal.length - 1]);
    const investidoFinal = parseFloat(dataInvestido[dataInvestido.length - 1]);
    const jurosFinal = totalFinal - investidoFinal;

    document.getElementById('res-total-value').innerText = totalFinal.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
    document.getElementById('res-invested').innerText = investidoFinal.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
    document.getElementById('res-interest').innerText = jurosFinal.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});

    // Troca de estado da UI
    document.getElementById('state-lock').classList.remove('active');
    document.getElementById('state-final').classList.add('active');

    // Inicializa o Gráfico Interativo
    renderizarGraficoAlpha(labels, dataInvestido, dataTotal);
    
    // Envio do Lead
    enviarLeadFormspree(nome, fone, inicial, totalFinal, anos);
}

function renderizarGraficoAlpha(labels, investido, total) {
    const ctx = document.getElementById('evolutionChart').getContext('2d');
    if (myChart) { myChart.destroy(); }

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Patrimônio Total',
                data: total,
                borderColor: '#d1a686',
                backgroundColor: 'rgba(209, 166, 134, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#d1a686'
            }, {
                label: 'Seu Capital',
                data: investido,
                borderColor: '#52525b',
                fill: false,
                borderDash: [5, 5],
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#111',
                    titleColor: '#d1a686',
                    bodyColor: '#fff',
                    borderColor: '#333',
                    borderWidth: 1,
                    callbacks: {
                        label: (ctx) => ` ${ctx.dataset.label}: R$ ${parseFloat(ctx.raw).toLocaleString('pt-br')}`
                    }
                }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#52525b' } },
                y: { display: false }
            }
        }
    });
}

function enviarLeadFormspree(nome, fone, inicial, final, tempo) {
    const data = {
        origem: "Simulador Nodo",
        nome: nome,
        whatsapp: fone,
        inicial: inicial,
        final: final,
        tempo: tempo + " anos"
    };
    fetch("https://formspree.io/f/xgozjjqq", {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).catch(err => console.error("Lead log error:", err));
}

/* ==========================================================================
   OUTROS COMPONENTES (CONTADORES)
   ========================================================================== */
function initCounters() {
    const countElements = document.querySelectorAll('.counter');
    const startCounter = (el) => {
        const target = +el.getAttribute('data-target');
        let count = 0;
        const update = () => {
            const inc = target / 40;
            if (count < target) {
                count += inc;
                el.innerText = Math.ceil(count) + (target === 100 ? "%" : "");
                setTimeout(update, 30);
            } else { el.innerText = target + (target === 100 ? "%" : ""); }
        };
        update();
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if(e.isIntersecting) { startCounter(e.target); observer.unobserve(e.target); } });
    }, { threshold: 0.5 });
    countElements.forEach(el => observer.observe(el));
}

window.scrollTo({ top: document.getElementById('state-final').offsetTop - 100, behavior: 'smooth' });
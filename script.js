/* ==========================================================================
   CONFIGURAÇÕES GLOBAIS E ROTEAMENTO INTERNO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa o Menu Mobile (Presente em todas as páginas)
    initNavigation();

    // 2. Inicializa Contadores (Apenas se existirem na página - ex: Home)
    if (document.querySelector('.counter')) {
        initCounters();
    }

    // 3. Inicializa Simulador (Apenas se o canvas do gráfico existir)
    if (document.getElementById('simuladorChart')) {
        initSimulador();
    }
});

/* ==========================================================================
   1. NAVEGAÇÃO MOBILE
   ========================================================================== */
function initNavigation() {
    const menuIcon = document.querySelector('.mobile-menu-icon');
    const nav = document.querySelector('.main-nav');

    if (menuIcon && nav) {
        menuIcon.addEventListener('click', () => {
            nav.classList.toggle('active');
            // Animação simples no ícone (opcional, caso queira transformar em X)
            menuIcon.classList.toggle('open');
        });
    }
}

/* ==========================================================================
   2. CONTADORES ANIMADOS (HOME/INDEX)
   ========================================================================== */
function initCounters() {
    const countElements = document.querySelectorAll('.counter');
    
    const startCounter = (el) => {
        const target = +el.getAttribute('data-target');
        const speedFactor = (target > 500) ? 15 : 40; 
        let count = 0;

        const updateCount = () => {
            const increment = target / speedFactor;
            if (count < target) {
                count += increment;
                let displayValue = Math.ceil(count);
                
                // Formatação de sufixos baseada no alvo
                if (target === 14) el.innerText = "+" + displayValue;
                else if (target === 100) el.innerText = displayValue + "%";
                else el.innerText = displayValue;
                
                setTimeout(updateCount, 20);
            } else {
                // Valor final exato
                if (target === 14) el.innerText = "+" + target;
                else if (target === 100) el.innerText = target + "%";
                else el.innerText = target;
            }
        };
        updateCount();
    };

    // Intersection Observer: Só começa a contar quando o usuário rolar até os números
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    countElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   3. SIMULADOR DE JUROS COMPOSTOS (SIMULADOR.HTML)
   ========================================================================== */
let simuladorChart = null;

function initSimulador() {
    const btnSimular = document.getElementById('btn-simular');
    
    if (btnSimular) {
        btnSimular.addEventListener('click', () => {
            const inicial = parseFloat(document.getElementById('p-inicial').value) || 0;
            const mensal = parseFloat(document.getElementById('p-mensal').value) || 0;
            const taxaAnual = parseFloat(document.getElementById('p-taxa').value) || 0;
            const anos = parseInt(document.getElementById('p-anos').value) || 0;

            const taxaMensal = Math.pow(1 + (taxaAnual / 100), 1 / 12) - 1;
            const meses = anos * 12;

            let saldoTotal = inicial;
            let totalInvestido = inicial;
            
            let dataPontos = [inicial];
            let investidoPontos = [inicial];
            let labels = ['Início'];

            for (let i = 1; i <= meses; i++) {
                saldoTotal = (saldoTotal + mensal) * (1 + taxaMensal);
                totalInvestido += mensal;

                // Salva o ponto no gráfico a cada 12 meses (anualmente)
                if (i % 12 === 0) {
                    dataPontos.push(saldoTotal.toFixed(2));
                    investidoPontos.push(totalInvestido.toFixed(2));
                    labels.push(`Ano ${i / 12}`);
                }
            }

            // Atualiza o valor textual na tela
            const resPatrimonio = document.getElementById('res-patrimonio');
            if (resPatrimonio) {
                resPatrimonio.innerText = `R$ ${saldoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }

            renderChart(labels, dataPontos, investidoPontos);
        });
    }
}

function renderChart(labels, data, invested) {
    const ctx = document.getElementById('simuladorChart').getContext('2d');
    
    // Se já existir um gráfico, destrói antes de criar o novo (evita sobreposição)
    if (simuladorChart) {
        simuladorChart.destroy();
    }

    simuladorChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Patrimônio Projetado',
                data: data,
                borderColor: '#d1a686',
                backgroundColor: 'rgba(209, 166, 134, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#d1a686'
            }, {
                label: 'Total Investido',
                data: invested,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#666' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#666' }
                }
            }
        }
    });
}

/* ==========================================================================
   OPTIMIZED UX ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    // Outras inicializações...
});

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Uma vez revelado, não precisa mais observar
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // Começa a animação quando 15% do item aparece
        rootMargin: "0px 0px -50px 0px" // Margem inferior para o usuário ver o início
    });

    reveals.forEach(el => revealObserver.observe(el));
}

// Suavização do Menu ao Rolar
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

/* ==========================================================================
   LÓGICA DO TERMINAL NODO: INTELIGÊNCIA FINANCEIRA
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    const btnReveal = document.getElementById('btn-reveal');

    if (btnReveal) {
        btnReveal.addEventListener('click', function() {
            // 1. Coleta de Dados do Investidor
            const name = document.getElementById('user-name').value;
            const phone = document.getElementById('user-phone').value;

            // 2. Coleta de Parâmetros de Cálculo
            const p = parseFloat(document.getElementById('initial-val').value) || 0;
            const pm = parseFloat(document.getElementById('monthly-val').value) || 0;
            const rAnual = parseFloat(document.getElementById('rate-val').value) || 0;
            const anos = parseFloat(document.getElementById('period-val').value) || 0;

            // Validação de segurança
            if (!name || phone.length < 10 || p <= 0 || anos <= 0) {
                alert("Por favor, preencha todos os parâmetros e sua identificação para processar.");
                return;
            }

            // 3. Efeito Visual de "Processamento"
            btnReveal.innerHTML = `<span class="spinner"></span> SINCRONIZANDO ALGORITMO...`;
            btnReveal.disabled = true;

            // Delay estratégico de 1.5s para percepção de valor/complexidade
            setTimeout(() => {
                executarCalculoAlpha(name, phone, p, pm, rAnual, anos);
            }, 1500);
        });
    }
});

function executarCalculoAlpha(nome, fone, inicial, mensal, taxaAnual, anos) {
    // Matemática Financeira (Juros Compostos com Aportes)
    const taxaMensal = (taxaAnual / 100) / 12;
    const meses = anos * 12;

    // Fórmula: M = P(1+i)^n + PMT * [((1+i)^n - 1) / i]
    const montanteFinal = inicial * Math.pow(1 + taxaMensal, meses) + 
                          mensal * ((Math.pow(1 + taxaMensal, meses) - 1) / taxaMensal);
    
    const totalInvestido = inicial + (mensal * meses);
    const totalJuros = montanteFinal - totalInvestido;

    // 4. Renderização dos Resultados no Dashboard
    document.getElementById('res-total-value').innerText = montanteFinal.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
    document.getElementById('res-invested').innerText = totalInvested.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
    document.getElementById('res-interest').innerText = totalJuros.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
    
    // Cálculo da porcentagem de juros sobre o todo
    const percJuros = ((totalJuros / montanteFinal) * 100).toFixed(0);
    const labelJuros = document.getElementById('perc-interest-label');
    if(labelJuros) labelJuros.innerText = `${percJuros}% EM JUROS`;

    // 5. Troca de Estado da Interface (Lock -> Dashboard)
    document.getElementById('state-lock').classList.remove('active');
    document.getElementById('state-final').classList.add('active');

    // 6. Disparo da Animação das Barras Neon
    setTimeout(() => {
        const pInv = (totalInvested / montanteFinal) * 100;
        const pInt = (totalJuros / montanteFinal) * 100;
        
        document.getElementById('bar-inv').style.width = pInv + "%";
        document.getElementById('bar-int').style.width = pInt + "%";
    }, 300);

    // 7. Envio Silencioso para o Formspree (Lead Generation)
    enviarLeadFormspree(nome, fone, inicial, montanteFinal, anos);
}

function enviarLeadFormspree(nome, fone, inicial, final, tempo) {
    const data = {
        origem: "Calculadora Nodo Alpha",
        nome: nome,
        whatsapp: fone,
        aporte_inicial: inicial.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}),
        projeção_patrimonio: final.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}),
        horizonte_tempo: tempo + " anos"
    };

    fetch("https://formspree.io/f/xgozjjqq", {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).catch(err => console.error("Erro ao registrar lead:", err));
}

document.addEventListener('DOMContentLoaded', function() {
    const btnReveal = document.getElementById('btn-reveal');

    if (btnReveal) {
        btnReveal.addEventListener('click', function() {
            // Pegar valores financeiros
            const p = parseFloat(document.getElementById('initial-val').value) || 0;
            const pm = parseFloat(document.getElementById('monthly-val').value) || 0;
            const rAnual = parseFloat(document.getElementById('rate-val').value) || 0;
            const anos = parseFloat(document.getElementById('period-val').value) || 0;

            // Pegar valores do Lead
            const name = document.getElementById('user-name').value;
            const phone = document.getElementById('user-phone').value;

            if (p <= 0 || !name || phone.length < 10) {
                alert("Por favor, preencha os dados financeiros e sua identificação.");
                return;
            }

            // Matemática Financeira
            const rMensal = (rAnual / 100) / 12;
            const meses = anos * 12;
            const montante = p * Math.pow(1 + rMensal, meses) + pm * ((Math.pow(1 + rMensal, meses) - 1) / rMensal);
            const investido = p + (pm * meses);
            const juros = montante - investido;

            // Renderizar
            document.getElementById('res-total-value').innerText = montante.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
            document.getElementById('res-invested').innerText = investido.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
            document.getElementById('res-interest').innerText = juros.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});

            // Trocar Estado
            document.getElementById('state-lock').classList.remove('active');
            document.getElementById('state-final').classList.add('active');

            // Animar Barras
            setTimeout(() => {
                document.getElementById('bar-inv').style.width = (invested / montante * 100) + "%";
                document.getElementById('bar-int').style.width = (juros / montante * 100) + "%";
            }, 200);
        });
    }
});

let myChart = null; // Variável global para controlar o gráfico

function executarCalculoAlpha(nome, fone, inicial, mensal, taxaAnual, anos) {
    const taxaMensal = (taxaAnual / 100) / 12;
    const mesesTotais = anos * 12;
    
    let labels = [];
    let dataInvestido = [];
    let dataTotal = [];
    let dataJuros = [];

    // Cálculo mês a mês para gerar os dados do gráfico
    for (let i = 0; i <= mesesTotais; i++) {
        const montante = inicial * Math.pow(1 + taxaMensal, i) + 
                         mensal * ((Math.pow(1 + taxaMensal, i) - 1) / taxaMensal);
        const investido = inicial + (mensal * i);
        const juros = montante - investido;

        // Adicionamos ao gráfico apenas os pontos anuais para não poluir
        if (i % 12 === 0 || i === mesesTotais) {
            labels.push(`Ano ${i/12}`);
            dataInvestido.push(investido.toFixed(2));
            dataTotal.push(montante.toFixed(2));
            dataJuros.push(juros.toFixed(2));
        }
    }

    renderizarGrafico(labels, dataInvestido, dataJuros, dataTotal);
    
    // Atualiza os textos de resultado final (Montante do último mês)
    const totalFinal = dataTotal[dataTotal.length - 1];
    document.getElementById('res-total-value').innerText = parseFloat(totalFinal).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
    // ... restante da atualização de textos ...
}

function renderizarGrafico(labels, investido, juros, total) {
    const ctx = document.getElementById('evolutionChart').getContext('2d');
    
    // Se o gráfico já existir (em uma nova simulação), nós o destruímos para criar o novo
    if (myChart) { myChart.destroy(); }

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Acumulado',
                data: total,
                borderColor: '#d1a686', // Bronze Nodo
                backgroundColor: 'rgba(209, 166, 134, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'Aportes Totais',
                data: investido,
                borderColor: '#52525b',
                borderDash: [5, 5],
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            let value = context.parsed.y;
                            return label + ': ' + value.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
                        }
                    }
                },
                legend: { display: false }
            },
            scales: {
                y: { display: false },
                x: { ticks: { color: '#52525b' }, grid: { display: false } }
            }
        }
    });
}
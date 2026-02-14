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


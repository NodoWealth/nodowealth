document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. SISTEMA DE MENU MOBILE (HAMBURGUER) ---
    const btnMenu = document.querySelector('.mobile-menu-icon');
    const navMenu = document.querySelector('.nav-links');

    if (btnMenu && navMenu) {
        btnMenu.onclick = function(event) {
            event.preventDefault(); // Evita comportamento padrão
            navMenu.classList.toggle('active');
            btnMenu.classList.toggle('open');
            
            // Trava o scroll da página quando o menu está aberto
            if(navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        };

        // Fecha o menu ao clicar em qualquer link
        const allLinks = navMenu.querySelectorAll('a');
        allLinks.forEach(link => {
            link.onclick = function() {
                navMenu.classList.remove('active');
                btnMenu.classList.remove('open');
                document.body.style.overflow = '';
            };
        });
    }

    // --- 2. EFEITO DE SCROLL NO HEADER ---
    const header = document.querySelector('.header-main');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.background = "rgba(5, 5, 5, 0.98)";
                header.style.height = "70px"; // Diminui levemente
            } else {
                header.style.background = "rgba(5, 5, 5, 0.95)";
                header.style.height = "80px";
            }
        });
    }

    // --- 3. INICIALIZADORES (SEUS COMPONENTES) ---
    // Inicia contadores se existirem na página
    if (document.querySelector('.counter')) {
        initCounters();
    }
    
    // Inicia Terminal/Formulários se existirem
    const btnReveal = document.getElementById('btn-reveal');
    if (btnReveal && typeof initTerminalNodo === 'function') {
        initTerminalNodo(btnReveal);
    }
    
    // Inicia animações de scroll (Reveal)
    initScrollAnimations();
});

// Função de Contadores (Preservada do seu código original)
function initCounters() {
    const countElements = document.querySelectorAll('.counter');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if(e.isIntersecting) {
                const el = e.target;
                const target = +el.getAttribute('data-target');
                let count = 0;
                const update = () => {
                    const inc = target / 40;
                    if (count < target) {
                        count += inc;
                        el.innerText = Math.ceil(count) + (target === 100 ? "%" : "");
                        setTimeout(update, 30);
                    } else {
                        el.innerText = target + (target === 100 ? "%" : "");
                    }
                };
                update();
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    
    countElements.forEach(el => observer.observe(el));
}

// Função de Animação de Entrada (Reveal)
function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    reveals.forEach(el => revealObserver.observe(el));
}
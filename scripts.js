document.addEventListener('DOMContentLoaded', () => {

    // ---- Navbar scroll behavior ----
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ---- Mobile nav toggle ----
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('active'));
    });

    // ---- Floating nodes in hero ----
    const nodesContainer = document.getElementById('floatingNodes');
    for (let i = 0; i < 30; i++) {
        const node = document.createElement('div');
        node.className = 'node';
        node.style.left = Math.random() * 100 + '%';
        node.style.top = Math.random() * 100 + '%';
        node.style.animationDelay = Math.random() * -20 + 's';
        node.style.animationDuration = (15 + Math.random() * 15) + 's';
        nodesContainer.appendChild(node);
    }

    // ---- Stat counter animation ----
    const animateCounters = () => {
        document.querySelectorAll('.stat-number[data-target]').forEach(el => {
            const target = parseFloat(el.dataset.target);
            const duration = 2000;
            const start = performance.now();
            const isFloat = target % 1 !== 0;

            const update = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = target * eased;
                el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
                if (progress < 1) requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
        });
    };

    // ---- Intersection Observer for animations ----
    const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.framework-card, .driver-item, .barrier-card, .region-card, .case-study, .emerging-card, .policy-pillar, .dash-card').forEach(el => {
        el.classList.add('fade-in');
        fadeObserver.observe(el);
    });

    const heroObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateCounters();
            heroObserver.disconnect();
        }
    }, { threshold: 0.3 });
    heroObserver.observe(document.querySelector('.hero-stats'));

    // ---- Chart.js global config ----
    Chart.defaults.color = '#8888a0';
    Chart.defaults.borderColor = '#2a2a3a';
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 12;

    // ---- Diffusion S-Curve Chart ----
    const diffusionCtx = document.getElementById('diffusionCurveChart');
    if (diffusionCtx) {
        const labels = Array.from({ length: 30 }, (_, i) => i + 1);

        const classicSCurve = labels.map(x => 100 / (1 + Math.exp(-0.35 * (x - 15))));

        const emergingCurve = labels.map(x => {
            if (x < 8) return 100 / (1 + Math.exp(-0.2 * (x - 15)));
            if (x < 14) return 100 / (1 + Math.exp(-0.55 * (x - 12)));
            return Math.min(100, 100 / (1 + Math.exp(-0.45 * (x - 12))));
        });

        new Chart(diffusionCtx, {
            type: 'line',
            data: {
                labels: labels.map(l => ''),
                datasets: [
                    {
                        label: 'Classic S-Curve (Rogers)',
                        data: classicSCurve,
                        borderColor: '#5a5a72',
                        borderWidth: 2,
                        borderDash: [8, 4],
                        pointRadius: 0,
                        fill: false,
                        tension: 0.4,
                    },
                    {
                        label: 'Emerging Market (Leapfrog)',
                        data: emergingCurve,
                        borderColor: '#6366f1',
                        borderWidth: 3,
                        pointRadius: 0,
                        fill: {
                            target: 'origin',
                            above: 'rgba(99,102,241,0.08)',
                        },
                        tension: 0.4,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.6,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 20, usePointStyle: true, pointStyle: 'line' }
                    },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: {
                        display: true,
                        title: { display: true, text: 'Time', color: '#5a5a72' },
                        grid: { display: false },
                        ticks: { display: false }
                    },
                    y: {
                        display: true,
                        title: { display: true, text: 'Adoption %', color: '#5a5a72' },
                        min: 0,
                        max: 105,
                        grid: { color: '#1e1e2e' },
                        ticks: { callback: v => v + '%' }
                    }
                }
            }
        });
    }

    // ---- Barriers Horizontal Bar Chart ----
    const barriersCtx = document.getElementById('barriersChart');
    if (barriersCtx) {
        new Chart(barriersCtx, {
            type: 'bar',
            data: {
                labels: [
                    'Connectivity gaps',
                    'Affordability',
                    'Skill shortages',
                    'Regulatory fragmentation',
                    'Financing gaps',
                    'Language & localization',
                    'Political instability',
                    'Data privacy concerns'
                ],
                datasets: [{
                    label: 'Severity Impact Score',
                    data: [92, 88, 78, 72, 68, 58, 55, 48],
                    backgroundColor: [
                        '#ef4444', '#ef4444',
                        '#f97316', '#f97316',
                        '#eab308', '#eab308',
                        '#6366f1', '#6366f1'
                    ],
                    borderRadius: 6,
                    borderSkipped: false,
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2.2,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#16161f',
                        titleColor: '#e4e4ec',
                        bodyColor: '#8888a0',
                        borderColor: '#2a2a3a',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: ctx => `Impact: ${ctx.raw}/100`
                        }
                    }
                },
                scales: {
                    x: {
                        min: 0,
                        max: 100,
                        grid: { color: '#1e1e2e' },
                        ticks: { callback: v => v + '/100' }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { font: { size: 12 } }
                    }
                }
            }
        });
    }

    // ---- Internet Penetration Grouped Bar ----
    const internetCtx = document.getElementById('internetPenetrationChart');
    if (internetCtx) {
        new Chart(internetCtx, {
            type: 'bar',
            data: {
                labels: ['Sub-Saharan\nAfrica', 'South\nAsia', 'Southeast\nAsia', 'Latin\nAmerica', 'MENA', 'East\nAsia'],
                datasets: [
                    {
                        label: '2015',
                        data: [18, 22, 38, 50, 42, 52],
                        backgroundColor: '#2a2a5a',
                        borderRadius: 4,
                        borderSkipped: false,
                    },
                    {
                        label: '2025',
                        data: [40, 55, 73, 75, 72, 82],
                        backgroundColor: '#6366f1',
                        borderRadius: 4,
                        borderSkipped: false,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: { padding: 16, usePointStyle: true, pointStyle: 'rect' }
                    },
                    tooltip: {
                        backgroundColor: '#16161f',
                        titleColor: '#e4e4ec',
                        bodyColor: '#8888a0',
                        borderColor: '#2a2a3a',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw}%` }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 11 }, maxRotation: 0 }
                    },
                    y: {
                        min: 0,
                        max: 100,
                        grid: { color: '#1e1e2e' },
                        ticks: { callback: v => v + '%' }
                    }
                }
            }
        });
    }

    // ---- Tech Readiness Radar Chart ----
    const techCtx = document.getElementById('techReadinessChart');
    if (techCtx) {
        new Chart(techCtx, {
            type: 'radar',
            data: {
                labels: ['Infrastructure', 'Human Capital', 'Innovation', 'Market Size', 'Regulation', 'Investment'],
                datasets: [
                    {
                        label: 'India',
                        data: [55, 72, 68, 90, 60, 65],
                        borderColor: '#06b6d4',
                        backgroundColor: 'rgba(6,182,212,0.1)',
                        borderWidth: 2,
                        pointRadius: 3,
                        pointBackgroundColor: '#06b6d4',
                    },
                    {
                        label: 'Nigeria',
                        data: [35, 42, 52, 70, 38, 45],
                        borderColor: '#f97316',
                        backgroundColor: 'rgba(249,115,22,0.1)',
                        borderWidth: 2,
                        pointRadius: 3,
                        pointBackgroundColor: '#f97316',
                    },
                    {
                        label: 'Brazil',
                        data: [62, 58, 55, 78, 55, 58],
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139,92,246,0.1)',
                        borderWidth: 2,
                        pointRadius: 3,
                        pointBackgroundColor: '#8b5cf6',
                    },
                    {
                        label: 'Vietnam',
                        data: [52, 62, 48, 55, 52, 50],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16,185,129,0.1)',
                        borderWidth: 2,
                        pointRadius: 3,
                        pointBackgroundColor: '#10b981',
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 16, usePointStyle: true, pointStyle: 'circle' }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 25,
                            backdropColor: 'transparent',
                            color: '#5a5a72',
                            font: { size: 10 }
                        },
                        grid: { color: '#1e1e2e' },
                        angleLines: { color: '#1e1e2e' },
                        pointLabels: {
                            color: '#8888a0',
                            font: { size: 11, weight: '500' }
                        }
                    }
                }
            }
        });
    }

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});

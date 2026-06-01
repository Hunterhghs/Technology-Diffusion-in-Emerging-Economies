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

    // ---- Stat counter animation ----
    const animateCounters = () => {
        document.querySelectorAll('.stat-number[data-target]').forEach(el => {
            const target = parseFloat(el.dataset.target);
            const duration = 1800;
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
    const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

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
    Chart.defaults.color = '#6b6b6b';
    Chart.defaults.borderColor = '#e8e5de';
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 11;

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
                labels: labels.map(() => ''),
                datasets: [
                    {
                        label: 'Classic S-Curve (Rogers)',
                        data: classicSCurve,
                        borderColor: '#c2bdb3',
                        borderWidth: 2,
                        borderDash: [6, 4],
                        pointRadius: 0,
                        fill: false,
                        tension: 0.4,
                    },
                    {
                        label: 'Emerging Market (Leapfrog)',
                        data: emergingCurve,
                        borderColor: '#1b2a4a',
                        borderWidth: 2.5,
                        pointRadius: 0,
                        fill: {
                            target: 'origin',
                            above: 'rgba(27,42,74,0.06)',
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
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'line',
                            font: { size: 11, family: "'Inter', sans-serif" }
                        }
                    },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: {
                        display: true,
                        title: { display: true, text: 'Time', color: '#9a9a9a', font: { size: 11, style: 'italic', family: "'Source Serif 4', Georgia, serif" } },
                        grid: { display: false },
                        ticks: { display: false }
                    },
                    y: {
                        display: true,
                        title: { display: true, text: 'Adoption %', color: '#9a9a9a', font: { size: 11, style: 'italic', family: "'Source Serif 4', Georgia, serif" } },
                        min: 0,
                        max: 105,
                        grid: { color: '#e8e5de' },
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
                        '#8b2020', '#8b2020',
                        '#8b5a1a', '#8b5a1a',
                        '#6b6b1a', '#6b6b1a',
                        '#2c4470', '#2c4470'
                    ],
                    borderRadius: 1,
                    borderSkipped: false,
                    barPercentage: 0.7,
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
                        backgroundColor: '#1a1a1a',
                        titleColor: '#fff',
                        bodyColor: '#d8d4cc',
                        borderColor: '#3d3d3d',
                        borderWidth: 1,
                        padding: 10,
                        titleFont: { family: "'Inter', sans-serif", size: 12 },
                        bodyFont: { family: "'Inter', sans-serif", size: 11 },
                        callbacks: {
                            label: ctx => `Impact: ${ctx.raw}/100`
                        }
                    }
                },
                scales: {
                    x: {
                        min: 0,
                        max: 100,
                        grid: { color: '#e8e5de' },
                        ticks: { callback: v => v }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { font: { size: 11 } }
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
                        backgroundColor: '#d8d4cc',
                        borderRadius: 1,
                        borderSkipped: false,
                    },
                    {
                        label: '2025',
                        data: [40, 55, 73, 75, 72, 82],
                        backgroundColor: '#1b2a4a',
                        borderRadius: 1,
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
                        labels: {
                            padding: 16,
                            usePointStyle: true,
                            pointStyle: 'rect',
                            font: { size: 11 }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1a1a1a',
                        titleColor: '#fff',
                        bodyColor: '#d8d4cc',
                        borderColor: '#3d3d3d',
                        borderWidth: 1,
                        padding: 10,
                        callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw}%` }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 10 }, maxRotation: 0 }
                    },
                    y: {
                        min: 0,
                        max: 100,
                        grid: { color: '#e8e5de' },
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
                        borderColor: '#1a6b5a',
                        backgroundColor: 'rgba(26,107,90,0.08)',
                        borderWidth: 2,
                        pointRadius: 3,
                        pointBackgroundColor: '#1a6b5a',
                    },
                    {
                        label: 'Nigeria',
                        data: [35, 42, 52, 70, 38, 45],
                        borderColor: '#8b6914',
                        backgroundColor: 'rgba(139,105,20,0.06)',
                        borderWidth: 2,
                        pointRadius: 3,
                        pointBackgroundColor: '#8b6914',
                    },
                    {
                        label: 'Brazil',
                        data: [62, 58, 55, 78, 55, 58],
                        borderColor: '#7a2e3a',
                        backgroundColor: 'rgba(122,46,58,0.06)',
                        borderWidth: 2,
                        pointRadius: 3,
                        pointBackgroundColor: '#7a2e3a',
                    },
                    {
                        label: 'Vietnam',
                        data: [52, 62, 48, 55, 52, 50],
                        borderColor: '#1b2a4a',
                        backgroundColor: 'rgba(27,42,74,0.06)',
                        borderWidth: 2,
                        pointRadius: 3,
                        pointBackgroundColor: '#1b2a4a',
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 16,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: { size: 11 }
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 25,
                            backdropColor: 'transparent',
                            color: '#9a9a9a',
                            font: { size: 9 }
                        },
                        grid: { color: '#e8e5de' },
                        angleLines: { color: '#e8e5de' },
                        pointLabels: {
                            color: '#6b6b6b',
                            font: { size: 10, weight: '500', family: "'Inter', sans-serif" }
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

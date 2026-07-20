// ============================================================
// Portfolio interactions & animations
// ============================================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Mobile menu ----------
function toggleMenu(){
    document.querySelector("nav").classList.toggle("active");
}

document.querySelectorAll('nav [data-nav-link]').forEach(btn => {
    btn.addEventListener('click', () => {
        if (window.innerWidth <= 768){
            document.querySelector('nav').classList.remove('active');
        }
    });
});

// ---------- Scroll progress bar ----------
const progressBar = document.getElementById('scrollProgressBar');

function updateScrollProgress(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
}

// ---------- Back to top ----------
const backToTopBtn = document.getElementById('backToTop');

function updateBackToTop(){
    if (window.scrollY > 480){
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
}

if (backToTopBtn){
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
}

window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateBackToTop();
}, { passive: true });

updateScrollProgress();
updateBackToTop();

// ---------- Reveal on scroll ----------
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !prefersReducedMotion){
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting){
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
} else {
    revealEls.forEach(el => el.classList.add('is-visible'));
}

// ---------- Active nav link highlighting ----------
const sections = document.querySelectorAll('main section');
const navButtons = document.querySelectorAll('nav [data-nav-link]');

function setActiveLink(hash){
    navButtons.forEach(btn => {
        const target = btn.getAttribute('onclick') || '';
        btn.classList.toggle('active-link', target.includes(hash));
    });
}

if ('IntersectionObserver' in window){
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting){
                setActiveLink('#' + entry.target.id);
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(sec => navObserver.observe(sec));
}

// ---------- Cursor glow (desktop, fine pointer only) ----------
const cursorGlow = document.getElementById('cursorGlow');
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

if (cursorGlow && hasFinePointer && !prefersReducedMotion){
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.opacity = '1';
        cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });
}

// ---------- Typed role rotation ----------
const roles = [
    'Backend Developer',
    'ASP.NET Core Engineer',
    'RESTful API Builder',
    'Problem Solver'
];

const typedRoleEl = document.getElementById('typedRole');

function typeLoop(){
    if (!typedRoleEl) return;

    if (prefersReducedMotion){
        typedRoleEl.textContent = roles[0];
        return;
    }

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick(){
        const current = roles[roleIndex];

        if (!deleting){
            charIndex++;
            typedRoleEl.textContent = current.slice(0, charIndex);
            if (charIndex === current.length){
                deleting = true;
                setTimeout(tick, 1400);
                return;
            }
            setTimeout(tick, 65);
        } else {
            charIndex--;
            typedRoleEl.textContent = current.slice(0, charIndex);
            if (charIndex === 0){
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(tick, 300);
                return;
            }
            setTimeout(tick, 35);
        }
    }

    tick();
}

typeLoop();

// ---------- Terminal API console animation ----------
const terminalBody = document.getElementById('terminalBody');

const terminalScript = [
    { type: 'line', text: '<span class="req">GET</span> /api/contacts', delay: 40 },
    { type: 'pause', ms: 400 },
    { type: 'raw', text: '\n<span class="muted">Status: 200 OK</span>\n{\n  <span class="key">"id"</span>: <span class="num">1</span>,\n  <span class="key">"name"</span>: <span class="str">"Adivhaho Mulaudzi"</span>,\n  <span class="key">"role"</span>: <span class="str">"Backend Developer"</span>,\n  <span class="key">"skills"</span>: [<span class="str">"C#"</span>, <span class="str">"ASP.NET Core"</span>, <span class="str">"SQL"</span>]\n}\n' },
    { type: 'pause', ms: 1600 },
    { type: 'clear' },
    { type: 'line', text: '<span class="req">POST</span> /api/contacts', delay: 40 },
    { type: 'pause', ms: 400 },
    { type: 'raw', text: '\n<span class="muted">Status: 201 Created</span>\n{\n  <span class="key">"message"</span>: <span class="str">"Contact added successfully"</span>\n}\n' },
    { type: 'pause', ms: 1600 },
    { type: 'clear' }
];

async function runTerminal(){
    if (!terminalBody) return;

    if (prefersReducedMotion){
        terminalBody.innerHTML = '<span class="req">GET</span> /api/contacts\n<span class="muted">Status: 200 OK</span>\n{ "name": "Adivhaho Mulaudzi", "role": "Backend Developer" }';
        return;
    }

    while (true){
        for (const step of terminalScript){
            if (step.type === 'clear'){
                terminalBody.innerHTML = '';
            } else if (step.type === 'raw'){
                terminalBody.innerHTML += step.text;
            } else if (step.type === 'line'){
                await typeHTMLLine(terminalBody, step.text, step.delay);
            } else if (step.type === 'pause'){
                await sleep(step.ms);
            }
        }
    }
}

function typeHTMLLine(container, html, delay){
    return new Promise(resolve => {
        // Type visible text char-by-char while preserving span wrapper
        const temp = document.createElement('div');
        temp.innerHTML = html;
        const fullText = temp.textContent;
        let i = 0;
        const lineSpan = document.createElement('div');
        container.appendChild(lineSpan);

        function step(){
            i++;
            lineSpan.textContent = '$ ' + fullText.slice(0, i);
            if (i < fullText.length){
                setTimeout(step, delay);
            } else {
                lineSpan.innerHTML = '$ ' + html;
                resolve();
            }
        }
        step();
    });
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

runTerminal();

// ---------- Copy email ----------
const copyEmailBtn = document.getElementById('copyEmailBtn');

if (copyEmailBtn){
    copyEmailBtn.addEventListener('click', async () => {
        const email = 'adivhahoM5@outlook.com';
        try {
            await navigator.clipboard.writeText(email);
        } catch (err) {
            const temp = document.createElement('textarea');
            temp.value = email;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
        }
        copyEmailBtn.classList.add('copied');
        copyEmailBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        setTimeout(() => {
            copyEmailBtn.classList.remove('copied');
            copyEmailBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
        }, 1800);
    });
}
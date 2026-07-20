
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Mobile menu ---------
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

// ---------- Role text (static, no typing/erasing) ----------
const typedRoleEl = document.getElementById('typedRole');

if (typedRoleEl){
    typedRoleEl.textContent = 'Aspiring Software Developer';
}

// ---------- Terminal API console (static, fixed content) ----------
const terminalBody = document.getElementById('terminalBody');

if (terminalBody){
    terminalBody.innerHTML =
        '<span class="req">GET</span> /api/contacts\n' +
        '<span class="muted">Status: 200 OK</span>\n' +
        '{\n' +
        '  <span class="key">"id"</span>: <span class="num">1</span>,\n' +
        '  <span class="key">"name"</span>: <span class="str">"Adivhaho Mulaudzi"</span>,\n' +
        '  <span class="key">"role"</span>: <span class="str">"Software Developer"</span>,\n' +
        '  <span class="key">"skills"</span>: [<span class="str">"C#"</span>, <span class="str">"ASP.NET Core"</span>, <span class="str">"SQL"</span>]\n' +
        '}';
}

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
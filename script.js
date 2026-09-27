'use strict';

const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');
sidebarBtn.addEventListener('click', () => {
    const expanded = sidebar.classList.toggle('active');
    sidebarBtn.setAttribute('aria-expanded', String(expanded));
    sidebarBtn.querySelector('span').textContent = expanded ? 'Hide Contacts' : 'Show Contacts';
});

const pages = [...document.querySelectorAll('[data-page]')];
const navLinks = [...document.querySelectorAll('[data-nav-link]')];
const pageNames = pages.map(page => page.dataset.page);

function showPage(name, updateHistory = true) {
    const pageName = pageNames.includes(name) ? name : 'about';
    pages.forEach(page => page.classList.toggle('active', page.dataset.page === pageName));
    navLinks.forEach(link => {
        const label = link.textContent.trim().toLowerCase();
        const active = (label === 'projects' ? 'portfolio' : label) === pageName;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });
    if (updateHistory) history.replaceState(null, '', `#${pageName}`);
    window.scrollTo({ top: 0, behavior: 'auto' });
}

navLinks.forEach(link => link.addEventListener('click', () => {
    const name = link.textContent.trim().toLowerCase();
    showPage(name === 'projects' ? 'portfolio' : name);
}));
document.querySelectorAll('[data-go-to]').forEach(button => {
    button.addEventListener('click', () => showPage(button.dataset.goTo));
});
window.addEventListener('hashchange', () => showPage(location.hash.slice(1), false));
showPage(location.hash.slice(1), false);

const filterItems = [...document.querySelectorAll('[data-filter-item]')];
const filterButtons = [...document.querySelectorAll('[data-filter-btn]')];
const select = document.querySelector('[data-select]');
const selectValue = document.querySelector('[data-select-value]');

function setFilter(value) {
    const selected = value.toLowerCase();
    filterItems.forEach(item => {
        const categories = item.dataset.category.toLowerCase().split(',').map(category => category.trim());
        item.classList.toggle('active', selected === 'all' || categories.includes(selected));
    });
    filterButtons.forEach(button => button.classList.toggle('active', button.textContent.trim().toLowerCase() === selected));
    selectValue.textContent = value;
    select.classList.remove('active');
    select.setAttribute('aria-expanded', 'false');
}

filterButtons.forEach(button => button.addEventListener('click', () => setFilter(button.textContent.trim())));
select.addEventListener('click', () => {
    const expanded = select.classList.toggle('active');
    select.setAttribute('aria-expanded', String(expanded));
});
document.querySelectorAll('[data-select-item]').forEach(button => {
    button.addEventListener('click', () => setFilter(button.textContent.trim()));
});
document.addEventListener('click', event => {
    if (!event.target.closest('.filter-select-box')) {
        select.classList.remove('active');
        select.setAttribute('aria-expanded', 'false');
    }
});

const themeToggle = document.querySelector('[data-theme-toggle]');
const themeIcon = document.querySelector('.theme-icon');

function updateProjectImages() {
    const variant = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    document.querySelectorAll('.project-img img').forEach(img => {
        if (img.dataset.themeDark && img.dataset.themeLight) {
            img.src = img.dataset[variant === 'dark' ? 'themeDark' : 'themeLight'];
            return;
        }
        const picture = img.closest('picture');
        const source = picture?.querySelector('source');
        const darkSrc = img.dataset.darkSrc || img.getAttribute('src');
        img.dataset.darkSrc = darkSrc;
        img.src = variant === 'dark' ? darkSrc : darkSrc.replace('_dark.png', '.png');
        if (source) {
            const darkSet = source.dataset.darkSrcset || source.getAttribute('srcset');
            source.dataset.darkSrcset = darkSet;
            source.srcset = variant === 'dark' ? darkSet : darkSet.replace('_dark.webp', '.webp');
        }
    });
}

function applyTheme(theme) {
    const light = theme === 'light';
    document.body.classList.toggle('light-mode', light);
    themeIcon.name = light ? 'sunny-outline' : 'moon-outline';
    themeToggle.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} theme`);
    updateProjectImages();
}

applyTheme(localStorage.getItem('theme') || 'dark');
themeToggle.addEventListener('click', () => {
    const theme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    applyTheme(theme);
});

const modalContainer = document.querySelector('[data-project-modal-container]');
const modal = modalContainer.querySelector('.project-modal');
const modalContent = document.getElementById('project-modal-content');
const modalClose = document.querySelector('[data-project-close-btn]');
let modalTrigger = null;

function closeProject() {
    modalContainer.classList.remove('active');
    modalContent.replaceChildren();
    document.body.style.overflow = '';
    modalTrigger?.focus();
    modalTrigger = null;
}

document.querySelectorAll('[data-open-project]').forEach(button => {
    button.addEventListener('click', () => {
        const template = document.getElementById(`project-${button.dataset.openProject}`);
        if (!template) return;
        modalTrigger = button;
        modalContent.replaceChildren(template.content.cloneNode(true));
        modalContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
        modal.scrollTop = 0;
        modalClose.focus();
    });
});

modalClose.addEventListener('click', closeProject);
document.querySelector('[data-project-overlay]').addEventListener('click', closeProject);
document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        if (modalContainer.classList.contains('active')) closeProject();
        select.classList.remove('active');
        select.setAttribute('aria-expanded', 'false');
    }
    if (event.key !== 'Tab' || !modalContainer.classList.contains('active')) return;
    const focusable = [...modal.querySelectorAll('button, a[href]')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
});

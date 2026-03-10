// Original design: https://codepen.io/leonam-silva-de-souza/pen/vYowKqP

'use strict';

// Opening or closing side bar
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
sidebarBtn.addEventListener("click", function() { elementToggleFunc(sidebar); });

// Activating Filter Select and filtering options
const select = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-select-value]');
const filterBtn = document.querySelectorAll('[data-filter-btn]');

select.addEventListener('click', function () { elementToggleFunc(this); });

for (let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener('click', function() {
        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        elementToggleFunc(select);
        filterFunc(selectedValue);
    });
}

const filterItems = document.querySelectorAll('[data-filter-item]');

const filterFunc = function (selectedValue) {
    for (let i = 0; i < filterItems.length; i++) {
        const categoryAttr = filterItems[i].dataset.category.toLowerCase();
        if (selectedValue === "all" || categoryAttr.includes(selectedValue.toLowerCase())) {
            filterItems[i].classList.add("active");
        } else {
            filterItems[i].classList.remove("active");
        }
    }
};

let lastClickedBtn = filterBtn[0];
for (let i = 0; i < filterBtn.length; i++) {
    filterBtn[i].addEventListener('click', function() {
        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        filterFunc(selectedValue);
        lastClickedBtn.classList.remove('active');
        this.classList.add('active');
        lastClickedBtn = this;
    });
}

// Enabling Contact Form
const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');

for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener('input', function () {
        if (form.checkValidity()) {
            formBtn.removeAttribute('disabled');
        } else {
            formBtn.setAttribute('disabled', '');
        }
    });
}

// Enabling Page Navigation
const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

for (let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener('click', function() {
        for (let i = 0; i < pages.length; i++) {
            if (this.innerHTML.toLowerCase() == pages[i].dataset.page) {
                pages[i].classList.add('active');
                navigationLinks[i].classList.add('active');
                window.scrollTo(0, 0);
            } else {
                pages[i].classList.remove('active');
                navigationLinks[i].classList.remove('active');
            }
        }
    });
}

// Theme Toggle Functionality
const themeToggleBtn = document.querySelector('[data-theme-toggle]');
const themeIcon = document.querySelector('.theme-icon');

// Update project images based on current theme
const updateProjectImages = () => {
    const isDark = !document.body.classList.contains('light-mode');
    document.querySelectorAll('.project-img img').forEach(img => {
        const picture = img.closest('picture');
        if (picture) {
            picture.querySelectorAll('source').forEach(source => {
                if (isDark) {
                    if (!source.srcset.includes('_dark')) {
                        source.srcset = source.srcset.replace(/\.(webp)$/i, '_dark.$1');
                    }
                } else {
                    source.srcset = source.srcset.replace(/_dark(\.webp)$/i, '$1');
                }
            });
        }
        if (isDark) {
            if (!img.src.includes('_dark')) {
                img.src = img.src.replace(/\.png$/i, '_dark.png');
            }
        } else {
            img.src = img.src.replace('_dark.png', '.png');
        }
    });
};

// Check saved theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'light') {
    document.body.classList.add('light-mode');
    themeIcon.name = 'sunny-outline';
}

// Single listener for the theme toggle
themeToggleBtn.addEventListener('click', function () {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
        themeIcon.name = 'sunny-outline';
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.name = 'moon-outline';
        localStorage.setItem('theme', 'dark');
    }
    updateProjectImages();
});

// Apply theme on page load
updateProjectImages();

/* ===== PROJECT ARTICLES MODAL ===== */
const projectOpenButtons = document.querySelectorAll("[data-open-project]");
const projectModalContainer = document.querySelector("[data-project-modal-container]");
const projectOverlay = document.querySelector("[data-project-overlay]");
const projectCloseBtn = document.querySelector("[data-project-close-btn]");
const projectModalContent = document.getElementById("project-modal-content");

if (projectOpenButtons.length && projectModalContainer && projectOverlay && projectCloseBtn && projectModalContent) {
    const openProjectModal = (projectId) => {
        const template = document.getElementById(`project-${projectId}`);
        if (!template) return;
        projectModalContent.innerHTML = "";
        projectModalContent.appendChild(template.content.cloneNode(true));
        projectModalContainer.classList.add("active");
        document.body.style.overflow = "hidden";
    };

    const closeProjectModal = () => {
        projectModalContainer.classList.remove("active");
        projectModalContent.innerHTML = "";
        document.body.style.overflow = "";
    };

    projectOpenButtons.forEach((button) => {
        button.addEventListener("click", () => openProjectModal(button.dataset.openProject));
    });

    projectCloseBtn.addEventListener("click", closeProjectModal);
    projectOverlay.addEventListener("click", closeProjectModal);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && projectModalContainer.classList.contains("active")) {
            closeProjectModal();
        }
    });
}

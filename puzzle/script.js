
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const projectButtons = document.querySelectorAll('.project-button');

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
});

document.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        body.classList.add('dark');
    }

    const currentPath = window.location.pathname;
    projectButtons.forEach(button => {
        const targetPath = button.getAttribute('href');
        if (currentPath.endsWith(targetPath)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
});
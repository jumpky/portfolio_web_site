const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const projectButtons = document.querySelectorAll('.project-button');
const navButtons = document.querySelectorAll('.nav-button');


function Check() {
    let answers = ['2', '1', '3', '2', '3']; 
    let score = 0;

    for (let i = 1; i <= answers.length; i++) {
        let q = document.getElementById('q' + i);
        let a = document.getElementById('a' + i);

        if (a.value == answers[i - 1]) {
            q.style.border = '2px solid green';
            score++;
        } else {
            q.style.border = '2px solid red';
        }
    }

    document.getElementById('score').innerHTML = score;
    alert("Правильных ответов: " + score + " из " + answers.length);
}

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetPage = button.dataset.target;
        window.location.href = targetPage; 
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});


themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
});

document.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('theme');
    const currentPath = window.location.pathname;
    if (theme === 'dark') {
        body.classList.add('dark');
    }
    navButtons.forEach(button => {
        const targetPath = button.dataset.target;
        if (currentPath.endsWith(targetPath)) {
            button.classList.add('active');
        }
    });

    projectButtons.forEach(button => {
        const targetPath = button.getAttribute('href');
        if (currentPath.endsWith(targetPath)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
});

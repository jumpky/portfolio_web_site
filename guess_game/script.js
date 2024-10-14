
let secretNumber, attempts, maxAttempts, previousGuesses;
const outputDiv = document.getElementById('output');
const attemptsDiv = document.getElementById('attempts');
const inputField = document.getElementById('userInput');
const submitButton = document.getElementById('submitBtn');
const newGameBtn = document.getElementById('newGameBtn');
const imageContainer = document.getElementById('image-container');

// Звуки
const correctSound = new Audio('correct.mp3');
const incorrectSound = new Audio('incorrect.mp3');
const navButtons = document.querySelectorAll('.nav-button');

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetPage = button.dataset.target;
        window.location.href = targetPage; 
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    navButtons.forEach(button => {
        const targetPath = button.dataset.target;
        if (currentPath.endsWith(targetPath)) {
            button.classList.add('active');
        }
    });
});
function newGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    maxAttempts = 10;
    previousGuesses = [];
    outputDiv.textContent = '';
    attemptsDiv.textContent = '';
    inputField.disabled = false;
    inputField.value = '';
    imageContainer.innerHTML = ''; // Очистка контейнера с картинками
    submitButton.disabled = false;
}

newGame();

newGameBtn.addEventListener('click', newGame);

function Guess() {
    const userInput = parseInt(inputField.value);

    if (isNaN(userInput) || userInput < 1 || userInput > 100) {
        outputDiv.textContent = "Введите число от 1 до 100.";
        incorrectSound.play();
        return;
    }

    if (previousGuesses.includes(userInput)) {
        outputDiv.textContent = "Вы уже вводили это число. Попробуйте другое.";
        incorrectSound.play();
        return;
    }

    attempts++;
    previousGuesses.push(userInput);

    if (userInput === secretNumber) {
        outputDiv.textContent = `Поздравляю! Вы угадали число ${secretNumber} за ${attempts} ${attempts === 1 ? "попытку" : "попытки"}.`;
        inputField.disabled = true;
        submitButton.disabled = true;
        correctSound.play();
    } else if (userInput < secretNumber) {
        outputDiv.textContent = "Ваше число меньше загаданного.";
        incorrectSound.play();
    } else {
        outputDiv.textContent = "Ваше число больше загаданного.";
        incorrectSound.play();
    }

    const remainingAttempts = maxAttempts - attempts;
    attemptsDiv.textContent = `Осталось попыток: ${remainingAttempts}`;
    attemptsDiv.innerHTML += `<br>Ваши попытки: ${previousGuesses.join(', ')}`;

    
    const image = document.createElement('img');
    image.src = `images/image${attempts}.gif`;
    image.alt = `Попытка ${attempts}`;
    image.style.width = '100px'; 
    image.style.height = '100px'; 
    imageContainer.appendChild(image);

    if (attempts === maxAttempts) {
        outputDiv.textContent = `Вы проиграли. Загаданное число было ${secretNumber}.`;
        inputField.disabled = true;
        submitButton.disabled = true;
        incorrectSound.play();
    }

    inputField.value = '';
}

submitButton.addEventListener('click', Guess);


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
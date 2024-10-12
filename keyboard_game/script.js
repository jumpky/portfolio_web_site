document.addEventListener('DOMContentLoaded', () => {
    const fallingItemsContainer = document.getElementById('fallingItems');
    const scoreElement = document.getElementById('score');
    const wpmElement = document.getElementById('wpm');
    const accuracyElement = document.getElementById('accuracy');
    const countdownElement = document.getElementById('countdown');
    const resultContainer = document.getElementById('resultContainer');
    const finalScore = document.getElementById('finalScore');
    const finalWpm = document.getElementById('finalWpm');
    const finalAccuracy = document.getElementById('finalAccuracy');
    const startButton = document.getElementById('startButton');
    const closeButton = document.getElementById('closeButton');
    const overlay = document.getElementById('overlay');
    const gameContainer = document.querySelector('.game-container');
    const modeSelect = document.getElementById('mode');
    const userInputTextarea = document.getElementById('userInput');

    let gameStarted = false;
    let startTime;
    let score = 0;
    let correctChars = 0;
    let totalChars = 0;
    let typedWords = 0;
    let gameInterval;
    let keySpawnInterval;
    let currentItems = [];

    const russianLetters = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
    const englishLetters = "abcdefghijklmnopqrstuvwxyz";

    const easyWords = ["дом", "кот", "лес", "сон", "шар", "мяч", "нос", "рот", "лук"];
    const mediumWords = ["замок", "река", "гора", "море", "птица", "земля", "небо", "облако"];
    const hardWords = ["программа", "компьютер", "интернет", "технология", "информация", "разработка"];

    const getRandomLetter = (language) => language === 'ru' ? russianLetters[Math.floor(Math.random() * russianLetters.length)] : englishLetters[Math.floor(Math.random() * englishLetters.length)];

    const getRandomWord = (difficulty, language) => {
        const words = {
            easy: easyWords,
            medium: mediumWords,
            hard: hardWords
        }[difficulty];
        return words[Math.floor(Math.random() * words.length)];
    };

    const getRandomSentence = (difficulty, language) => { //  Заглушка,  требуется  реализация
        const sentences = [
            "The quick brown fox jumps over the lazy dog.",
            "Съешь ещё этих мягких французских булок да выпей чаю."
        ];
        return sentences[Math.floor(Math.random() * sentences.length)];
    };

    const getNextWordFromTextarea = () => {
        const text = userInputTextarea.value.trim();
        if (!text) return "";

        const words = text.split(/\s+/);
        const nextWord = words.shift();
        userInputTextarea.value = words.join(" ");
        return nextWord;
    };

    const getItemFallDuration = (difficulty) => ({ easy: 8, medium: 6, hard: 4 }[difficulty] || 6);

    const getItemSpawnRate = (difficulty) => ({ easy: 2000, medium: 1500, hard: 1000 }[difficulty] || 1500);

    const setFallingItemPosition = (item) => {
        let left;
        do {
            left = Math.random() * (gameContainer.offsetWidth - item.offsetWidth);
            item.style.left = left + 'px';
        } while (currentItems.some(existingItem => checkCollision(item, existingItem)));
    };
    const generateItems = (mode, language, difficulty) => {
        if (!gameStarted) return;

        const item = document.createElement('div');
        item.className = 'falling-item';

        item.textContent = {
            letters: getRandomLetter(language),
            words: getRandomWord(difficulty, language),
            sentences: getRandomSentence(difficulty, language),
            text: getNextWordFromTextarea()
        }[mode];

        setFallingItemPosition(item);
        fallingItemsContainer.appendChild(item);
        currentItems.push(item);

        item.style.animationName = 'falling';
        item.style.animationDuration = `${getItemFallDuration(difficulty)}s`;
        item.style.animationTimingFunction = 'linear';


        const topOffset = -item.offsetHeight;
        item.style.top = topOffset + 'px';

        item.addEventListener('animationend', () => {
            if (gameStarted) handleMissedItem(item);
        });
    };

    const handleMissedItem = (item) => {
        score -= 0.5; 
        updateScore();
        currentItems = currentItems.filter(i => i !== item);
        item.remove();
        totalChars += item.textContent.length;
        updateStats();
    };

    const updateStats = () => {
        if (!gameStarted) return;

        const elapsedTime = (Date.now() - startTime) / 1000 / 60;
        const wpm = Math.round((typedWords / elapsedTime) || 0);
        const accuracy = Math.round((correctChars / totalChars) * 100 || 100);

        wpmElement.textContent = wpm;
        accuracyElement.textContent = `${accuracy}%`;

        if (modeSelect.value === 'text' && getNextWordFromTextarea() === "") {
            gameOver();
        }
    };
    const checkCollision = (element1, element2) => {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();

        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    };


    const updateScore = () => scoreElement.textContent = score;

    const gameOver = () => {
        clearInterval(gameInterval);
        clearInterval(keySpawnInterval);
        gameStarted = false;
        startButton.disabled = false;

        finalScore.textContent = score;
        finalWpm.textContent = wpmElement.textContent;
        finalAccuracy.textContent = accuracyElement.textContent;

        resultContainer.style.display = 'block';

        fallingItemsContainer.innerHTML = '';
        currentItems = [];
    };

    const startGame = () => {
        if (gameStarted) return; // Предотвращаем повторный запуск, если игра уже идет
        gameStarted = true; // Устанавливаем флаг, что игра началась
        startButton.disabled = true; // Делаем кнопку "Старт" неактивной во время игры
        score = 0; // Обнуляем счет
        correctChars = 0; // Обнуляем количество правильно набранных символов
        totalChars = 0; // Обнуляем общее количество набранных символов
        typedWords = 0; // Обнуляем количество набранных слов
        updateScore(); // Обновляем отображение счета на экране
        fallingItemsContainer.innerHTML = ''; // Очищаем игровое поле от предыдущих элементов
    
        const mode = modeSelect.value; // Получаем выбранный режим игры
        const language = document.getElementById('language').value; // Получаем выбранный язык
        const difficulty = document.getElementById('difficulty').value; // Получаем выбранный уровень сложности
    
        // Показываем поле для ввода текста, только если выбран режим "text"
        userInputTextarea.style.display = mode === 'text' ? 'block' : 'none';
    
        startTime = Date.now(); // Записываем время начала игры для расчета WPM
    
        let countdownIndex = 0; // Индекс для сообщений обратного отсчета
        const countdownMessages = ["3", "2", "1", "Поехали!"]; // Массив сообщений обратного отсчета
        overlay.style.display = 'block'; // Показываем оверлей с обратным отсчетом
        countdownElement.textContent = countdownMessages[countdownIndex]; // Выводим первое сообщение
    
        const countdownInterval = setInterval(() => { // Запускаем интервал для обратного отсчета
            countdownIndex++; // Увеличиваем индекс сообщения
            if (countdownIndex < countdownMessages.length) {
                countdownElement.textContent = countdownMessages[countdownIndex]; // Выводим следующее сообщение
            } else {
                clearInterval(countdownInterval); // Останавливаем интервал после последнего сообщения
                overlay.style.display = 'none'; // Скрываем оверлей
                generateItems(mode, language, difficulty); // Начинаем генерировать падающие элементы
                gameInterval = setInterval(updateStats, 100); // Запускаем интервал для обновления статистики
                keySpawnInterval = setInterval(() => generateItems(mode, language, difficulty), getItemSpawnRate(difficulty)); // Запускаем интервал для генерации новых элементов
            }
        }, 1000); // Интервал обратного отсчета - 1 секунда
    };

    startButton.addEventListener('click', startGame);

    closeButton.addEventListener('click', () => {
        resultContainer.style.display = 'none';
        startButton.disabled = false;
        gameStarted = false;
        clearInterval(gameInterval);
        clearInterval(keySpawnInterval);
        fallingItemsContainer.innerHTML = '';
        currentItems = [];
    });

    document.querySelector('.close-modal').addEventListener('click', () => {
        resultContainer.style.display = 'none';
    });
    modeSelect.addEventListener('change', (event) => {
        userInputTextarea.style.display = event.target.value === 'text' ? 'block' : 'none';
    });

    document.addEventListener('keydown', (event) => {
        if (!gameStarted) return;

        const pressedKey = event.key.toLowerCase();
        const currentItem = currentItems.find(item => item.textContent.startsWith(pressedKey));

        if (currentItem) {
            const itemText = currentItem.textContent;

            if (pressedKey === itemText[0]) {
                currentItem.textContent = itemText.substring(1);
                correctChars++;
                totalChars++;

                if (currentItem.textContent === "") {
                    currentItem.remove();
                    currentItems = currentItems.filter(i => i !== currentItem);
                    score++;
                    typedWords++;
                    updateScore();
                    updateStats();
                }
            } else {
                totalChars++;
                updateStats();
            }
        }
    });
});
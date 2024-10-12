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
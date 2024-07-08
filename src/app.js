const API_URL = 'https://the-trivia-api.com/v2/questions';
let categories = [];
let questions = [];
let currentQuestionIndex = 0;
let playerScores = [0, 0];
let currentPlayer = 0;
let selectedCategoryId = null;

async function startGame() {
    const player1 = document.getElementById('player1').value;
    const player2 = document.getElementById('player2').value;
    if (!player1 || !player2) {
        alert('Please enter names for both players.');
        return;
    }
    document.getElementById('setup').style.display = 'none';
    document.getElementById('category-selection').style.display = 'block';
    
    try {
        const response = await fetch('https://the-trivia-api.com/api/categories');
        const data = await response.json();

        categories = Object.keys(data);
        console.log(categories);

        console.log(data);
        const categoriesSelect = document.getElementById('categories');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = categories;
            option.textContent = category;
            categoriesSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Failed to load categories. Please try again later.');
    }
}

async function selectCategory() {
    const categoriesSelect = document.getElementById('categories');
    selectedCategoryId = categoriesSelect.value;
    console.log(typeof(selectedCategoryId));
    if (selectedCategoryId == "none") {
        alert('Please select a category.');
        return;
    }
    const response = await fetch(`${API_URL}?limit=6&categories=${selectedCategoryId}`);
    const data = await response.json();
    questions = data;
    
    document.getElementById('category-selection').style.display = 'none';
    document.getElementById('question-area').style.display = 'block';
    
    showQuestion();
}

function showQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question-text').textContent = question.question.text;
    
    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';
    const answers = [...question.incorrectAnswers, question.correctAnswer];
    answers.sort(() => Math.random() - 0.5);
    
    answers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.onclick = () => checkAnswer(answer);
        answersDiv.appendChild(button);
    });
}

function checkAnswer(selectedAnswer) {
    const question = questions[currentQuestionIndex];
    if (selectedAnswer === question.correctAnswer) {
        if (question.difficulty === 'easy') playerScores[currentPlayer] += 10;
        if (question.difficulty === 'medium') playerScores[currentPlayer] += 15;
        if (question.difficulty === 'hard') playerScores[currentPlayer] += 20;
    }
    
    currentPlayer = currentPlayer === 0 ? 1 : 0;
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endRound();
    }
}

function endRound() {
    document.getElementById('question-area').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    
    const resultText = `Scores: Player 1: ${playerScores[0]}, Player 2: ${playerScores[1]}`;
    document.getElementById('result-text').textContent = resultText;
}

function playAgain() {
    currentQuestionIndex = 0;
    playerScores = [0, 0];
    currentPlayer = 0;
    
    document.getElementById('results').style.display = 'none';
    document.getElementById('category-selection').style.display = 'block';
}

function endGame() {
    const resultText = playerScores[0] === playerScores[1] ? 'It\'s a tie!' : playerScores[0] > playerScores[1] ? 'Player 1 wins!' : 'Player 2 wins!';
    alert(resultText);
    window.location.reload();
}

// DOM elements and Vars
const startCard = document.getElementById("start-card");
const quizCard = document.getElementById("quiz-card");
const resultCard = document.getElementById("result-card");
const startBtn = document.getElementById("start-btn");
const scoreDisplay = document.getElementById("score");
const question = document.getElementById("question");
const options = document.getElementById("options");
const currentQuestionNum = document.getElementById("current-question-num");
const totalQuestionNum = document.getElementById("total-question-num");
const finalScore = document.getElementById("final-score");
const resultMessage = document.getElementById("result-message");
const restartBtn = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress-bar");
const timerDisplay = document.getElementById("timer-display");
let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
let countdown;

// Fetch data from the JSON file
async function loadQuizData() {
  try {
    const response = await fetch(`questions.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    quizData = await response.json();
    displayQuestion();
  } catch (error) {
    console.error("Could not fetch quiz questions:", error);
    quizCard.innerHTML = "<p>Failed to load questions.</p>";
  }
}

function displayQuestion() {
  options.innerHTML = "";
  startCountdown();

  if (currentQuestionIndex >= quizData.length) {
    displayResults();
    return;
  }

  const currentQuiz = quizData[currentQuestionIndex];
  question.textContent = currentQuiz.question;
  currentQuestionNum.textContent = currentQuestionIndex + 1;
  totalQuestionNum.textContent = quizData.length;
  scoreDisplay.textContent = score;

  // Create option buttons
  currentQuiz.options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.className = "option-btn";
    button.addEventListener("click", (e) => {
      checkAnswer(e.target);
      stopCountdown();
    });
    options.appendChild(button);
  });

  // Update progress bar
  const progressPercentage =
    ((currentQuestionIndex + 1) / quizData.length) * 100;
  progressBar.style.width = `${progressPercentage}%`;
}

function startCountdown() {
  let timeLeft = 10;

  clearInterval(countdown);
  timerDisplay.textContent = timeLeft;

  countdown = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      forceNextQuestion();
    }
  }, 1000);
}

function stopCountdown() {
  clearInterval(countdown);
}

function forceNextQuestion() {
  const currentQuiz = quizData[currentQuestionIndex];

  document.querySelectorAll(".option-btn").forEach((button) => {
    button.disabled = true;
  });

  document.querySelectorAll(".option-btn").forEach((button) => {
    if (button.textContent === currentQuiz.correctAnswer) {
      button.classList.add("correct-answer");
    }
  });

  setTimeout(() => {
    currentQuestionIndex++;
    displayQuestion();
  }, 1000);
}

function checkAnswer(selectedBtn) {
  const currentQuiz = quizData[currentQuestionIndex];

  if (selectedBtn.textContent === currentQuiz.correctAnswer) {
    score++;
    selectedBtn.classList.add("correct-answer");
  } else {
    selectedBtn.classList.add("wrong-answer");
    document.querySelectorAll(".option-btn").forEach((button) => {
      if (button.textContent === currentQuiz.correctAnswer) {
        button.classList.add("correct-answer");
      }
    });
  }

  // For preventing multiple clicks
  document.querySelectorAll(".option-btn").forEach((button) => {
    button.disabled = true;
  });

  setTimeout(() => {
    currentQuestionIndex++;
    displayQuestion();
  }, 1000);
}

function displayResults() {
  quizCard.classList.add("display-none");
  resultCard.classList.remove("display-none");
  finalScore.textContent = score;

  const grade = (score / quizData.length) * 100;

  switch (true) {
    case grade === 100:
      resultMessage.textContent = "Excellent! Perfect score!";
      break;
    case grade >= 70:
      resultMessage.textContent = "Good job! You passed!";
      break;
    default:
      resultMessage.textContent = "It's okay, Better luck next time!";
  }
}

startBtn.addEventListener("click", () => {
  startCard.classList.add("display-none");
  quizCard.classList.remove("display-none");
  loadQuizData();
});

restartBtn.addEventListener("click", () => {
  currentQuestionIndex = 0;
  score = 0;

  resultCard.classList.add("display-none");
  quizCard.classList.remove("display-none");
  displayQuestion();
});

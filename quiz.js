// quiz.js

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
const answerButtons = document.getElementById("answer-buttons");
const questionText = document.getElementById("question-text");
const questionNumber = document.getElementById("question-number");
const nextButton = document.getElementById("next-btn");

async function fetchQuestions() {
  try {
    const res = await fetch("get-questions.php");
    const data = await res.json();
    questions = data;
    showQuestion();
  } catch (error) {
    questionText.textContent = "Failed to load questions.";
  }
}

function showQuestion() {
  resetState();
  const q = questions[currentQuestionIndex];
  questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  questionText.textContent = q.question;

  q.choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.className =
      "bg-gradient-to-r from-[#2F3A46] to-[#DBB347] text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-gradient-to-l border-2 border-transparent hover:border-[#EC8305] focus:outline-none focus:border-[#EC8305] focus:shadow-[0_0_10px_rgba(236,131,5,0.5)]";
    btn.addEventListener("click", () => selectAnswer(choice === q.answer, choice));
    answerButtons.appendChild(btn);
  });
}

function resetState() {
  nextButton.classList.add("hidden");
  answerButtons.innerHTML = "";
}

function selectAnswer(correct, selected) {
  if (correct) score++;
  saveResponse(selected, correct);
  nextButton.classList.remove("hidden");
  Array.from(answerButtons.children).forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === selected) {
      btn.classList.add(correct ? "bg-green-500" : "bg-red-500");
    }
  });
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    finishQuiz();
  }
});

function finishQuiz() {
  questionText.textContent = `You scored ${score} out of ${questions.length}`;
  questionNumber.textContent = "Quiz Complete!";
  answerButtons.innerHTML = "";
  nextButton.classList.add("hidden");
}

function saveResponse(answer, correct) {
  const q = questions[currentQuestionIndex];
  fetch("submit-response.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      questionId: q._id,
      answer: answer,
      correct: correct,
      timestamp: new Date().toISOString(),
    }),
  });
}

window.onload = fetchQuestions;

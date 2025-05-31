
    // Sample quiz data (replace with your PHP fetch)
    const sampleQuestions = [
      {
        _id: 1,
        question: "What is 15 + 27?",
        choices: ["32", "42", "52", "38"],
        answer: "42"
      },
      {
        _id: 2,
        question: "What is 8 × 7?",
        choices: ["54", "56", "64", "48"],
        answer: "56"
      },
      {
        _id: 3,
        question: "What is 144 ÷ 12?",
        choices: ["11", "12", "13", "14"],
        answer: "12"
      },
      {
        _id: 4,
        question: "What is 25% of 80?",
        choices: ["15", "20", "25", "30"],
        answer: "20"
      },
      {
        _id: 5,
        question: "What is 9²?",
        choices: ["72", "81", "90", "99"],
        answer: "81"
      }
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];
    let answered = false;
    const answerButtons = document.getElementById("answer-buttons");
    const questionText = document.getElementById("question-text");
    const questionNumber = document.getElementById("question-number");
    const nextButton = document.getElementById("next-btn");
    const scoreElement = document.getElementById("score");
    const totalQuestionsElement = document.getElementById("total-questions");
    const progressBar = document.getElementById("progress-bar");

    async function fetchQuestions() {
      try {
        // Try to fetch from PHP endpoint first
        // const res = await fetch("get-questions.php");
        // const data = await res.json();
        // questions = data;
        
        // Fallback to sample data for demo
        questions = sampleQuestions;
        totalQuestionsElement.textContent = questions.length;
        showQuestion();
      } catch (error) {
        // Use sample data if PHP endpoint fails
        questions = sampleQuestions;
        totalQuestionsElement.textContent = questions.length;
        showQuestion();
      }
    }

    function showQuestion() {
      resetState();
      const q = questions[currentQuestionIndex];
      
      // Update question display
      questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
      questionText.textContent = q.question;
      
      // Update progress bar
      const progress = ((currentQuestionIndex) / questions.length) * 100;
      progressBar.style.width = `${progress}%`;

      // Create answer buttons
      q.choices.forEach((choice, index) => {
        const btn = document.createElement("button");
        btn.textContent = choice;
        btn.className = "bg-gradient-to-r from-[#2F3A46] to-[#DBB347] text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-gradient-to-l border-2 border-transparent hover:border-[#EC8305] focus:outline-none focus:border-[#EC8305] focus:shadow-[0_0_10px_rgba(236,131,5,0.5)]";
        btn.addEventListener("click", () => selectAnswer(choice === q.answer, choice, btn));
        answerButtons.appendChild(btn);
      });
    }

    function resetState() {
      nextButton.classList.add("hidden");
      answerButtons.innerHTML = "";
      answered = false;
    }

    function selectAnswer(correct, selected, clickedBtn) {
      if (answered) return; // Prevent multiple clicks
      answered = true;

      const q = questions[currentQuestionIndex];
      
      // Update score
      if (correct) {
        score++;
        scoreElement.textContent = score;
      }

      // Style all buttons to show correct/incorrect
      Array.from(answerButtons.children).forEach((btn) => {
        btn.disabled = true;
        btn.style.cursor = "default";
        
        if (btn.textContent === q.answer) {
          // Highlight the correct answer in green
          btn.classList.add("answer-correct-highlight");
        } else if (btn === clickedBtn && !correct) {
          // Highlight the wrong answer clicked in red
          btn.classList.add("answer-wrong");
        } else if (btn !== clickedBtn) {
          // Dim other options
          btn.style.opacity = "0.6";
        }
      });

      // Save response (if PHP endpoint exists)
      saveResponse(selected, correct);

      // Auto-proceed to next question after 2 seconds
      setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
          showQuestion();
        } else {
          finishQuiz();
        }
      }, 2000);
    }

    function finishQuiz() {
      // Update progress bar to 100%
      progressBar.style.width = "100%";
      
      // Calculate percentage
      const percentage = Math.round((score / questions.length) * 100);
      
      // Show final results
      questionText.innerHTML = `
        <div class="text-center">
          <div class="text-4xl mb-4">🎉</div>
          <div class="text-2xl mb-2">Quiz Complete!</div>
          <div class="text-xl">You scored ${score} out of ${questions.length}</div>
          <div class="text-lg text-[#EC8305] font-bold">${percentage}% Correct</div>
        </div>
      `;
      questionNumber.textContent = getScoreMessage(percentage);
      answerButtons.innerHTML = `
        <div class="col-span-2 space-y-4">
          <button onclick="restartQuiz()" class="w-full bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
            Take Quiz Again
          </button>
          <button onclick="goHome()" class="w-full bg-gradient-to-r from-[#024CAA] to-[#091057] text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
            Back to Home
          </button>
        </div>
      `;
      nextButton.classList.add("hidden");
    }

    function getScoreMessage(percentage) {
      if (percentage >= 90) return "Excellent! 🌟";
      if (percentage >= 80) return "Great Job! 👏";
      if (percentage >= 70) return "Good Work! 👍";
      if (percentage >= 60) return "Not Bad! 🙂";
      return "Keep Practicing! 📚";
    }

    function saveResponse(answer, correct) {
      const q = questions[currentQuestionIndex];
      // Only attempt to save if PHP endpoint exists
      try {
        fetch("submit-response.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionId: q._id,
            answer: answer,
            correct: correct,
            timestamp: new Date().toISOString(),
          }),
        }).catch(() => {
          // Silently handle if PHP endpoint doesn't exist
        });
      } catch (error) {
        // Continue without saving if no backend
      }
    }

    function restartQuiz() {
      currentQuestionIndex = 0;
      score = 0;
      scoreElement.textContent = "0";
      showQuestion();
    }

    function goHome() {
      // Replace with actual home page URL
      window.location.href = "index.html";
    }

    function cancelQuiz() {
      if (confirm("Are you sure you want to cancel the quiz?")) {
        goHome();
      }
    }

    // Initialize timer (placeholder)
    function updateTimer() {
      // Add timer logic here if needed
      document.getElementById("timer").textContent = "∞";
    }

    // Start the quiz
    window.onload = () => {
      fetchQuestions();
      updateTimer();
    };
  
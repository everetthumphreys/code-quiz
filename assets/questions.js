//DOM elements
const start = document.getElementById("startButton");
const quiz = document.getElementById("quiz");
const quizTimer = document.getElementById("quizTimer");
const questionText = document.getElementById("questionText");
const qImg = document.getElementById("questionImage");
const choices = document.getElementById("choices");
const counter = document.getElementById("counter");
const timeGauge = document.getElementById("timeGauge");
const progress = document.getElementById("progress");
const scoreDiv = document.getElementById("scoreContainer");
const scoreNumber = document.getElementById("scoreNumber");
const initialsInput = document.getElementById("initialsInput");
const scoreValue = document.getElementById("scoreValue");
const highScores = document.getElementById("highScores");
const scoreEntry = document.getElementById("scoreEntry");
const leaderboard = document.getElementById("leaderboardButton");

//Array containing my questions and data
let questions = [{
		questionText: "Commonly used data types DO NOT include:",
		choices: ["alerts", "strings", "numbers"],
		correctIndex: 0,
		imgSrc: "assets/js.png"
	},
	{
		questionText: "The condition in an if / else statement is enclosed within ____.",
		choices: ["quotes", "parentheses", "curly brackets"],
		correctIndex: 1,
		imgSrc: "assets/js.png"
	},
	{
		questionText: "Javascript and Java are basically the same?",
		choices: ["True", "False", "Maybe?"],
		correctIndex: 1,
		imgSrc: "assets/js.png"
	},
    {
        questionText: "Which HTML tag is used to define an internal style sheet?",
        choices: ["&#60;style&#62;", "&#60;script&#62;", "&#60;css&#62;"],
        correctIndex: 0,
        imgSrc: "assets/css.png"
    },
    {
        questionText: "Which element has the largest heading?",
        choices: ["&#60;H1&#62;", "&#60;head&#62", "&#60;h6&#62"],
        correctIndex: 1,
        imgSrc: "assets/html.png"
    }
];

const lastQuestionIndex = questions.length - 1;
let currentQuestionIndex = 0;
let questionTimeCounter = 10;
let quizTimeCounter = 75;
let correctAnswerCount = 0;
const counterWidth = 150; // 150px
const counterIncrement = counterWidth / questionTimeCounter;
let TIMER;
let score = 0;

// render a question
function renderQuestion() {
	questionText.innerHTML = "";
	qImg.innerHTML = "";
	choices.innerHTML = "";
	questionTimeCounter = 10;
	let q = questions[currentQuestionIndex];
	let text = document.createElement("p");
	text.innerHTML = q.questionText;
	questionText.appendChild(text);
	const questionImage = document.createElement("img");
	questionImage.src = q.imgSrc;
	qImg.appendChild(questionImage);

	q.choices.forEach(function (choice, index) {
		let questionChoice = document.createElement("button");
		questionChoice.className = "btn btn-info choice";
		questionChoice.onclick = function (e) {
			checkAnswer(e);
		};
		questionChoice.value = index;
		questionChoice.id = choice + "-" + index;
		questionChoice.innerHTML = choice;
		choices.appendChild(questionChoice);
	})
}

start.addEventListener("click", startQuiz);
leaderboard.addEventListener("click", renderLeaderboard);

function renderLeaderboard() {
	scoreDiv.style.display = "block";
	renderHighScores(false);
}

// start quiz
function startQuiz() {
	start.style.display = "none";
	leaderboardButton.style.display = "none";
	scoreDiv.style.display = "none";
	renderQuestion();
	quiz.style.display = "block";
	renderProgress();
	renderTimers();
	TIMER = setInterval(renderTimers, 1000); // 1000ms = 1s
}

function renderTimers() {
	renderQuizTimer();
	renderQuestionTimer();
}

// render progress
function renderProgress() {
	for (let qIndex = 0; qIndex <= lastQuestionIndex; qIndex++) {
		let progressIndicator = document.createElement("div");
		progressIndicator.className = "prog";
		progressIndicator.id = "progressIndicator-" + qIndex;
		progress.appendChild(progressIndicator);
	}
}

function renderQuizTimer() {
	if (quizTimeCounter > 0) {
		quizTimer.innerHTML = quizTimeCounter;
		quizTimeCounter--
	} else {
		// TODO: Implement End Game
	}
}

// render counter

function renderQuestionTimer() {
	if (questionTimeCounter > 0) {
		counter.innerHTML = questionTimeCounter;
		timeGauge.style.width = questionTimeCounter * counterIncrement + "px";
		questionTimeCounter--
	} else {
		// change progress color to red
		setAnswerIncorrect();
		if (currentQuestionIndex < lastQuestionIndex) {
			currentQuestionIndex++;
			renderQuestion();
		} else {
			// end the quiz and show the score
			clearInterval(TIMER);
			scoreRender();
		}
	}
}

// checkAnwer

function checkAnswer(answer) {
	const selectedAnswerIndex = parseInt(answer.target.value);
	if (selectedAnswerIndex === questions[currentQuestionIndex].correctIndex) {
		setAnswerCorrect();
	} else {
		setAnswerIncorrect();
	}

	if (currentQuestionIndex < lastQuestionIndex) {
		currentQuestionIndex++;
		renderQuestion();
	} else {
		// end the quiz and show the score
		clearInterval(TIMER);
		scoreRender();
	}
}

function setAnswerCorrect() {
	// increment score
	score++
	correctAnswerCount++;
	// set indicator to green
	setAnswerIndicatorColor("#77dd77");
	// add 10 seconds to timer
	updateTimer(10);
}

function setAnswerIncorrect() {
	// set indicator to red
	setAnswerIndicatorColor("#ff6961");
	// subtract 10 seconds to timer
	updateTimer(-10);
}

// answer is correct
function setAnswerIndicatorColor(color) {
	const answerIndicatorId = "progressIndicator-" + currentQuestionIndex;
	document.getElementById(answerIndicatorId).style.backgroundColor = color;
}

function updateTimer(seconds) {
	quizTimeCounter += seconds;
	renderQuizTimer();
}

// score render
function scoreRender() {
	quiz.style.display = "none";
	scoreDiv.style.display = "block";

	// calculate the amount of question percent answered by the user
	const score = correctAnswerCount * quizTimeCounter;

	scoreNumber.innerHTML = score;
	scoreValue.value = score;
	renderHighScores(true);
}

function saveInitials() {
	const highScoresList = localStorage.getItem("highScores");
	parsedHighScores = highScoresList ? JSON.parse(localStorage.getItem("highScores")) : [];

	let newHighScore = {
		initials: initialsInput.value,
		score: scoreValue.value
	};
	parsedHighScores.push(newHighScore);

	localStorage.setItem("highScores", JSON.stringify(parsedHighScores));
	renderHighScores(false);
}

function renderHighScores(displayInitialInput) {
	scoreEntry.style.display = displayInitialInput ? "block" : "none";
	const highScoresList = localStorage.getItem("highScores");
	parsedHighScores = highScoresList ? JSON.parse(localStorage.getItem("highScores")) : [];

	highScores.innerHTML = "";

	parsedHighScores.forEach(function (scoreItem) {
		let listItem = document.createElement("li");
		listItem.innerHTML = scoreItem.initials + " - " + scoreItem.score;
		highScores.appendChild(listItem);
	})
}
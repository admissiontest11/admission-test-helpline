let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 1800;
let questionData = [];

async function initQuiz() {
    const urlParams = new URLSearchParams(window.location.search);
    const file = urlParams.get('file');
    const subject = urlParams.get('subject');
    const className = urlParams.get('class') || 'ssc';
    
    if (file) {
        // JSON ফাইল থেকে প্রশ্ন লোড করুন
        const data = await loadQuestionsFromJSON(file, className);
        if (data && data.chapters) {
            // সব অধ্যায়ের প্রশ্ন একত্রিত করুন
            data.chapters.forEach(chapter => {
                currentQuestions = currentQuestions.concat(chapter.questions);
            });
        }
    } else {
        // ডিফল্ট ডেমো প্রশ্ন
        currentQuestions = getDemoQuestions().chapters[0].questions;
    }
    
    document.getElementById('total-q').textContent = currentQuestions.length;
    startTimer();
    loadQuestion();
}

function loadQuestion() {
    if (currentIndex >= currentQuestions.length) {
        endQuiz();
        return;
    }
    
    const q = currentQuestions[currentIndex];
    document.getElementById('question-text').textContent = q.question;
    document.getElementById('current-q').textContent = currentIndex + 1;
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = q.options.map((opt, index) => `
        <div class="option" onclick="checkAnswer(${index})">
            ${String.fromCharCode(65 + index)}. ${opt}
        </div>
    `).join('');
}

function checkAnswer(selectedIndex) {
    const q = currentQuestions[currentIndex];
    const options = document.querySelectorAll('.option');
    
    options.forEach(opt => opt.style.pointerEvents = 'none');
    options[q.correct].classList.add('correct');
    
    if (selectedIndex === q.correct) {
        score += 4;
        userProgress.correct++;
    } else {
        options[selectedIndex].classList.add('wrong');
        score -= 1;
    }
    
    document.getElementById('score').textContent = score;
    
    setTimeout(() => {
        currentIndex++;
        if (currentIndex < currentQuestions.length) {
            loadQuestion();
        } else {
            endQuiz();
        }
    }, 1500);
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timer').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            endQuiz();
        }
    }, 1000);
}

function endQuiz() {
    clearInterval(timer);
    
    userProgress.solved += currentQuestions.length;
    userProgress.tests++;
    saveUserData();
    
    alert(`✅ কুইজ শেষ!\n\n📊 আপনার স্কোর: ${score}\n✅ সঠিক উত্তর: ${userProgress.correct}\n📝 মোট প্রশ্ন: ${currentQuestions.length}`);
    window.location.href = 'dashboard.html';
}

document.addEventListener('DOMContentLoaded', initQuiz);
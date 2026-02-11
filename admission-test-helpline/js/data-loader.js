let userProgress = {
    solved: 0,
    tests: 0,
    correct: 0
};

// ইউজার ডাটা লোড
function loadUserData() {
    const saved = localStorage.getItem('admissionTestHelpline');
    if (saved) {
        userProgress = JSON.parse(saved);
        updateDashboard();
    }
}

// ইউজার ডাটা সেভ
function saveUserData() {
    localStorage.setItem('admissionTestHelpline', JSON.stringify(userProgress));
}

// ড্যাশবোর্ড আপডেট
function updateDashboard() {
    if(document.getElementById('solved-count')) {
        document.getElementById('solved-count').textContent = userProgress.solved || 0;
        document.getElementById('test-count').textContent = userProgress.tests || 0;
        document.getElementById('correct-count').textContent = userProgress.correct || 0;
    }
}

// JSON ফাইল লোড করার ফাংশন (ইম্প্রুভড)
async function loadQuestionsFromJSON(fileName, className) {
    try {
        // ফাইল পাথ ঠিক করছি
        const filePath = `data/${className}/${fileName}`;
        console.log('লোড করার চেষ্টা করছি:', filePath);
        
        const response = await fetch(filePath);
        
        if (!response.ok) {
            throw new Error(`ফাইল পাওয়া যায়নি: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('JSON সফলভাবে লোড হয়েছে:', data);
        
        // সব প্রশ্ন একত্রিত করি
        let allQuestions = [];
        if (data.chapters && Array.isArray(data.chapters)) {
            data.chapters.forEach(chapter => {
                if (chapter.questions && Array.isArray(chapter.questions)) {
                    allQuestions = allQuestions.concat(chapter.questions);
                }
            });
        }
        
        return allQuestions;
        
    } catch (error) {
        console.error('JSON লোড করতে সমস্যা:', error);
        
        // এরর মেসেজ দেখাই
        alert(`"${fileName}" ফাইলটি পাওয়া যায়নি!\n\nপাথ চেক করুন: data/${className}/${fileName}\n\nফাইলটি সঠিক জায়গায় আছে কিনা দেখুন।`);
        
        // ডেমো প্রশ্ন দেখাই
        return getDemoQuestions();
    }
}

// ডেমো প্রশ্ন
function getDemoQuestions() {
    return [
        {
            question: "ডেমো প্রশ্ন: আপনার JSON ফাইল লোড হয়নি",
            options: [
                "data/ssc/ ফোল্ডার চেক করুন",
                "ফাইলের নাম bangla.json কিনা দেখুন",
                "JSON ফরম্যাট ঠিক আছে কিনা দেখুন",
                "সবগুলো ঠিক আছে"
            ],
            correct: 3
        }
    ];
}

// সাবজেক্ট শুরু
function startSubject(fileName, className) {
    window.location.href = `self-exam.html?file=${fileName}&class=${className}`;
}

document.addEventListener('DOMContentLoaded', loadUserData);
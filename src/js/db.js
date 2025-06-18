
// db.js agora só trabalha com localStorage

function getAllFlashcards() {
    return JSON.parse(localStorage.getItem('flashcards')) || [];
}

function getAllQuestions() {
    return JSON.parse(localStorage.getItem('questions')) || [];
}

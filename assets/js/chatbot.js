var chatbotToggle = document.getElementById('chatbot-toggle');
var chatbotContainer = document.getElementById('chatbot-container');

chatbotToggle.addEventListener('click', function() {
    chatbotContainer.classList.toggle('visible');
});

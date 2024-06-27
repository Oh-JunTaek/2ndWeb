var chatbotToggle = document.getElementById('chatbot-toggle');
var chatbotContainer = document.getElementById('chatbot-container');

chatbotToggle.addEventListener('click', function() {
    chatbotContainer.classList.toggle('visible');
});
// 1. 입력 필드와 전송 버튼 요소 선택
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSendButton = document.getElementById('chatbot-send');
const chatbotMessages = document.getElementById('chatbot-messages');

// 2. 전송 버튼에 클릭 이벤트 리스너 등록
chatbotSendButton.addEventListener('click', sendMessage);

// 3. 이벤트 리스너 함수
function sendMessage() {
    const userMessage = chatbotInput.value.trim();
    if (userMessage) {
        // 4. 챗봇의 응답 생성 및 화면 표시
        addMessageToChat(userMessage, 'user-message');
        const chatbotResponse = generateChatbotResponse(userMessage);
        addMessageToChat(chatbotResponse, 'chatbot-message');

        // 5. 입력 필드 초기화
        chatbotInput.value = '';
    } else {
        // 첫 출력 메시지 표시
        displayInitialMessage();
    }
}

function addMessageToChat(message, messageClass) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('chatbot-message', messageClass);
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function generateChatbotResponse(userMessage) {
    // 여기에 챗봇의 응답 생성 로직 구현
    return "챗봇의 응답";
}

function appendChatbotMessage(message) {
    var messageContainer = document.createElement('div');
    messageContainer.classList.add('chatbot-message-container');

    // var icon = document.createElement('img');
    // icon.src = 'bot.png';
    // icon.alt = 'Chatbot Icon';
    // icon.classList.add('chatbot-icon');

    var messageElement = document.createElement('div');
    messageElement.classList.add('chatbot-message');
    messageElement.textContent = message;

    // messageContainer.appendChild(icon);
    messageContainer.appendChild(messageElement);

    var chatbotMessages = document.getElementById('chatbot-messages');
    chatbotMessages.appendChild(messageContainer);
}

function displayInitialMessage() {
    const initialMessage = "Hello, I'm the EunmaBot. How can I assist you?";
    addMessageToChat(initialMessage, 'chatbot-message');
}



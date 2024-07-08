// 1. 채팅 창 토글 버튼과 컨테이너 요소 선택
var chatbotToggle = document.getElementById('chatbot-toggle');
var chatbotContainer = document.getElementById('chatbot-container');

// 2. 토글 버튼 클릭 이벤트 리스너 등록
chatbotToggle.addEventListener('click', function() {
    chatbotContainer.classList.toggle('visible');
});

// 3. 입력 필드와 전송 버튼, 메시지 컨테이너 요소 선택
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSendButton = document.getElementById('chatbot-send');
const chatbotMessages = document.getElementById('chatbot-messages');

// 4. 전송 버튼에 클릭 이벤트 리스너 등록
chatbotSendButton.addEventListener('click', sendMessage);

// 5. 메시지 전송 함수
async function sendMessage() {
    const userMessage = chatbotInput.value.trim();
    if (userMessage) {
        // 사용자 메시지 화면에 표시
        addMessageToChat(userMessage, 'user-message');

        // 챗봇 응답 생성 및 화면에 표시
        const chatbotResponse = await generateChatbotResponse(userMessage);
        addMessageToChat(chatbotResponse, 'chatbot-message');

        // 입력 필드 초기화
        chatbotInput.value = '';
    }
}

// 6. 메시지 화면 추가 함수
function addMessageToChat(message, messageClass) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('chatbot-message', messageClass);
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// 7. 챗봇 응답 생성 함수 (OpenAI API 호출)
async function generateChatbotResponse(userMessage) {
    const operatorInfo = `
    You are chatting with EunmaBot, created by Eunma.
    - MBTI: INFP
    - 좋아하는 음식: 스시
    - 취미: 독서와 등산
    `;

    try {
        const response = await fetch('https://api.openai.com/v1/engines/gpt-3.5-turbo/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer YOUR_API_KEY`
            },
            body: JSON.stringify({
                prompt: operatorInfo + `\nUser: ${userMessage}\nChatbot:`,
                max_tokens: 150
            })
        });
        
        const data = await response.json();
        return data.choices[0].text.trim();
    } catch (error) {
        console.error('Error generating chatbot response:', error);
        return "Sorry, I couldn't process your request.";
    }
}

// 8. 초기 메시지 출력 함수
function displayInitialMessage() {
    const initialMessage = "Hello, I'm the EunmaBot. How can I assist you?";
    addMessageToChat(initialMessage, 'chatbot-message');
}

// 페이지 로드 시 초기 메시지 출력
document.addEventListener('DOMContentLoaded', displayInitialMessage);
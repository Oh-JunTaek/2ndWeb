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

// 4. Enter 키 입력 처리
chatbotInput.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// 5. 전송 버튼에 클릭 이벤트 리스너 등록
chatbotSendButton.addEventListener('click', sendMessage);

// 6. 메시지 전송 함수
async function sendMessage() {
    const userMessage = chatbotInput.value.trim();
    if (userMessage) {
        // 사용자 메시지 화면에 표시
        addMessageToChat(userMessage, 'user');

        // 응답 대기 상태 표시
        const loadingIndicator = addLoadingIndicator();

        // 챗봇 응답 생성 및 화면에 표시
        try {
            const chatbotResponse = await generateChatbotResponse(userMessage);
            chatbotMessages.removeChild(loadingIndicator); // 로딩 메시지 제거
            addMessageToChat(chatbotResponse, 'bot'); // 챗봇 응답 추가
        } catch (error) {
            chatbotMessages.removeChild(loadingIndicator); // 로딩 메시지 제거
            addMessageToChat("Error occurred.", 'bot'); // 오류 처리 메시지 추가
        }

        // 입력 필드 초기화
        chatbotInput.value = '';
    }
}

// 7. 메시지 화면에 추가 함수
function addMessageToChat(message, sender) {
    const messageElement = document.createElement('div');
    
    // 메시지 추가 시, 봇과 사용자 구분
    if (sender === 'user') {
        messageElement.classList.add('chatbot-message', 'user-message');
    } else {
        messageElement.classList.add('chatbot-message', 'bot-message');
        
        // 봇 메시지에는 로고 이미지 추가
        const logoImg = document.createElement('img');
        logoImg.src = 'images/logo.png'; 
        logoImg.alt = 'EunmaStudio Logo';
        messageElement.appendChild(logoImg);
    }
    
    // 텍스트 요소 추가
    const textElement = document.createElement('span');
    textElement.textContent = message;
    messageElement.appendChild(textElement);

    // 메시지 추가 및 스크롤 처리
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// 8. 로딩 상태 표시 함수
function addLoadingIndicator() {
    const loadingElement = document.createElement('div');
    loadingElement.classList.add('chatbot-message', 'loading-indicator');
    loadingElement.textContent = '챗봇이 응답 중입니다...';
    chatbotMessages.appendChild(loadingElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return loadingElement;
}

// 9. 챗봇 응답 생성 함수 (로컬 서버 호출)
async function generateChatbotResponse(userMessage) {
    try {
        const response = await fetch('/api/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();
        return data.reply;
    } catch (error) {
        console.error('Error generating chatbot response:', error);
        return "Error occurred.";
    }
}

// 10. 초기 메시지 출력 함수
function displayInitialMessage() {
    const initialMessage = "안녕하세요! Eunma입니다. 만나서 반가워요. 저에게 궁금한 것을 물어보세요!";
    addMessageToChat(initialMessage, 'bot');
}

// 페이지 로드 시 초기 메시지 출력
document.addEventListener('DOMContentLoaded', displayInitialMessage);

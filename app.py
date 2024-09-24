from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
import asyncio
from langchain.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from llama_cpp import Llama
import os
import requests

app = FastAPI()

# 우선순위 경로 설정
file_paths = [
    "/Users/eunma/Documents/GitHub/2ndWeb/data/eunma_info.md",  # 맥북 로컬 경로
    "C:\\Users\\eunma\\Documents\\data\\eunma_info.md",  # 윈도우 로컬 경로 (추가해야 함)
    "https://raw.githubusercontent.com/Oh-JunTaek/2ndWeb/main/data/eunma_info.md"  # GitHub 경로
]

# Llama 모델 경로 설정
model_path = "/Users/eunma/.ollama/models/manifests/registry.ollama.ai/library/llama3.1"

# Llama 모델 초기화
llm = Llama(model_path=model_path)

# .md 파일을 불러오는 함수 (로컬과 GitHub 지원)
def load_documents():
    for path in file_paths:
        if os.path.exists(path):
            # 로컬 경로에서 데이터 읽기
            with open(path, 'r', encoding='utf-8') as file:
                return file.read()
        elif path.startswith("http"):
            # GitHub에서 데이터 읽기
            response = requests.get(path)
            if response.status_code == 200:
                return response.text
    raise FileNotFoundError("Data not found in any specified paths.")

# 벡터 스토어 생성 함수
def create_faiss_vectorstore(data):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    texts = text_splitter.split_text(data)
    embeddings = OpenAIEmbeddings()
    vector_store = FAISS.from_texts(texts, embeddings)
    return vector_store

# RAG 시스템 설정
def setup_qa():
    data = load_documents()  # 데이터 로드
    vector_store = create_faiss_vectorstore(data)
    qa_chain = RetrievalQA.from_chain_type(llm, retriever=vector_store.as_retriever())
    return qa_chain

# 사용자 요청을 처리하는 엔드포인트
@app.post("/chat/")
async def chat(request: Request):
    data = await request.json()
    user_message = data.get("message", "")
    
    qa_chain = setup_qa()  # RAG 시스템 준비
    response = qa_chain.run(user_message)

    # 비동기적으로 응답을 스트리밍으로 반환
    async def generate_response():
        for chunk in response.split():
            yield chunk + " "
            await asyncio.sleep(0.1)  # 텍스트를 부분적으로 스트리밍
    
    return StreamingResponse(generate_response(), media_type="text/plain")

# 서버 실행
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)

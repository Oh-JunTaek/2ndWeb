from langchain.llms import LlamaCpp
from langchain.chains import RetrievalQA
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
from langchain.retrievers import LLMChainRetriever

# Llama 모델 경로 설정 (모델을 설치한 경로)
model_path = "/Users/eunma/.ollama/models/manifests/registry.ollama.ai/library/llama3.1" # mac

# Llama 모델 로드
llm = LlamaCpp(model_path=model_path, temperature=0.7)

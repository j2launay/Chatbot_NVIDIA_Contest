import json
import logging
import vertexai
import os
from os import listdir
from os.path import isfile, join
import docx
import pandas as pd
import google.auth
from datetime import datetime
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
# Libraries to use Retrieval Augmented Generation techniques
from langchain_google_vertexai import VertexAIEmbeddings, HarmBlockThreshold, HarmCategory
from langchain_community.vectorstores import MatchingEngine, Chroma
from langchain.chains import RetrievalQA
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_nvidia_ai_endpoints import ChatNVIDIA, NVIDIAEmbeddings
from langchain_community.document_loaders import WebBaseLoader, Docx2txtLoader, DirectoryLoader, UnstructuredWordDocumentLoader
import markdown
import re

load_dotenv()

diabetic_files = [f for f in listdir("./diabetic_medication/") if isfile(join("./diabetic_medication/", f))]


model = "nvidia"
if "openai" in model:
    from langchain_openai import ChatOpenAI
    OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
    model_name = "gpt-3.5-turbo-0125"#
    chat_model = ChatOpenAI(model=model_name, temperature=0.1, max_tokens=500, api_key=OPENAI_API_KEY)
elif "mistral" in model:
    from langchain_mistralai import ChatMistralAI
    MISTRAL_API_KEY = os.environ.get('MISTRAL_API_KEY')
    model_name = "mistral-large-latest"#"open-mixtral-8x22b"#"open-mixtral-8x7b"
    chat_model = ChatMistralAI(model=model_name, temperature=0.1, max_tokens=500, api_key=MISTRAL_API_KEY)
elif "med" in model:
    from langchain_community.chat_models import ChatOllama
    model_name = "monotykamary/medichat-llama3"
    chat_model = ChatOllama(model_name, temperature=0.1, max_tokens=500)
elif "nvidia" in model:
    NVIDIA_API_KEY = os.environ.get('NVIDIA_API_KEY')
    #chat_model = ChatNVIDIA(model="writer/palmyra-med-70b-32k", temperature=0.1, max_output_tokens=500)
    chat_model = ChatNVIDIA(model="mistralai/mistral-large", temperature=0.1, max_output_tokens=500)
    #chat_model = ChatNVIDIA(model="mistralai/mixtral-8x22b-instruct-v0.1", temperature=0.1, max_output_tokens=500)
    model_embedding = NVIDIAEmbeddings(model="NV-Embed-QA")
else:
    from langchain_google_vertexai import ChatVertexAI
    creds, _ = google.auth.default(quota_project_id='qylo-prod')
    vertexai.init(project="qylo-prod", location="europe-west2", credentials=creds)
    #model_name = "gemini-pro"
    model_name = "gemini-1.5-pro-preview-0409"
    safety_settings = {
        #HarmCategory.HARM_CATEGORY_UNSPECIFIED: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        #HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
        #HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        #HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
    }

    chat_model = ChatVertexAI(model_name=model_name, temperature=0.1, max_output_tokens=500,
                              safety_settings=safety_settings)
    model_embedding = VertexAIEmbeddings("textembedding-gecko")#"gemini-pro")

logging.basicConfig(filename='service.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
print("LOGGING")

with open("prompts.json") as json_data:
    prompts = json.load(json_data)

def check_word(word, text):
    pattern = r'\b{}\b'.format(re.escape(word))
    if re.search(pattern, text, re.IGNORECASE):
        return True
    else:
        return False
class Conversation:
    def __init__(self):
        self.user, self.ai = "user", "assistant"
        self.current_context = [("system", prompts['initial_context']),
                                #"user", prompts['initial_context']),
                                (self.user, "Hello"),
                                (self.ai, "Hello, I am Qylo, a chatbot designed by Top Doctors, how can I help you?")]
        self.current_action = None
        self.details = {}
        self.status = ""
        self.ui_action = ""
        self.details["picked_field_id"] = None
        print("INIT")
        # Define Text Embeddings model
        embedding = VertexAIEmbeddings("textembedding-gecko")# model_embedding
        
        urls = [#"https://www.sediabetes.org/publicaciones/publicaciones-sed/", 
                "https://adc.cat/es/informacion-diabetes/",
                "https://adc.cat/es/informacion-diabetes/tratamiento/",
                "https://adc.cat/es/informacion-diabetes/tecnologias/",
                "https://adc.cat/es/informacion-diabetes/alimentacion-y-deporte/",
                "https://adc.cat/es/informacion-diabetes/ninos-y-jovenes/",
                "https://adc.cat/es/informacion-diabetes/diabetes-y-embarazo/",
                "https://adc.cat/es/guias-adc/",
                "https://adc.cat/es/informacion-diabetes/recursos/"]
        web_loader = WebBaseLoader(urls)
        #loader = Docx2txtLoader(diabetic_files)
        web_data = web_loader.load()
        print("WEB LOADING")
        # Split document into chunks
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=20)
        web_splits = text_splitter.split_documents(web_data)
        txt_loader = DirectoryLoader("./diabetic_medication/", glob="*.docx", loader_cls=UnstructuredWordDocumentLoader)
        print("DIABETIC FILES loading")
        data = txt_loader.load()
        doc_splits = text_splitter.split_documents(data)
        try:
            all_td_docs = doc_splits + web_splits
        except Exception as e:
            print(e)
            all_td_docs = doc_splits.append(web_splits)
        self.web_vectorstore = Chroma.from_documents(documents=web_splits, embedding=embedding)
        print("WEB LOADING DONE")
        self.vectorstore = Chroma.from_documents(documents=doc_splits, embedding=embedding)
        print("DIABETIC LOADING DONE")
        self.both_vectorstore = Chroma.from_documents(documents=all_td_docs, embedding=embedding)

    def getAnswer(self, question):
        historical_messages = self.current_context.copy()
        if historical_messages[-1][0] == self.user:
            historical_messages.append((self.ai, "MASK"))
        historical_messages.append((self.user, question))
        print("historical messages")
        print(historical_messages)
        print()
        prompt = ChatPromptTemplate.from_messages(historical_messages)
        chain = prompt | chat_model
        answer = chain.invoke({})
        print("answer:", answer.content)
        print()
        return answer.content
    
    def systemRequest(self, system):
        answer = self.getAnswer(system)
        return answer
    
    def generateAnswer(self, request):
        answer = self.systemRequest(request)
        self.current_context.append((self.ai, answer))
        return answer
    
    def generateRAGAnser(self, request, vector_store):
        docs = vector_store.similarity_search(request)
        # Create QA chain to respond to user query along with source documents
        qa = RetrievalQA.from_chain_type(chat_model, retriever=vector_store.as_retriever(), 
                                            return_source_documents=True)
        print("DONE")
        # Run QA chain
        response = qa.invoke({"query": request})
        print("response in RAG", response)
        print()
        print("response", response['result'])
        print()
        return response['result']

    def getIntentLLM(self, request):
        intent = self.systemRequest(prompts['get_intent'].format(user_prompt=request)).strip().lower().replace(" ","-")
        return intent
    
    def generate_diabetes_answer(self, request):
        print("GENERATE DIABETES ANSWER", request)      
        return self.generateRAGAnser(prompts['diabete'].format(user_prompt=request), self.web_vectorstore)

    def generate_medication_answer(self, request):
        print("GENERATE MEDICATION ANSWER", request)      
        return self.generateRAGAnser(prompts['medication'].format(user_prompt=request), self.vectorstore)

    def generate_diabetes_medication_answer(self, request):
        print("GENERATE DIABETES MEDICATION ANSWER", request)      
        return self.generateRAGAnser(prompts['both'].format(user_prompt=request), self.both_vectorstore)

    def check_answer(self, response):
        response = response.replace("Assistant Message: ", "")
        response = response.replace("Conversation roles must alternate user/assistant/user/assistant/...", "")
        return response 

    def handleRequest(self, request):
        request = self.systemRequest(prompts['correct_request'].format(user_prompt=request))        
        self.current_action = self.getIntentLLM(request)

        print("Current action: " + str(self.current_action))
        if "'both" in self.current_action or '"both' in self.current_action:
            response = self.generate_diabetes_medication_answer(request)
        
        elif "'diabet" in self.current_action or '"diabet' in self.current_action:
            response = self.generate_diabetes_answer(request)
        
        elif "'medication" in self.current_action or '"medication' in self.current_action:
            response = self.generate_medication_answer(request)

        else:
            response = self.getAnswer(prompts['other'].format(user_prompt=request))

        response = self.check_answer(response)
        self.current_context.append((self.user, request))
        self.current_context.append((self.ai, response))

        return {"response": markdown.markdown(response), "intent": self.current_action, 
                "ui_action": self.ui_action, "details": self.details}

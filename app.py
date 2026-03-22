import os
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
from groq import Groq
import chromadb
import streamlit as st

load_dotenv()

# ---------------- CONFIG ---------------- #

st.set_page_config(
    page_title="RAG Chatbot",
    page_icon="🤖",
    layout="wide"
)

# ---------------- MODELS ---------------- #

@st.cache_resource
def load_models():

    embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

    chroma_client = chromadb.PersistentClient(
        path="./chroma_db"
    )

    collection = chroma_client.get_or_create_collection(
        name="documents"
    )

    groq_client = Groq(
        api_key=os.getenv("GROQ_API_KEY")
    )

    return embedding_model, collection, groq_client


embedding_model, collection, groq_client = load_models()

# ---------------- FUNCTIONS ---------------- #

def get_embedding(text):

    return embedding_model.encode(text).tolist()


def retrieve(question, top_k=3):

    question_embedding = get_embedding(question)

    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=top_k
    )

    return results["documents"][0]


def ask(question):

    chunks = retrieve(question)

    context = "\n\n".join(chunks)

    prompt = f"""
You are a helpful assistant.

Answer ONLY from context.

If missing say:
"I don't know based on the provided document."

Context:
{context}

Question:
{question}

Answer:
"""

    response = groq_client.chat.completions.create(

        model="llama-3.3-70b-versatile",

        messages=[
            {
                "role":"user",
                "content":prompt
            }
        ]
    )

    return response.choices[0].message.content


# ---------------- SIDEBAR ---------------- #

with st.sidebar:

    st.title("📚 RAG Controls")

    st.markdown("---")

    top_k = st.slider(
        "Context chunks",
        1,
        10,
        3
    )

    if st.button("Clear Chat"):

        st.session_state.messages = []
        st.rerun()

    st.markdown("---")

    st.info(
        "This chatbot answers from your vector database using RAG."
    )


# ---------------- MAIN UI ---------------- #

st.title("🤖 Document Assistant")

st.markdown(
"""
Ask questions about your indexed documents.
Answers are generated using retrieved context.
"""
)

st.divider()

# session

if "messages" not in st.session_state:

    st.session_state.messages = []


# display history

for msg in st.session_state.messages:

    with st.chat_message(msg["role"]):

        st.markdown(msg["content"])


# input

question = st.chat_input(
    "Ask something about your documents..."
)


if question:

    st.session_state.messages.append(

        {
            "role":"user",
            "content":question
        }
    )

    with st.chat_message("user"):

        st.markdown(question)


    with st.chat_message("assistant"):

        with st.spinner("Generating answer..."):

            answer = ask(question)

        st.markdown(answer)


    st.session_state.messages.append(

        {
            "role":"assistant",
            "content":answer
        }
    )
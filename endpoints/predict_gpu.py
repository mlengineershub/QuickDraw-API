from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv
import numpy as np
from PIL import Image
from typing import List
from io import BytesIO
import torch
from transformers import pipeline, AutoModelForImageClassification, AutoImageProcessor

# Load environment variables
ENV_FILE_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(dotenv_path=ENV_FILE_PATH)

model_ckpt = os.getenv("MODEL_CKPT")
host = os.getenv("HOST")
port = int(os.getenv("PORT_ENDPOINT"))
app_port = int(os.getenv("PORT_APP"))

# Initialize the FastAPI app
app = FastAPI()

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[f"http://{host}:{app_port}"],
    allow_credentials=True,
    allow_methods=["GET", "POST"], 
    allow_headers=["*"], 
)

model = AutoModelForImageClassification.from_pretrained(model_ckpt)
image_processor = AutoImageProcessor.from_pretrained(model_ckpt)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
pipe = pipeline('image-classification', model=model, image_processor=image_processor, device=device)

# Define the endpoints
@app.get("/")
def index():
    return {"message": "Hello, please go to /docs to see the API documentation"}

@app.get("/device")
def get_device():
    return {"device": device}

@app.get("/model")
def get_model():
    return {"model": model_ckpt}

@app.post("/predict_with_path")
def predict_with_path(image: str):
    prediction = pipe(image)
    label = prediction[0]['label']
    score = prediction[0]['score']
    return {"max_prob": score, "pred_label": label}

@app.post("/predict_with_array")
def predict_with_array(image: List[List[List[int]]]):
    image = np.array(image)
    if image.max() <= 1:
        image = image * 255
    image = Image.fromarray(image.astype('uint8'))
    prediction = pipe(image)
    label = prediction[0]['label']
    score = prediction[0]['score']
    return {"max_prob": score, "pred_label": label}

@app.post("/predict_with_file")
async def predict_with_file(file: UploadFile = File(...)):
    # Read the image file and convert it into a PIL Image
    image_contents = await file.read()
    image = Image.open(BytesIO(image_contents))
    
    # Convert the PIL Image into a numpy array
    image_array = np.array(image)
    
    if image_array.shape[2] > 1:
        # Convert to grayscale by averaging channels
        image_array = np.mean(image_array, axis=2)
    
    # Scale the values if they are between 0 and 1
    if image_array.max() <= 1:
        image_array *= 255

    prediction = pipe(Image.fromarray(image_array.astype('uint8')))
    label = prediction[0]['label']
    score = prediction[0]['score']
    return {"max_prob": score, "pred_label": label}

if __name__ == "__main__":
    uvicorn.run(app, host=host, port=port)

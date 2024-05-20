# Imports for environment variables
from io import BytesIO
import os
# from dotenv import load_dotenv

# Imports for web API
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Imports for data handling and processing
import numpy as np
from PIL import Image

# Imports for type annotations
from typing import List

# Imports for deep learning and model processing
import torch
from transformers import (pipeline,
                          AutoModelForImageClassification,
                          AutoImageProcessor)

import json

# Imports for Supabase
from supabase import Client

# Imports for pandas
import pandas as pd

from utils.config import ScoreData


# Load environment variables
# ENV_FILE_PATH = (
#     os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
# )
# load_dotenv(dotenv_path=ENV_FILE_PATH)

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
    allow_headers=["*"]
)

model = AutoModelForImageClassification.from_pretrained(model_ckpt)
image_processor = AutoImageProcessor.from_pretrained(model_ckpt)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
pipe = pipeline('image-classification',
                model=model,
                image_processor=image_processor,
                device=device)

UTILS_PATH = os.path.join(os.path.join(os.path.dirname(__file__), 'utils'))
JSON_PATH = os.path.join(UTILS_PATH, 'labels_emoji.json')

with open(JSON_PATH, 'r', encoding='utf-8') as f:
    label_emoji = json.load(f)

# Initialize the Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
DB = Client(SUPABASE_URL, SUPABASE_KEY)


# Define the endpoints
@app.get("/")
async def index():
    return {"message":
            "Hello, please go to /docs to see the API documentation"}


@app.get("/device")
async def get_device():
    return {"device": device}


@app.get("/model")
async def get_model():
    return {"model": model_ckpt}


@app.post("/predict_with_path")
async def predict_with_path(image: str):
    """
    This function will take an image as input and return the prediction

    @params {image: str} the path to the image
    """

    prediction = pipe(image)
    print(prediction)
    label = prediction[0]['label']
    score = prediction[0]['score']

    return {"max_prob": score, "pred_label": label}


@app.post("/predict_with_array")
async def predict_with_array(image: List[List[List[int]]]):
    """
    This function will take an image as input and return the prediction

    @params {image: List[List[List[int]]} the image as a list of lists of lists
    """

    image = np.array(image)

    if image.max() <= 1:
        image = image * 255

    image = Image.fromarray(image.astype('uint8'))

    prediction = pipe(image)

    print(prediction)
    label = prediction[0]['label']
    score = prediction[0]['score']

    return {"max_prob": score, "pred_label": label}


@app.post("/predict_with_file")
async def predict_with_file(file: UploadFile = File(...)):
    """
    This function will take an image as input and return the prediction

    @params {file: UploadFile} the image file
    """

    image_contents = await file.read()
    image = Image.open(BytesIO(image_contents))

    image_array = np.array(image)

    if image_array.shape[2] > 1:
        image_array = np.mean(image_array, axis=2)

    if image_array.max() <= 1:
        image_array *= 255

    prediction = pipe(Image.fromarray(image_array.astype('uint8')))
    label = prediction[0]['label']
    score = prediction[0]['score']
    return {"max_prob": score, "pred_label": label}


@app.get("/labels")
async def get_labels():
    """
    Function to return the labels of the model
    """
    labels = list(pipe.model.config.id2label.values())
    emojis = [label_emoji[label] for label in labels]
    dict_label_emoji = dict(zip(labels, emojis))

    return dict_label_emoji


@app.get("/scores")
async def get_scores(mode: str, difficulty: str):
    """
    Function to return the top 3 scores from the database
    filtered by the given mode and difficulty.
    It returns a dictionary with the scores.

    score1: {   user: user1,
                score: score,
                mean_time: mean_time,
                mode: mode,
                difficulty: difficulty}

    score2: {   user: user2,
                score: score,
                mean_time: mean_time,
                mode: mode,
                difficulty: difficulty}

    score3: {   user: user3,
                score: score,
                mean_time: mean_time,
                mode: mode,
                difficulty: difficulty}
    """

    _table = DB.table("scores").select("*").execute()
    fetch = True
    for param in _table:
        if fetch:
            _data = param
            fetch = False

    data = _data[1]
    df = pd.DataFrame(data)
    df_filtered = df[(df['mode'] == mode) & (df['difficulty'] == difficulty)]

    df_filtered = df_filtered.sort_values(by=['score', 'mean_time'],
                                          ascending=[False, True])

    df_top3 = df_filtered.head(3)

    scores = df_top3.to_dict(orient='records')

    return scores


@app.post("/add_score")
async def add_score(data: ScoreData):
    """
    Function to add a new score to the database
    """

    data_dict = data.dict()

    DB.table("scores").insert([data_dict]).execute()

    return {"message": "Score added successfully"}


if __name__ == "__main__":
    uvicorn.run(app, host=host,
                port=port)

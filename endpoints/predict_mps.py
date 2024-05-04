# 1. Import the required libraries
from fastapi import FastAPI
import uvicorn

import torch
from transformers import pipeline
from transformers import AutoModelForImageClassification, AutoImageProcessor


# 2. Create the app object
app = FastAPI()
model_ckpt = "ilyesdjerfaf/vit-base-patch16-224-in21k-quickdraw"

model = AutoModelForImageClassification.from_pretrained(model_ckpt)
image_processor = AutoImageProcessor.from_pretrained(model_ckpt)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
pipe = pipeline('image-classification', model=model, image_processor=image_processor, device=device)


# 3. Index route, opens automatically on http://
@app.get("/") # get request
def index():
    """
    We have to create a function that will return a key value pair
    Here we are focusing on the key "message" and the value "Hello, stranger"
    As soon as we run the server, we will see the message "Hello, stranger" on the browser
    """
    return {"message": "Hello, stranger"}

# 4. Route with a single parameter, returns the parameter within a message
@app.post("/predict")
def predict(image: str):
    """
    This function will take an image as input and return the prediction
    """
    prediction = pipe(image)
    print(prediction)
    label = prediction[0]['label']
    score = prediction[0]['score']
    return {"max_prob": score, "pred_label": label}
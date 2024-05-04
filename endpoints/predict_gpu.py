# 1. Import the required libraries
from fastapi import FastAPI
import uvicorn

import torch
from transformers import pipeline
from transformers import AutoModelForImageClassification, AutoImageProcessor

from PIL import Image
import numpy as np
from typing import List, Any


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
    return {"message": "Hello, stranger"}

# 4. Route with a single parameter, returns the parameter within a message
@app.post("/predict_with_path")
def predict_with_path(image: str):
    """
    This function will take an image as input and return the prediction
    """
    prediction = pipe(image)
    print(prediction)
    label = prediction[0]['label']
    score = prediction[0]['score']
    return {"max_prob": score, "pred_label": label}

@app.post("/predict_with_array")
def predict_with_array(image: np.ndarray):

    # Convert the image to a numpy array
    image = np.array(image)

    # if the image contains values between 0 and 1, multiply by 255
    if image.max() <= 1:
        image = image * 255

    # Convert the image to a PIL image
    image = Image.fromarray(image.astype('uint8'))

    # Make a prediction
    prediction = pipe(image)

    print(prediction)
    label = prediction[0]['label']
    score = prediction[0]['score']
    return {"max_prob": score, "pred_label": label}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)

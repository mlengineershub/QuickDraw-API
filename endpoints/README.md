# Endpoints Directory

This directory contains API implementations for image classification using a fine-tuned model on the Quickdraw dataset. The models are hosted on [Hugging Face](https://huggingface.co/ilyesdjerfaf/vit-base-patch16-224-in21k-quickdraw) and configured via environment variables specified in a `.env` file 
located at the root of the project. A performance review indicates that you can run these file on practically all devices. It only takes few MB on RAM or VRAM.

## Overview

The `endpoints/` directory includes three Python scripts, each designed to run the image classification API on different hardware setups: CPU, GPU, and MPS (Apple's Metal Performance Shaders). The API uses `FastAPI` for serving predictions via HTTP requests.

## File/Folder Description

| File/Folder      | Description |
| ---------------- | ----------- |
| `/utils`         | This folder |contains unclassifiable files like README images, text to emoji dictionnary or score Python class |
| `Dockerfile`     | Dockerfile for deploying Quickdraw endpoints on a container |
| `entrypoint.sh`  | Run file on linux from terminal command line, use the `--device` argument |
| `predict_cpu.py` | Launches the API using CPU for inference. This is suitable for environments without a dedicated GPU. |
| `predict_gpu.py` | Launches the API using a GPU. This requires a CUDA-compatible GPU and relevant NVIDIA drivers and libraries. |
| `predict_mps.py` | Launches the API using Apple MPS, optimizing performance on macOS devices with Apple silicon. |

## Prerequisites

- FastAPI
- Uvicorn
- PyTorch
- Transformers library from Hugging Face
- A `.env` file containing:
  - `MODEL_CKPT`: Model checkpoint on Hugging Face
  - `HOST`: Host address (usually `localhost` or `127.0.0.1`)
  - `PORT_APP`: Local web view port
  - `PORT_ENDPOINT`: Port number for the API server
  - `SUPABASE_URL`: Supabase API private URL
  - `SUPABASE_KEY`: Supabase private API key

## Setup and Execution

1. **Environment Setup:**
   - Install required packages:   
   `pip install -r requirements.txt`

2. **Configuration:**
   - Create a `.env` file in the root directory with the following content:
     ```
     MODEL_CKPT=<model-checkpoint>
     HOST=localhost
     PORT_APP=5500
     PORT_ENDPOINT=8000
     SUPABASE_URL=...
     SUPABASE_KEY=...
     ```
     However, to get the `SUPABASE_URL` and `SUPABASE_KEY` parameters and access to the Supabase API. Your have to ask permissions to the owner of the repository.


3. **Running the API:**
   - Navigate to the directory containing the desired script based on your hardware. Be careful, you must have a CUDA compatible GPU to run `predict_gpu.py`.
   - Execute the script using Uvicorn:
     ```
     python endpoints/predict_cpu.py # For CPU
     python endpoints/predict_gpu.py # For GPU
     python endpoints/predict_mps.py # For MPS
     ```
   - Access the API at `http://localhost:8000/docs` to interact with the Swagger UI and test the endpoints.

## API Endpoints

- `GET /`: Returns a welcome message and a link to the API documentation.
- `GET /add_score`: Add a score to the score database. Your must provide `user`, `score`, `mean_time`, `mode`and `difficulty`.
- `GET /device`: Returns the type of device being used for inference: `cpu`or `gpu`.
- `GET /labels`: Return the label set used by the model for predictions.
- `GET /model`: Returns the model checkpoint.
- `GET /scores`: Returns the top 3 scores from the database with parameters `mode`and `difficulty`.
- `POST /predict_with_path`: Accepts an image path and returns the classification results.
- `POST /predict_with_array`: Accepts an image as a nested list of integers and returns the classification results.
- `POST /predict_with_array`: Accepts an image file and returns the classification results.

![API](utils/endpoints_screen.png)

## Additional Notes

- Ensure that the model checkpoint specified in `.env` matches the device compatibility (CPU/GPU/MPS).
- Modify the host and port settings as required by your deployment environment.
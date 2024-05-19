# Dockerfile for deploying Quickdraw endpoints on a container
# Authors: Ilan ALIOUCHOUCHE and Ilyes Djerfaf

FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && rm requirements.txt

COPY .env /app/.env
RUN chmod 777 /app/.env

COPY endpoints /app/endpoints
RUN rm -f /app/endpoints/README.md && \
    chmod +x /app/endpoints/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/app/endpoints/entrypoint.sh"]

FROM python:3.8-slim

WORKDIR /app

COPY app.py /app
COPY templates /app/templates
COPY static /app/static

RUN pip install Flask requests flask-cors

CMD ["python", "app.py"]
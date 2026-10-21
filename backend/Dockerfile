FROM python:3.12-slim

WORKDIR /app

# Variables de entorno recomendadas
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Instala dependencias del sistema
RUN apt-get update && apt-get install -y libpq-dev gcc

# Actualiza pip e instala requerimientos
RUN pip install --upgrade pip
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo el código del backend
COPY . /app/

# Expone el puerto y arranca Django
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
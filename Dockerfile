# Use an official Python runtime as the base image
FROM python:3.9

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file to the working directory
COPY requirements.txt .
# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to the working directory
COPY . .

# Set environment variables if needed (e.g., for production settings)
# ENV DJANGO_SETTINGS_MODULE=myapp.settings.production

# Run any additional commands (e.g., migrations, collectstatic)
# RUN python manage.py migrate && python manage.py collectstatic --noinput
# RUN python manage.py migrate

# Expose the port the Django app will run on
EXPOSE 8000

# Start the Django development server
CMD ["gunicorn", "help_center.help_center.wsgi:application", "--bind", "0.0.0.0:8000"]

"""
Django settings for scrapper project.

Generated by 'django-admin startproject' using Django 5.0.6.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path
from celery.schedules import crontab
import os
import environ

from utils.ExcelReader import ExcelReader

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# Read .env file
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# Initialize environment variables
env = environ.Env(
    # set casting, default value
    DEBUG=(bool, False)
)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = [
    '0.0.0.0',
    '127.0.0.1',
    'web-scrapping-aolr.onrender.com',
]

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'myapp',
    'scheduler',
    'rest_framework',
    'django_celery_beat',
    'corsheaders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

ROOT_URLCONF = 'scrapper.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'scrapper.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

news_out = ExcelReader.read_news()
news_clients = news_out[0]
news_names = news_out[1]

web_out = ExcelReader.read_web()
web_clients = web_out[0]
web_urls = web_out[1]

# Configure Celery
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'

'''
CELERY_BEAT_SCHEDULE = {
    'fetch_news_every_weekday_morning': {
        'task': 'scheduler.tasks.fetch_news_for_names',
        'schedule': crontab(hour=6, minute=0, day_of_week='mon-fri'),
        'args': (news_names,)
    },
    'check_website_changes_daily': {
        'task': 'scheduler.tasks.check_website_changes',
        'schedule': crontab(hour=6, minute=0, day_of_week='mon-fri'),
        'args': (web_clients, web_urls,)
    },
}
'''

# CORS configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://scrapper-9cbf0.firebaseapp.com",
    "https://scrapper-9cbf0.web.app",
]

# If you want to allow all origins (not recommended for production)
# CORS_ALLOW_ALL_ORIGINS = True

# To allow credentials (like cookies or HTTP authentication) to be included in the requests
CORS_ALLOW_CREDENTIALS = True

# Optionally, specify allowed methods and headers
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'authorization',
    'content-type',
    'x-csrftoken',
    'x-requested-with',
]

OPENAI_API_KEY = env('OPENAI_API_KEY')
NEWS_API_KEY = env('NEWS_API_KEY')

DB_CONN = env('DB_CONN')
DB_NAME = env('DB_NAME')

# Configure email settings
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL')
# TO_EMAIL = ['Nash_peter@hotmail.com', 'tsliyan@hotmail.com', 'kalanarajika99@gmail.com']
TO_EMAIL = 'kalanarajika99@gmail.com'
EMAIL_API_KEY = env('EMAIL_API_KEY')

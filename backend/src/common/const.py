import os

from cryptography.fernet import Fernet
from fastapi.security import OAuth2PasswordBearer

SECRET_KEY = os.getenv("SECRET_KEY", "A238aDSJAJSHD23fdas4s5")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

fernet = Fernet(Fernet.generate_key())

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="authenticate")
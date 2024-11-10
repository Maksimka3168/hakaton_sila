from typing import Dict

from api.mail.infrastructure.repositories.core.IAuthMailRepository import IAuthMailRepository
from common.const import fernet


class MemoryAuthMailRepository(IAuthMailRepository):

    def __init__(self):
        self.__user_store: Dict[str, bytes] = {}

    async def get_password(self, mail: str):
        return self.__user_store.get(mail)

    async def register(self, mail: str, password: str):
        encrypted_password = fernet.encrypt(password.encode())
        self.__user_store[mail] = encrypted_password

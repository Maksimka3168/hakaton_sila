class IAuthMailRepository:

    async def get_password(self, mail: str):
        raise NotImplementedError()

    async def register(self, mail: str, password: str):
        raise NotImplementedError()

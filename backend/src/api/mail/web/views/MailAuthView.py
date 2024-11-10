from datetime import timedelta

from fastapi import HTTPException
from imapclient import IMAPClient
from starlette import status

from api.mail.functions.access_token import create_access_token
from api.mail.infrastructure.repositories.core.IAuthMailRepository import IAuthMailRepository
from api.mail.models.AuthRequestModel import AuthRequestModel
from common.const import ACCESS_TOKEN_EXPIRE_MINUTES, fernet


class MailAuthView:

    def __init__(
        self,
        email_auth_repository: IAuthMailRepository
    ):
        self.__email_auth_repository = email_auth_repository

    async def __call__(self, auth: AuthRequestModel):
        email_address = auth.email
        password = auth.password

        encrypted_password = await self.__email_auth_repository.get_password(email_address)

        try:
            with IMAPClient(host='imap.gmail.com', ssl=True) as client:
                client.login(email_address, password)
        except Exception as error:
            print(error)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Неверные учетные данные"
            )

        if encrypted_password:
            try:
                decrypted_password = fernet.decrypt(encrypted_password).decode()
                if decrypted_password != password:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Неверные учетные данные"
                    )
            except Exception:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Неверные учетные данные"
                )
        else:
            await self.__email_auth_repository.register(email_address, password)

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": email_address},
            expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
from typing import List

from fastapi import FastAPI
from starlette import status

from api.mail.infrastructure.repositories.core.IAuthMailRepository import IAuthMailRepository
from api.mail.models.EmailMessageModel import EmailMessageModel
from api.mail.models.TokenResponseModel import TokenResponseModel
from api.mail.web.views.GetUnreadMessagesView import GetUnreadMessagesView
from api.mail.web.views.MailAuthView import MailAuthView
from common.utils.ioc.ioc import ioc


class MailWebInstall:

    async def __call__(
        self,
        app: FastAPI
    ):
        mail_auth_view = MailAuthView(
            email_auth_repository=ioc.get(IAuthMailRepository)
        )

        get_unread_messages_view = GetUnreadMessagesView(
            email_auth_repository=ioc.get(IAuthMailRepository)
        )

        app.add_api_route(
            path="/mail/auth",
            endpoint=mail_auth_view.__call__,
            methods=["POST"],
            status_code=status.HTTP_200_OK,
            response_model=TokenResponseModel
        )

        app.add_api_route(
            path="/mail/unread",
            endpoint=get_unread_messages_view.__call__,
            methods=["GET"],
            status_code=status.HTTP_200_OK,
            # response_model=List[EmailMessageModel]
        )
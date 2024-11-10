import email
from email.header import decode_header

from fastapi import HTTPException
from imapclient import IMAPClient

from api.mail.functions.access_token import decode_access_token
from api.mail.infrastructure.repositories.core.IAuthMailRepository import IAuthMailRepository
from api.mail.models.EmailMessageModel import EmailMessageModel
from common.const import fernet


class GetUnreadMessagesView:

    def __init__(
            self,
            email_auth_repository: IAuthMailRepository
    ):
        self.__email_auth_repository = email_auth_repository

    async def __call__(
        self,
        token: str
    ):
        email_address = decode_access_token(token)
        encrypted_password = await self.__email_auth_repository.get_password(email_address)
        if not encrypted_password:
            raise HTTPException(status_code=400, detail="Пользователь не найден")

        # Расшифровка пароля
        try:
            password = fernet.decrypt(encrypted_password).decode()
        except Exception:
            raise HTTPException(status_code=500, detail="Не удалось расшифровать пароль")

        with IMAPClient(host='imap.gmail.com', ssl=True) as client:
            client.login(email_address, password)
            client.select_folder('INBOX')
            messages = client.search(['UNSEEN'])
            unread_messages = []
            for uid in messages:
                raw_message = client.fetch(uid, ['BODY[]', 'FLAGS'])
                email_message = email.message_from_bytes(raw_message[uid][b'BODY[]'])

                subject_encoded = email_message.get('Subject', '(Без темы)')
                subject = self.decode_mime_header(subject_encoded)

                from_ = email_message.get('From', '(Без отправителя)')

                # Извлечение тела сообщения
                body = self.get_email_body(email_message)

                unread_messages.append(
                    EmailMessageModel(
                        uid=uid,
                        from_=from_,
                        subject=subject,
                        body=body  # Добавляем тело сообщения
                    )
                )
            return unread_messages

    def get_email_body(self, email_message):
        """
        Извлекает текстовое тело сообщения из объекта email.message.Message.
        Поддерживает как простые, так и мультимедийные сообщения.
        """
        if email_message.is_multipart():
            for part in email_message.walk():
                content_type = part.get_content_type()
                content_disposition = str(part.get("Content-Disposition"))

                # Ищем текстовую часть, которая не является вложением
                if content_type == "text/plain" and "attachment" not in content_disposition:
                    try:
                        return part.get_payload(decode=True).decode()
                    except:
                        return "(Не удалось декодировать текстовое содержимое)"
        else:
            # Если сообщение не мультимедийное, просто декодируем его содержимое
            try:
                return email_message.get_payload(decode=True).decode()
            except:
                return "(Не удалось декодировать текстовое содержимое)"

        return "(Текстовое содержимое не найдено)"

    def decode_mime_header(self, header):
        """
        Декодирует заголовок MIME в читаемый формат.

        :param header: Закодированный заголовок.
        :return: Декодированный заголовок как строка.
        """
        decoded_parts = decode_header(header)
        decoded_string = ''
        for part, encoding in decoded_parts:
            if isinstance(part, bytes):
                # Если кодировка неизвестна, используем 'utf-8' по умолчанию
                decoded_string += part.decode(encoding or 'utf-8', errors='replace')
            else:
                decoded_string += part
        return decoded_string
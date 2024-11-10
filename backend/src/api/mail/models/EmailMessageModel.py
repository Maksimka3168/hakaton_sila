from pydantic import BaseModel


class EmailMessageModel(BaseModel):
    uid: int
    from_: str
    subject: str
    body: str
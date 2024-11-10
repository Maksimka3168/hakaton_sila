from pydantic import BaseModel


class PredictionResponseModel(BaseModel):
    point_label: str
    type_label: str
    serial_number: str
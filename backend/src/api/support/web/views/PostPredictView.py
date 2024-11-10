import asyncio

from api.support.functions.predict import predict_fn
from api.support.web.models.PredictionResponseModel import PredictionResponseModel
from api.support.web.models.TextRequestModel import TextRequest
from common.install_models.core.IGetModelData import IGetModelData


class PostPredictView:

    def __init__(
        self,
        get_model_data: IGetModelData
    ):
        self.__get_model_data = get_model_data

    async def __call__(self, request: TextRequest):
        model, tokenizer, device, label_encoder_point, label_encoder_type = await self.__get_model_data()

        text = request.text

        loop = asyncio.get_running_loop()
        point_label, type_label, serial_number = await loop.run_in_executor(
            None,
            predict_fn,
            text,
            model,
            tokenizer,
            label_encoder_point,
            label_encoder_type,
            device)

        return PredictionResponseModel(
            point_label=point_label,
            type_label=type_label,
            serial_number=serial_number
        )

from fastapi import FastAPI
from starlette import status

from api.support.web.models.PredictionResponseModel import PredictionResponseModel
from api.support.web.views.PostPredictView import PostPredictView
from api.support.web.views.UploadCSVView import UploadCSVView
from common.install_models.core.IGetModelData import IGetModelData
from common.utils.ioc.ioc import ioc


class SupportWebInstall:

    async def __call__(
        self,
        app: FastAPI
    ):
        post_predict_view = PostPredictView(
            get_model_data=ioc.get(IGetModelData)
        )

        upload_csv_view = UploadCSVView(
            get_model_data=ioc.get(IGetModelData)
        )

        app.add_api_route(
            path="/predict",
            endpoint=post_predict_view.__call__,
            methods=["POST"],
            status_code=status.HTTP_200_OK,
            response_model=PredictionResponseModel
        )

        app.add_api_route(
            path="/upload",
            endpoint=upload_csv_view.__call__,
            methods=["POST"],
            status_code=status.HTTP_200_OK
        )
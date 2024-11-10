import joblib

from api.support.functions.load_model import load_model_fn
from common.install_models.core.IGetModelData import IGetModelData


class GetModelData(IGetModelData):

    def __init__(self):
        model, tokenizer, device = load_model_fn()
        self.model = model
        self.tokenizer = tokenizer
        self.device = device
        self.label_encoder_point = joblib.load("/src/model/label_encoder_point.joblib")
        self.label_encoder_type = joblib.load("/src/model/label_encoder_type.joblib")

    async def __call__(self):
        return self.model, self.tokenizer, self.device, self.label_encoder_point, self.label_encoder_type
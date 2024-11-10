import os

import torch
from transformers import AutoTokenizer


def load_model_fn():
    device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')
    model = torch.jit.load(f"{os.environ.get('MODEL_PATH', '/src/model')}/model.pt", map_location=device)
    tokenizer = AutoTokenizer.from_pretrained('DeepPavlov/rubert-base-cased')
    return model, tokenizer, device

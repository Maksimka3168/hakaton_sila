import torch

from api.support.functions.extract_serial_number import extract_serial_number_fn
from api.support.functions.proccess_text import preprocess_text


def predict_fn(text, model, tokenizer, label_encoder_point, label_encoder_type, device, max_len=512):
    model.eval()
    processed_text = preprocess_text(text)

    encoding = tokenizer.encode_plus(
        processed_text,
        add_special_tokens=True,
        max_length=max_len,
        padding='max_length',
        truncation=True,
        return_attention_mask=True,
        return_tensors='pt',
    )

    input_ids = encoding['input_ids'].to(device, non_blocking=True)
    attention_mask = encoding['attention_mask'].to(device, non_blocking=True)

    with torch.no_grad():
        outputs_point, outputs_type = model(
            input_ids=input_ids,
            attention_mask=attention_mask
        )

    _, preds_point = torch.max(outputs_point, dim=1)
    _, preds_type = torch.max(outputs_type, dim=1)

    point_label = label_encoder_point.inverse_transform(preds_point.cpu().numpy())[0]
    type_label = label_encoder_type.inverse_transform(preds_type.cpu().numpy())[0]

    serial_number = extract_serial_number_fn(text)

    return point_label, type_label, serial_number

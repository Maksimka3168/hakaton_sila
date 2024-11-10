import asyncio
import io
import time
from concurrent.futures import ThreadPoolExecutor

from fastapi import UploadFile, File, HTTPException
import pandas as pd
from starlette.responses import StreamingResponse

from api.support.functions.predict import predict_fn
from common.install_models.core.IGetModelData import IGetModelData


class UploadCSVView:

    def __init__(
        self,
        get_model_data: IGetModelData
    ):
        self.__get_model_data = get_model_data

    async def __call__(self, file: UploadFile = File(...)):
        model, tokenizer, device, label_encoder_point, label_encoder_type = await self.__get_model_data()

        REQUIRED_COLUMNS = ['Тема', 'Описание']
        if file.content_type != 'text/csv':
            raise HTTPException(status_code=400, detail="Файл должен быть в формате CSV.")

        try:
            contents = await file.read()
            df = pd.read_csv(io.BytesIO(contents), delimiter=",")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Ошибка при чтении CSV файла: {e}")

        if len(list(df.iterrows())) > 200:
            raise HTTPException(status_code=400, detail=f"Количество строк превышает 200")

        if not all(column in df.columns for column in REQUIRED_COLUMNS):
            raise HTTPException(
                status_code=400,
                detail=f"CSV файл должен содержать колонки: {', '.join(REQUIRED_COLUMNS)}"
            )

        async def process_row(
                row, executor, model, tokenizer, label_encoder_point, label_encoder_type, device, point_labels, type_labels, serial_numbers
        ):
            start = time.time()
            loop = asyncio.get_running_loop()
            input_text = f"{str(row['Тема'])} {str(row['Описание'])}"
            point_label, type_label, serial_number = await loop.run_in_executor(
                executor,
                predict_fn,
                input_text,
                model,
                tokenizer,
                label_encoder_point,
                label_encoder_type,
                device
            )
            point_labels.append(point_label)
            type_labels.append(type_label)
            serial_numbers.append(serial_number)
            print(int(time.time()) - int(start))
        try:
            point_labels = []
            type_labels = []
            serial_numbers = []

            with ThreadPoolExecutor(max_workers=6) as executor:
                tasks = [
                    process_row(row, executor, model, tokenizer, label_encoder_point, label_encoder_type, device,
                                point_labels, type_labels, serial_numbers)
                    for index, row in df.iterrows()
                ]
                await asyncio.gather(*tasks)

            df['type_label'] = type_labels
            df['point_label'] = point_labels
            df['serial_number'] = serial_numbers
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Ошибка при генерации предсказаний: {e}")

        stream = io.StringIO()
        df.to_csv(stream, index=False)
        stream.seek(0)

        response = StreamingResponse(iter([stream.getvalue()]),
                                     media_type="text/csv")
        response.headers["Content-Disposition"] = f"attachment; filename=modified_{file.filename}"
        return response
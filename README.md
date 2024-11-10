<h1 align="center">Хакатон СИЛА</h1>

## Как запустить backend часть?
* Загрузите модель по следующей ссылке: [Перейти](https://drive.google.com/drive/folders/19u8SX8jmbRih1LjhzuzVUN8LBDVlz77I?usp=sharing)
* Переместите загруженные файлы в директорию: backend/src/model
* Перейдите в директорию backend/src
```
cd backend/src
```
* Создайте .env файл
```commandline
cp .env.example .env
```
* Измените путь MODEL_PATH до папки model без последней черты, к примеру:
```
MODEL_PATH=/src/model
```
* И установите зависимости
```
pip3 install -r requirements.txt
```
* Запустите скрипт следующей командой:
```commandline
uvicorn main:app --host=0.0.0.0 --port 8000 --log-level=info
```
## Как запустить frontend часть?
* Перейдите в директорию frontend
```commandline
cd frontend
```
* Создайте .env файл и ничего в нём не меняйте
```commandline
cp .env.example .env
```
* Установите все зависимости
```commandline
npm install 
```
* Запустите скрипт следующей командой:
```commandline
npm run dev
```



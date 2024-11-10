<h1 align="center">Хакатон СИЛА</h1>

## Как запустить backend часть?
* Загрузите модель по следующей ссылке: [Перейти](https://google.com)
* Переместите загруженные файлы в директорию: backend/src/model
* Перейдите в директорию backend
```
cd backend
```
* Создайте .env файл и ничего в нём не меняйте
```commandline
cp .env.example .env
```
* Перейдите в директорию backend/src
```
cd src
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


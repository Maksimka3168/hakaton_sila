from contextlib import asynccontextmanager

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from api.mail.infrastructure.repositories.core.IAuthMailRepository import IAuthMailRepository
from api.mail.infrastructure.repositories.impl.MemoryAuthMailRepository import MemoryAuthMailRepository
from api.mail.web.MailWebInstall import MailWebInstall
from api.support.web.SupportWebInstall import SupportWebInstall
from common.install_models.core.IGetModelData import IGetModelData
from common.install_models.impl.GetDataModel import GetModelData
from common.utils.ioc.ioc import ioc

app = FastAPI(
    root_path="/api/v1",
    title="SUPPORT API",
    version="1.0"
)
app.add_middleware(GZipMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    ioc.set(IAuthMailRepository, MemoryAuthMailRepository())
    ioc.set(IGetModelData, GetModelData())

    (
        await SupportWebInstall()
        (
            app=app
        )
    )

    (
        await MailWebInstall()
        (
            app=app
        )
    )

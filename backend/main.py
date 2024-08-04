from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def hello_world():
    return {"message": "Hello World"}

@app.get("/get_token_info")
async def get_token_info():
    return {"token": "token_info"}
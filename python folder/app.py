from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Req(BaseModel):
    input: str

@app.post("/generate")
def generate(req: Req):
    title = f"자동 포스트 - {req.input}"
    body = f"Python(FastAPI)에서 생성한 글입니다.\n입력값: {req.input}"
    return {"title": title, "body": body}

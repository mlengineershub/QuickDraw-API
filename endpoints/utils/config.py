from pydantic import BaseModel


class ScoreData(BaseModel):
    user: str
    score: int
    mean_time: float
    mode: str
    difficulty: str

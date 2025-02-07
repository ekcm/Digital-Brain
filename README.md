# Digital-Brain

backend:
```
uvicorn app.app:app --reload
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.app:app --bind 0.0.0.0:8000
```
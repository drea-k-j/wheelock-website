from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from database import engine, Base
from routers import announcements, about, wheelock_house, wheelock_weekend, residents, newsletters, auth, config, photos

# Create all database tables
Base.metadata.create_all(bind=engine)

CERT_DIR = Path(__file__).resolve().parent.parent / 'certs'
KEYFILE = CERT_DIR / 'localhost-key.pem'
CERTFILE = CERT_DIR / 'localhost.pem'

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost:3000", "https://localhost:5173", "https://drive.google.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(config.router)
app.include_router(auth.router)
app.include_router(announcements.router)
app.include_router(about.router)
app.include_router(wheelock_house.router)
app.include_router(wheelock_weekend.router)
app.include_router(residents.router)
app.include_router(newsletters.router)
# app.include_router(photos.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        # ssl_keyfile=str(KEYFILE),
        # ssl_certfile=str(CERTFILE),
    )

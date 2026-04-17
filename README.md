# Wheelock Website

openssl req -x509 -out localhost.crt -keyout localhost.key -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -extensions EXT -config <( printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

## Hosting & Deployment
See [HOSTING_PLAN.md](HOSTING_PLAN.md) for the complete hosting strategy and deployment instructions on Render.com.

### Prerequisites
- Python 3.8+
- Node.js 16+

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000 --ssl-keyfile ../certs/localhost-key.pem --ssl-certfile ../certs/localhost.pem
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

### Testing the Full Stack
- Frontend: http://localhost:5173
- Backend API docs: http://localhost:8000/docs
- Backend will serve at `http://localhost:8000` with CORS enabled for localhost:3000 and localhost:5173

#!/bin/bash

# Start the Python backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python server.py &

# Start the Next.js frontend
cd ..
npm install
npm run dev

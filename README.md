## Demo

![Demo](!nicsan.gif)

# Health Cover App (React + Express + MongoDB)

## Quick start

```bash
# 1) From the root, install root dev deps
npm install

# 2) Install frontend deps
cd client && npm install

# 3) Install backend deps
cd ../server && npm install

# 4) Copy .env examples
cp client/.env.example client/.env
cp server/.env.example server/.env

# 5) Start both servers from the root
cd ..
npm run dev
```

Frontend: http://localhost:3000  
Backend:  http://localhost:5000

## MongoDB
Make sure MongoDB is running locally or change `MONGO_URI` in `server/.env` to your Atlas URL.

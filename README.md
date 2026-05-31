# Simple E-commerce Store

This is a minimal full-stack e-commerce example using Node.js, Express, MongoDB (Mongoose) and a plain HTML/CSS/Vanilla JS frontend in `/public`.

Quick start:

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies:

```bash
npm install
```

3. Seed sample products (optional):

```bash
npm run seed
```

4. Run the app:

```bash
npm run dev
```

Open http://localhost:5000

## Local MongoDB Setup

If MongoDB is not running locally, install MongoDB Community Server from https://www.mongodb.com/try/download/community or use Docker.

1. Install MongoDB or Docker.
2. Start MongoDB:

```powershell
mongod --dbpath C:\data\db
```

3. Keep `MONGO_URI` in `.env` set to `mongodb://127.0.0.1:27017/simple-ecom`.

If you already have a MongoDB instance elsewhere, set `MONGO_URI` to that connection string instead.

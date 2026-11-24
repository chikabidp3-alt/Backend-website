# ICT251 Activity 7 - Backend Development

This is a standalone Node.js/Express API for a Campus Maintenance Request System. It implements all required CRUD routes, validation, error responses, a database health check, API guide, SQL schema, and eight made-up records.

## Before running

1. Install Node.js LTS.
2. In this folder, run `npm install`.
3. Create a PostgreSQL database (for example, Render PostgreSQL or Neon).
4. Run `schema.sql`, then run `seed.sql` once against that database.
5. Copy `.env.example` to `.env`, then fill in the database URL, your student number, and allowed frontend origin.
6. Run `npm start`, then open `http://localhost:3000`.

## Required route checklist

| Method | Path | Expected result |
|---|---|---|
| GET | /health | 200 and database confirmation |
| GET | /api/records | 200 array |
| POST | /api/records | 201 saved record with id |
| GET | /api/records/:id | 200 saved record |
| PUT | /api/records/:id | 200 updated record |
| DELETE | /api/records/:id | 200 deletion message |

Run `npm test` to verify the request validation rules.

## Deployment (Render)

Push this directory to a GitHub repository. In Render, create a Web Service with build command `npm install` and start command `npm start`. Add the `.env` values as Render environment variables; do not upload the `.env` file. Set `API_BASE_URL` to the HTTPS URL assigned by Render, redeploy, then test every route against that URL. Submit that base URL in the Activity 7 link field.

## Important customisation

The assignment refers to the system selected in Activity 6. This project uses a Campus Maintenance Request System because those Activity 6 details were not supplied. Change `PROJECT_NAME`, the guide description in `server.js`, and the eight seed records if your selected system was different.

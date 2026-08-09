# Security note

The source archive you uploaded contained real environment credentials. The cleaned project does **not** include `.env` files.

Before using the project publicly, rotate the credentials that were present in the old archive, especially:
- MongoDB database password / connection credentials
- JWT secret
- Cloudinary API credentials

Then create local `.env` files from:
- `server/.env.example`
- `client/.env.example`

Never commit `.env` files to GitHub.

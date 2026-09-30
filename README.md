# Bicycle Shop

Bicycle Shop is a full-stack learning project that manages the catalogue of a bicycle shop. It exposes a REST API built with **TypeScript, Express and Sequelize** on top of a **MySQL** database, and a **React + Vite** frontend (styled with Tailwind CSS) that consumes the API to create, read, update and delete bicycles. Each bicycle belongs to a brand, so the API also provides full CRUD for brands and an endpoint that returns a bicycle together with its brand (eager loading).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [Deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

What you need to install before starting:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) with npm (a version compatible with Vite, e.g. Node.js 22.12+)
- [MySQL](https://dev.mysql.com/downloads/) server (running before you start the backend)

Check your versions:

```bash
git --version
node --version
npm --version
mysql --version
```

### Installing

A step by step series of examples that tell you how to get a development environment running.

**1. Clone the repository**

```bash
git clone <repository-url>
cd bicycle-shop-dsw-entrega-02
```

**2. Create the database**

Connect to MySQL (MySQL Workbench or the command-line client):

```bash
mysql -u root -p
```

And execute:

```sql
CREATE DATABASE IF NOT EXISTS db_bicycle_shop CHARACTER SET utf8mb4;
```

Sequelize creates the tables automatically when the backend starts; only the database itself must exist.

**3. Configure the backend environment**

Create a `.env` file inside `backend/` (you can copy `backend/.env.example`):

```dotenv
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=db_bicycle_shop
DB_USER=your-database-username
DB_PASSWORD=your-database-password
```

**4. Configure the frontend environment**

Create a `.env` file inside `frontend/` (you can copy `frontend/.env.example`):

```dotenv
VITE_API_URL=http://localhost:3000/api
```

Do not add a trailing slash or `/bicycles`; the frontend appends the endpoint paths itself.

**5. Install dependencies**

```bash
cd backend
npm ci
cd ../frontend
npm ci
cd ..
```

**6. Start both applications**

In a first terminal, start the backend:

```bash
cd backend
npm run dev
```

In a second terminal, start the frontend:

```bash
cd frontend
npm run dev
```

The API runs at [http://localhost:3000/api](http://localhost:3000/api) and the frontend at the URL printed by Vite, usually [http://localhost:5173](http://localhost:5173).

> **Note:** the backend currently calls `sequelize.sync({ force: true })`, which **drops and recreates the tables every time the server starts**. Switch to `sequelize.sync()` in `backend/src/server.ts` if you want to keep your data between restarts.

**7. Try it out**

Create a brand and a bicycle, then fetch the bicycle with its brand:

```bash
curl -X POST http://localhost:3000/api/brands -H "Content-Type: application/json" -d '{"name":"Orbea"}'

curl -X POST http://localhost:3000/api/bicycles -H "Content-Type: application/json" -d '{"brandId":1,"model":"Alma M50","description":"Mountain bike","price":1299.99,"stock":5}'

curl http://localhost:3000/api/bicycles/eagerly/1
```

Example response:

```json
{
  "id": 1,
  "brandId": 1,
  "model": "Alma M50",
  "description": "Mountain bike",
  "price": "1299.99",
  "stock": 5,
  "createdAt": "2026-09-30T10:00:00.000Z",
  "updatedAt": "2026-09-30T10:00:00.000Z",
  "brand": {
    "id": 1,
    "name": "Orbea",
    "createdAt": "2026-09-30T09:59:00.000Z",
    "updatedAt": "2026-09-30T09:59:00.000Z"
  }
}
```

## API Endpoints

| Method | Endpoint                       | Description                              |
| ------ | ------------------------------ | ---------------------------------------- |
| GET    | `/api/bicycles`                | List all bicycles                        |
| GET    | `/api/bicycles/:id`            | Get a bicycle by id                      |
| GET    | `/api/bicycles/eagerly/:id`    | Get a bicycle by id including its brand  |
| POST   | `/api/bicycles`                | Create a bicycle                         |
| PUT    | `/api/bicycles/:id`            | Update a bicycle                         |
| DELETE | `/api/bicycles/:id`            | Delete a bicycle                         |
| GET    | `/api/brands`                  | List all brands                          |
| GET    | `/api/brands/:id`              | Get a brand by id                        |
| POST   | `/api/brands`                  | Create a brand                           |
| PUT    | `/api/brands/:id`              | Update a brand                           |
| DELETE | `/api/brands/:id`              | Delete a brand                           |

### POSTMAN

The full API documentation and request collection is available on Postman:

https://documenter.getpostman.com/view/58320210/2sBYB4L76L

## Database Schema

A brand has many bicycles, and each bicycle belongs to exactly one brand (`bicycles.brandId` → `brands.id`, `ON UPDATE CASCADE`, `ON DELETE RESTRICT`).

```mermaid
erDiagram
    BRANDS ||--o{ BICYCLES : "has many"

    BRANDS {
        INT_UNSIGNED id PK "auto increment"
        VARCHAR(150) name "not null"
        DATETIME createdAt
        DATETIME updatedAt
    }

    BICYCLES {
        INT_UNSIGNED id PK "auto increment"
        INT_UNSIGNED brandId FK "not null, references brands.id"
        VARCHAR(150) model "not null"
        TEXT description "nullable"
        DECIMAL(10_2) price "not null"
        INT_UNSIGNED stock "not null, default 0"
        DATETIME createdAt
        DATETIME updatedAt
    }
```

## Running the tests

The project does not include automated tests yet. The API can be tested manually with the [Postman collection](https://documenter.getpostman.com/view/58320210/2sBYB4L76L) or with `curl`, as shown above.

### Break down into end to end tests

The Postman collection covers the full CRUD flow of both resources: creating a brand, creating a bicycle linked to it, reading it (plain and with eager loading), updating it and deleting it. It also checks error responses such as `404 Bicycle not found` and `400` when mandatory fields (`brandId`, `model`, `price`) are missing.

```bash
curl -i http://localhost:3000/api/bicycles/999
# HTTP/1.1 404 Not Found
# {"message":"Bicycle not found"}
```

### And coding style tests

The frontend uses [oxlint](https://oxc.rs/docs/guide/usage/linter.html) to detect common errors and style issues:

```bash
cd frontend
npm run lint
```

## Deployment

Build both applications for production:

```bash
cd backend
npm run build
npm start
```

```bash
cd frontend
npm run build
npm run preview
```

On a live system, set the environment variables (`PORT`, `DB_*` and `VITE_API_URL`) for the production server, serve the contents of `frontend/dist` with a static web server, and replace `sequelize.sync({ force: true })` with `sequelize.sync()` (or migrations) so production data is not wiped on restart.

## Built With

- [Express](https://expressjs.com/) - The backend web framework
- [Sequelize](https://sequelize.org/docs/v6/) - ORM for MySQL
- [MySQL](https://www.mysql.com/) - Relational database
- [TypeScript](https://www.typescriptlang.org/) - Language used in backend and frontend
- [React](https://react.dev/) - Frontend UI library
- [Vite](https://vite.dev/) - Frontend build tool and dev server
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [npm](https://www.npmjs.com/) - Dependency management

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](https://semver.org/) for versioning. For the versions available, see the tags on this repository.

## Authors

- **Sergio Domínguez Castro** - *Initial work*

See also the list of contributors who participated in this project.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Acknowledgments

- Based on the [TypeScript-React-Express-Sequelize-Example](https://github.com/tcrurav/TypeScript-React-Express-Sequelize-Example) project by tcrurav
- Express, Sequelize, React and Vite official documentation

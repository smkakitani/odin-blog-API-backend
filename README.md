# Blog REST API 
REST API built with Node.js/Express. The project is based on RESTful API design and MVC architecture pattern.

Front-end demo: [https://blogapi-higurashi.netlify.app](https://blogapi-higurashi.netlify.app/)

[![Netlify Status](https://api.netlify.com/api/v1/badges/4782a0c5-bd26-4caa-b40a-81111cbf9f8a/deploy-status)](https://app.netlify.com/projects/blogapi-higurashi/deploys)
[![Railway Status](https://img.shields.io/website?url=https%3A%2F%2Fodin-blog-api-backend-production-cbf9.up.railway.app%2F&down_message=failed&logo=railway&label=server&labelColor=%230B0D0E)](https://odin-blog-api-backend-production-cbf9.up.railway.app/)

This project was created following [The Odin Project - Project: Blog API](https://www.theodinproject.com/lessons/node-path-nodejs-blog-api) lesson.

## :scroll: Features :scroll:

+ User type: Blog's author and user
+ User log in - authentication using JSON Web Token
+ Create, read, update and delete - for posts, comments and users
+ Input validation and password hashing

## :hammer_and_wrench: Built with :hammer_and_wrench: 

+ **Runtime -** Node.js
+ **Framework -** Express
+ **Database -** PostgreSQL
+ **ORM -** Prisma
+ **Authentication -** Passportjs, JWT
+ **Validation -** express-validator
+ **Security -** bcrypt, cors
+ **Endpoint test -** Postman

## :flying_saucer: Endpoints :flying_saucer:

| Method | Endpoint | Description |
|  :---: |    ---   |     ---     |
| POST | /sign-up | Creates new user account |
| POST | /log-in | Login as visitor |

<br>

**Authors**
| Method | Endpoint | Description |
|  :---: |    ---   |     ---     |
| GET | /authors | Fetches all authors |
| GET | /authors/:id | Fetches a specific author * |
| PUT | /authors/:id | Updates specific author * |
| DELETE | /authors/:id, /authors/:email | Deletes specific author by e-mail or ID * | 

<br>

**Visitors** 
| Method | Endpoint | Description |
|  :---: |    ---   |     ---     |
| GET | /visitors | Fetches all visitors * |
| GET | /visitors/:username | Fetches a single visitor * |
| PUT | /visitors/:username | Updates specific visitor * |
| DELETE | /visitors/:username | Deletes visitor * |

<br>

**Posts** 
| Method | Endpoint | Description |
|  :---: |    ---   |     ---     |
| GET | /posts | Fetches all posts |
| GET | /posts/:id | Fetches all posts from specific author * |
| POST | /posts | Create post * |
| PUT | /posts/:authorId/:postId | Edit post * |
| DELETE | /posts/:id | Unpublishes specific post * |

<br>

**Comments** 
| Method | Endpoint | Description |
|  :---: |    ---   |     ---     |
| GET | /posts/:postId/comments | Fetches all comments from post's ID |
| POST | /posts/:postId/comments | Creates comments by visitor * |
| DELETE | /posts/:postId/comments/:commentId | Deletes specific comment * |

Description marked with "*" are authenticated routes.



## :cd: Install :cd:

1. Clone the repository
```bash
$ git clone https://github.com/smkakitani/odin-blog-API-backend.git
``` 

2. Go into the repository
```bash
$ cd odin-blog-API-backend
``` 

3. Install dependencies
```bash
$ npm install
``` 

4. Create a file named .env (for environment variables) in the root and set the variables
```bash
$ touch .env
``` 
```
# .env file
PORT=8080
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE"
LOCAL_HOST="http://localhost:5173"
SECRET_SESSION="supersecretsecret"
```

5. Seed the database
```bash
$ npx prisma migrate dev
```

5. Run the app
```bash
$ node --watch src/app.js
``` 

You can install and run the [Front-end's repository](https://github.com/smkakitani/odin-blog-API-frontend) to have a better view

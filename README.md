# Blog REST API 
REST API built with Node.js/Express. The project is based on RESTful API design and MVC architecture pattern.

This project was created following [The Odin Project - Project: Blog API](https://www.theodinproject.com/lessons/node-path-nodejs-blog-api) lesson.

## :hammer_and_wrench: Tech Stack :hammer_and_wrench: 

+ Runtime: Node.js
+ Framework: Express
+ Database: PostgreSQL
+ ORM: Prisma
+ Authentication: Passportjs, JWT
+ Validation: express-validator
+ Security: bcrypt, cors
+ Endpoint test: Postman


## :scroll: Features :scroll:

+ User type: Blog's author and user
+ User log in - authentication using JSON Web Token
+ Create, read, update and delete - for posts, comments and users
+ Input validation and password hashing

## :flying_saucer: Example on endpoints :flying_saucer:

| method | endpoint | description |
|  :---: |    ---   |     ---     |
| GET | /posts | Get all posts |
| GET | /posts/:postId | Get post by id |
| POST | /posts | Create post |
| PUT | /posts/:authorId/:postId | Edit post |

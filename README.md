# Node.js API backend challenge

## Functional Requirements
Build a service in Node.js that exposes an API which can be consumed from any client.
This service must check how many video streams a given user is watching and prevent a user
from watching more than 3 video streams concurrently.

## Considerations
- Multiple users can login with the same account from different devices
- It is permitted for an account to have multiple active sessions but no more than three active sessions can watch content simultaneously
- For this case a content session is considered to be active beginning since the user requests the source of the content until the user stops playing it (default to 10 seconds for this project)

## Design and scalability

### Infrastructure
![infrastructure](./assets/images/infra.png?raw=true)

### Services

The backend consists of three services: 
- User Service: manage user accounts
- Content Service: serve the video content - doesn’t manage authentication
- Session Service: authenticate requests and manage users’ sessions, included content access

![services](./assets/images/services.png?raw=true)

For this case I feel more appropriate to go with a microservices approach because:
- we don’t manage scaling with serverless and thus didn’t feel appropriate to use for this challenge
- we need a session management service with custom management so it is more convenient to manage the service directly
- considering a large scale usage, running a serverless infrastructure may be more expensive
we could reuse the same services for other applications
- it is more customizable

In this case we would scale the services individually. Taking in consideration that database services are hosted in third-party infrastructures, the only service to scale is the Node.js application.
There are multiple ways to scale it depending on the environment: 
- we could host the service in a EC2 environment and scale it with auto scaling groups and cloudwatch using parameters like CPU usage or request-per-second
- we could host the service in a Kubernetes environment and let the HPA (Horizontal Pod Autoscaler) handle the scaling, setting the same scaling parameters as above

In both cases, the API should be sitting behind a load balancer which should redirect the request to the most free nodes.


## Local environment
To spawn a complete environment of the backend, first create a `.env` file:
```bash
$ cp .env.example .env
```

then, run:
```bash
$ docker-compose up --build
```

If you are not using `docker-compose`, make sure you have `mongo` and `redis` services running on their respective ports:

```bash
$ docker run -p 27017:27017 -d mongo
$ docker run -p 6379:6379 -d redis:alpine
```

Then, run the server in development mode:

```bash
$ npm run dev
```
## Examples
Create a user (sign up):
```bash
curl -X POST http://0.0.0.0:9000/users -i -d "email=test@example.com&password=123456"
```

It will return something like:
```bash
HTTP/1.1 201 Created
...
{
  "id": "57d8160eabfa186c7887a8d3",
  "name": "test",
  "picture":"https://gravatar.com/avatar/55502f40dc8b7c769880b10874abc9d0?d=identicon",
  "email": "test@example.com",
  "createdAt": "2016-09-13T15:06:54.633Z"
}
```

Authenticate the user (sign in):
```bash
curl -X POST http://0.0.0.0:9000/auth -i -u test@example.com:123456
```

It will return something like:
```bash
HTTP/1.1 201 Created
...
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9[...]",
  "user": {
    "id": "57d8160eabfa186c7887a8d3",
    "name": "test",
    "picture": "https://gravatar.com/avatar/55502f40dc8b7c769880b10874abc9d0?d=identicon",
    "email": "test@example.com",
    "createdAt":"2016-09-13T15:06:54.633Z"
  }
}
```

Now you can use the JWT token to call the content API. For example, you can get all the available content API using:
```bash
curl -X GET http://0.0.0.0:9000/content -i -d "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9[...]"
```

It will return the content list.

Grab a content ID and "play" it:
```bash
curl -X GET http://0.0.0.0:9000/content/607c55840e977203b4d8b5e5/play -i -d "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9[...]"
```

## Commands

```bash
npm test # test using Jest
npm run coverage # test and open the coverage report in the browser
npm run lint # lint using ESLint
npm run dev # run the API in development mode
npm run docs # generate API docs
```

## Directory structure

### Overview

```
src/
├─ api/
│  ├─ user/
│  │  ├─ controller.js
│  │  ├─ index.js
│  │  ├─ index.test.js
│  │  ├─ model.js
│  │  └─ model.test.js
│  └─ index.js
├─ services/
│  ├─ express/
│  ├─ mongoose/
│  ├─ passport/
│  └─ custom-service/
├─ app.js
├─ config.js
└─ index.js
```

### Credits
The API scaffold was generated with [generator-rest](https://github.com/diegohaz/generator-rest)
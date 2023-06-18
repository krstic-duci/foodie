# Installation
In order to install project locally please
- Install postgresql
```bash
brew install postgresql@14
```
- Make new file `.env` inside `server` root folder with dummy values following `.env.example` structure

# Running
1. Run below in the root to install both server and client
```
npm install
```

2. Run in the root to start both server and client
```
npm run dev
```

3. To run only backend services, navigate to `server` folder and run
```
npm start
```

4. To run only frontend services, navigate to `client` folder and run
```
npm start
```

5. to be continued...

# TODO

1. Server

  - [ ] auth mechanism either authorization token or cookie (access token in header while refresh token in cookie as httpOnly)
  - [ ] why JWT usage for accessToken and not some uuid
  - [ ] how to keep user logged in after accessToken expires
  - [ ] .env secrets or docker secrets
  - [ ] pgAdmin

2. Client

  - [ ] protected vs unprotected routes
  - [ ] auth context after user login
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

NOTE: this project assumes you have `postgresql` installed locally, please
edit settings in `server/src/utils/appDataSource.ts` with your local database
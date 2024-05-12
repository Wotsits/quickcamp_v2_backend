# Setup

## After Clone

1) Create a `.env` file at the root of this repo.  
2) Add the following env variables: 
    - `DATABASE_URL="file:./dev.db"`
    - `JWTSECRET="{JWT encyption string here}"`
    - `REFRESHTOKENSECRET="{refresh encryption string here}"`
    - `PORT=3001`
3) Follow steps 2 to 5 below.


## After making changes to prisma schema

1) delete ./prisma/dev.db to delete the DB instance.
2) run `npx prisma migrate dev` to migrate the DB changes.
3) run `npm run build` to busild distribution folder.
4) run `node ./dist/mockData/generateTestData.js` to seed the DB with test data.
5) restart server with `node ./dist/index.js`.

# Pagination

Pagination settings are set in the `settings.ts` file.  A piece of middleware is used to protect every endpoint where pagination is an option to ensure that maximum page sizes are observed. 
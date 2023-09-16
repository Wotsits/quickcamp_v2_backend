# Setup

## After making changes to prisma schema

- delete ./prisma/dev.db to delete the DB instance.
- run `npx prisma migrate dev` to migrate the DB changes.
- run `npm run build` to busild distribution folder.
- run `node ./dist/generateRestData.js` to seed the DB with test data.
- restart server with `node ./dist/index.js`.
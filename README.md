# Setup

## After making changes to prisma schema

- delete ./prisma/dev.db to delete the DB instance.
- run `npx prisma migrate dev` to migrate the DB changes.
- run `npm run build` to busild distribution folder.
- run `node ./dist/generateRestData.js` to seed the DB with test data.
- restart server with `node ./dist/index.js`.

# Pagination

Pagination settings are set in the `settings.ts` file.  A piece of middleware is used to protect every endpoint where pagination is an option to ensure that maximum page sizes are observed. 
# Routed Server

## Docker-based Development Setup

1. Download and install Docker for your platform

2. Clone this repo, copy the example.env file to .env and fill in empty variables, if any.

3. Run:

   ```
   docker compose up
   ```

   Wait a while for container images to download/build, then when everything is up
   and running, you can view the site in your browser:

   http://localhost:3000/

4. To log in to the running server container:

   ```
   docker compose exec server bash -l
   ```

   After you log in, you can create your database by changing into the server dir and running:

   ```
   cd server
   sequelize db:create
   ```

   Execute any pending database migrations by running:

   ```
   sequelize db:migrate
   ```

   Seed the database with hospitals and test users by running:

   ```
   sequelize db:seed:all
   ```

   The test users include (email/password):

   batsadmin@c4sf.me/abcd1234 (a Superuser)

   op.healthcare@c4sf.me/abcd1234 (an operational Healthcare user)

   op.ems@c4sf.me/abcd1234 (an operational EMS user)

   If you wish to inspect the db, you can run:

   ```
   psql $DATABASE_URL
   ```

## Server Testing

1. Log in to a running server container as above.

2. Make sure the test database is created, and run migrations on it:

   ```
   cd server
   sequelize db:create --env test
   sequelize db:migrate --env test
   ```

   During development, you may be working on migrations and you will need to undo and rerun
   migrations- make sure to do that on the test database as well.

   ```
   sequelize db:migrate:undo --env test
   sequelize db:migrate --env test
   ```

3. Run the server tests:

   ```
   yarn test:server
   ```

# License

Routed Server
Copyright (C) 2022 Code for San Francisco

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

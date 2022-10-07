# Routed Server

## Docker-based Development Setup

1. Download and install Docker for your platform

2. Clone this repo, copy the `example.env` file to `.env` and fill in empty variables, if any.

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

   The development server will automatically set up the database on first startup.

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

## Generating screenshots and user guides

The `user-guides` sub-package uses [Playwright](https://playwright.dev/) to automatically generate screenshots for the Routed user guides.

The `build` npm script in the `user-guides` package generates the screenshots for each guide from its script in `user-guides/guides`. Each script includes the instructions for putting the app UI into different states, and then takes screenshots at the appropriate time.

The guide scripts expect to be able to connect to the app running on `localhost`, which must be launched with the `docker:start` script in the top-level package before generating any screenshots.

The scripts use usernames and passwords specified in the `.env` file to login as different users:

- `EMS_USER`
- `EMS_PASS`
- `HOSPITAL_USER`
- `HOSPITAL_PASS`

The `upload` script runs through the images in the `user-guides/build` directory and checks them against the image assets in Contentful. If the images have changed or don't exist, they're uploaded. The script also generates a rich text version of the user guide if it doesn't exist yet, which links the screenshot assets to a text description of each step.

The upload process checks the `.env` file to get the space ID of the Routed site on Contentful. To enable the script to use the Contentful API to upload and download assets, a personal access token must be generated on Contentful and included in `.env`:

- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_PAT`

### Playwright installation

After the npm packages for `user-guides` have been installed, manually run:

```
npx playwright install chromium
```

This will install the Chromium binary for the version of Playwright specified in the `package.json` file.

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

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

## Two-factor Authentication Testing

   The following test users require 2FA to log in (email/password):

   mission.bernal.er@c4sf.me/abcd1234 (an operational Healthcare user)

   amr.user@c4sf.me/abcd1234 (an operational EMS user)

   If you are running the docker images as instructed above, MailCatcher should be running an SMTP server that will receive 2FA emails with the requested codes. Go to http://localhost:1080/ to see your local inbox, and check [MailCatcher's documentation](https://mailcatcher.me/) if you run into problems.

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

### Playwright installation

After the npm packages for `user-guides` have been installed, manually run:

```
npx playwright install chromium
```

This will install the Chromium binary for the version of Playwright specified in the `package.json` file.

### `.env` file setup

The user guide scripts expect certain values to be supplied by the environment. For instance, they will look up usernames and passwords specified in the `.env` file to login as different users:

- `EMS_USER`
- `EMS_PASS`
- `HOSPITAL_USER`
- `HOSPITAL_PASS`

The upload process also checks the `.env` file to get the space ID of the Routed site on Contentful. To enable the script to use the Contentful API to upload and download assets, a personal access token must be generated on Contentful and included in `.env`:

- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_PAT`

### Creating guide scripts

Each user guide is created by an individual script in `user-guides/guides`. The filename should start with the app name, like `ems-` or `hospital-`, and use kebab-case. The script filename, minus the extension, is used as the name of the directory into which the screenshots are exported. It's also used for the `slug` value of the `userGuide` entry on Contentful, which is how the Gatsby site identifies the guide.

The `script` array that's exported by each guide contains a list of steps that are executed to generate the screenshots needed for that guide. Each step is an array or function that provides a simplified version of the Playwright script syntax. The array steps generally specify a selector string and the name of a method to perform on the selected element. The default method is `fill()` and doesn't need to be spelled out, but other methods can be used as well:

- Fill a field labeled `ETA`: `['"ETA"', 12]`
- Click a button: `['"Select Hospital"', ['click']]`
- Don't include a selector to call a method on the `page` object, and pass arguments as additional array items: `[['waitForTimeout', 500]]`

A step can also be a function, which will be called with a hash of utility functions that can be used as needed. For instance, `({ screenshot }) => screenshot()` will generate an automatically named and numbered screenshot of the current state of the app.

Pass a string to specify the text of that step in the guide: `({ screenshot }) => screenshot('Click the Ringdown tab to send a new ringdown to a hospital.')`. The guide tool will use these strings to generate a rich text version of the user guide if it doesn't exist yet. The screenshot asset will be linked to this text description of the step, which is easier than inserting the images into an ordered list in Contentful's finicky rich text editor.

The guide scripts expect to be able to connect to the app running on `localhost`, which must be launched with the `docker:start` script in the top-level package before generating any screenshots.

The `build` npm script in the `user-guides` package will generate each guide from its script, and output the screenshots to the `build` directory.

The `upload` npm script runs through the images in the `user-guides/build` directory and checks them against the image assets in Contentful. If the images have changed or don't exist, they're uploaded.

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

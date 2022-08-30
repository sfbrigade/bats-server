# Bed Availability Transport Study Server

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

   After you log in, you can create your database by running:

   ```
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

   You can also run the script commands set up by Create React App after logging in.

## Server Testing

1. Log in to a running server container as above.

2. Make sure the test database is created, and run migrations on it:

   ```
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

Bed Availability Transport Study Server
Copyright (C) 2021 Code for San Francisco

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

# Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

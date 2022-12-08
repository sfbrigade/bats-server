const fs = require('fs/promises');
const { execSync } = require('child_process');

const execOptions = {
  cwd: '../server',
  encoding: 'utf8',
};
const resetCommands = `
  sequelize db:drop
  sequelize db:create
  sequelize db:migrate
`
  .split(/\s*\n\s*/)
  .filter((s) => s);
// this is the beginning of the filename of the first seeder file that we want to skip
const ringdownSeedDate = '20210204001430';

function seedCommand(seederNames, path) {
  const command = ['sequelize db:seed', '--seed', ...[].concat(seederNames)];

  if (path) {
    command.push('--seeders-path', path);
  }

  return command.join(' ');
}

// additional seeders to run after the db is reset can be passed as arguments
const seedsArg = process.argv.slice(2);

// prettier-ignore
(async () => {
  const allSeeds = (await fs.readdir('../server/seeders')).join('\n');
  // get all the seeders up to the one that creates some default, unacknowledged ringdowns, which we only want in some cases
  const initialSeeds = allSeeds
    .slice(0, allSeeds.indexOf(ringdownSeedDate) - 1)
    .split('\n');
  const commands = [
    ...resetCommands,
    seedCommand(initialSeeds),
  ];

  if (seedsArg.length) {
    // these commands will be run with /server as the CWD, so we need a path to the user guide seed files
    commands.push(seedCommand(seedsArg, '../user-guides/seeders'));
  }

  const result = execSync(commands.join('\n'), execOptions);

  console.log(result);
})();

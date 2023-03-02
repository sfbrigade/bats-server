module.exports = {
  stories: [
    {
      directory: '../src/stories',
      titlePrefix: 'Routed',
    },
  ],
  staticDirs: ['../public', '../build'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions', '@storybook/preset-create-react-app'],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
};

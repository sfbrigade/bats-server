const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const path = require('path');

module.exports = {
  webpack: {
//    plugins: {
//      remove: ["ModuleScopePlugin"]
//    }

    configure: (config) => {
      const plugin = config.resolve.plugins.find((plugin) => plugin instanceof ModuleScopePlugin);
      plugin.allowedFiles.add(path.resolve('../shared/convertToPropType'));
      plugin.allowedFiles.add(path.resolve('../shared/metadata'));
      plugin.allowedFiles.add(path.resolve('../shared/metadata/patient'));
      plugin.allowedFiles.add(path.resolve('../shared/constants/DeliveryStatus'));
      return config;
    },
  },
};

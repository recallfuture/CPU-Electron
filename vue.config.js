module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        appId: "space.recallsufutrue.cpu",
        productName: "CPU模拟器",
        copyright: "Copyright © 2019 su",

        win: {
          target: [
            {
              target: "nsis",
              arch: ["ia32"]
            }
          ]
        }
      }
    }
  }
};

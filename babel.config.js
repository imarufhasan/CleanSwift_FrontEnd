module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // If you already use Reanimated, keep its plugin here too, LAST.
      "react-native-reanimated/plugin",
    ],
  };
};

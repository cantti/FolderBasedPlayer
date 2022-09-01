const fs = require("fs/promises");
const os = require("os");
const path = require("path");

module.exports = async function (event, ...paths) {
  if (paths.length === 0) {
    paths = [os.homedir()];
  }

  const finalPath = path.normalize(path.join(...paths));

  const entries = (await fs.readdir(finalPath, { withFileTypes: true })).filter(
    (x) => x.name[0] !== "."
  );

  const files = entries
    .filter((x) => !x.isDirectory())
    .filter((x) => path.extname(x.name).toLowerCase() === ".mp3")
    .map((x) => {
      const filePath = path.join(finalPath, x.name);
      const extension = path.extname(filePath).substring(1);
      return {
        name: x.name,
        path: filePath,
        extension
      };
    });


  const directories = entries
    .filter((x) => x.isDirectory())
    .map((x) => x.name)
    .sort();

  return { files, directories, currentPath: finalPath };
};

// 批量重命名文件

const fs = require("fs");
const path = require("path");

function transformFileName(filePath) {
  // 获取文件的原始后缀名
  const originalExtName = path.basename(filePath);
  //    // 修改文件的后缀名
  let newExtName = path.join(
    path.dirname(filePath),
    originalExtName.replace(/[^\w\.]/g, "_")
  );
  fs.renameSync(filePath, newExtName);
}

function transformToLowerExt(filePath) {
  // 获取文件的原始后缀名
  const originalExtName = path.extname(filePath);
  console.log(originalExtName);
  //    // 修改文件的后缀名
  let newExtName = path.join(
    path.dirname(filePath),
    originalExtName.replace(/[^\w]/g, "_")
  );
  fs.renameSync(filePath, newExtName);
}

function getFileTree(dir, parent = "") {
  const files = fs.readdirSync(dir);
  const fileTree = {};
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const parentPath = `${parent}/${file}`;

    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      //   transformToLowerExt(filePath);
      transformFileName(filePath);
      fileTree[file] = {
        type: "file",
        parent,
        path: filePath,
      };
    } else if (stats.isDirectory()) {
      fileTree[file] = {
        type: "dir",
        path: filePath,
        parent,
        children: getFileTree(filePath, parentPath),
      };
    }
  });
  return fileTree;
}

getFileTree(path.resolve(__dirname, "../docs/.vuepress/public/images"));

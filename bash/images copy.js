const fs = require("fs");
const path = require("path");

let basepath = path.resolve(__dirname, "../docs/.vuepress/public"); //解析目录路径
let generatePath = path.resolve(__dirname, "../docs"); //生成文件路径

// function readImg(p, floor = 1) {
//   console.log("🚀 ~ file: images.js:8 ~ readImg ~ p:", p);
//   //   fs.mkdirSync(fileDir, { recursive: true });
//   //   fs.writeFileSync(filePath, `${tree}`);
//   fs.readdirSync(p).forEach((dirname) => {
//     const joinPath = path.join(p, dirname);
//     const isFile = fs.lstatSync(joinPath).isFile();
//     const fileDir = path.join(generatePath, dirname);
//     const filePath = path.join(fileDir, "index.md");

//     let tree = floor === 1 ? `# 顶级目录` : `# ${p} \n`;
//     if (isFile) {
//     } else {
//       tree += `\n[${dirname}](/${dirname})`;
//       fs.mkdirSync(fileDir, { recursive: true });
//       fs.writeFileSync(filePath, `${tree}`);
//       //   readImg(joinPath);
//     }
//   });
// }

// readImg(basepath);

// fs.readdir(__dirname, (err, files) => {
//   if (err) {
//     throw err;
//   }
//   files.forEach((file) => {
//     console.log(file);
//   });
// });
// // ``` ## 使用node遍历当前目录及子目录 ```
// function travel(dir, callback) {
//   fs.readdirSync(dir).forEach(function (file) {
//     var pathname = path.join(dir, file);
//     if (fs.statSync(pathname).isDirectory()) {
//       travel(pathname, callback);
//     } else {
//       callback(pathname);
//     }
//   });
// }
// travel(".", function (pathname) {
//   console.log(pathname);
// });

function transformChild({ children, dirname, dirLink ,parent}) {
  const str = Object.entries(children).reduce((acc, [k, v]) => {
    const {
      type,
      targetPath,
      fileName,
      fileLink,
      dirLink,
      filePath,
      dirname,
      targetFile,
    } = v;
    const isFile = type == "file";

    return (
      acc +
      (isFile
        ? `\n ![${k}](${fileLink}) \n`
        : `
        \n ## ${k}
        \n [${k}](${dirLink}) \n`)
    );
  }, `# 返回上一页\n [${parent}](${parent}) \n`);
  return str;
}
function getFileTree(dir, target, parent = "") {
  console.log("🚀 ~ file: images.js:79 ~ getFileTree ~ target:", parent);
  const files = fs.readdirSync(dir);
  const fileTree = {};
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const targetPath = path.join(target, file);
    const parentPath = `${parent}/${file}`;
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      fileTree[file] = {
        type: "file",
        path: filePath,
        fileLink: filePath.replace(basepath, ""),
      };
    } else if (stats.isDirectory()) {
      fileTree[file] = {
        type: "dir",
        path: filePath,
        parent: parentPath,
        dirLink: filePath.replace(basepath, ""),
        targetPath,
        targetFile: path.join(targetPath, "index.md"),
        children: getFileTree(filePath, targetPath, parentPath),
      };
    }
  });
  return fileTree;
}

function writeFile(fileTree) {
  Object.entries(fileTree).forEach(([k, v]) => {
    // console.log("🚀 ~ file: images.js:53 ~ Object.entries ~ k,v:", k);
    const { targetFile, targetPath, children, type, path } = v;
    // console.log("🚀 ~ file: images.js:110 ~ Object.entries ~ type:", type);

    // console.log("🚀 ~ file: images.js:54 ~ Object.entries ~ target:", targetFile);

    // if (k === "images") {
    //   fs.mkdirSync(path, { recursive: true });
    //   fs.writeFileSync(targetFile, `# 等级目录\n${transformChild(v)}`);
    // }
    if (type == "dir") {
      fs.mkdirSync(targetPath, { recursive: true });
      fs.writeFileSync(targetFile, `\n${transformChild(v)}`);
      writeFile(children);
    }
  });
}
fs.writeFileSync(
  "../sss1.json",
  JSON.stringify(getFileTree(basepath, generatePath))
);
writeFile(getFileTree(basepath, generatePath));

// fs.writeFileSync(path.join(generatePath, "dd.md"), JSON.stringify(fileTree));
// console.log(JSON.stringify(fileTree));

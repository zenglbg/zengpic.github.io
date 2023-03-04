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

function transformChild({ children }) {
  //   console.log("🚀 ~ file: images.js:54 ~ transformChild ~ parent:", parent);
  //   const _parent = parent ? parent : "/images";
  const str = Object.entries(children).reduce((acc, [k, v]) => {
    const { type, parent, targetFile } = v;

    const isFile = type == "file";
    if (isFile) {
      return (
        acc +
        (/(mp4)/gi.test(k)
          ? ` \n [${k}](${parent}/${k}) \n`
          : `\n ![${k}](${parent}/${k}) \n`)
      );
    } else {
      return acc + `\n ## ${k}\n [${k}](${parent.split("/").join("")}${k}) \n`;
    }
  }, `# 返回上一页\n   \n`);
  return str;
}

function transformToLowerFile(filePath) {
  // 获取文件的原始后缀名
  const originalExtName = path.extname(filePath);
  //    // 修改文件的后缀名
  let newExtName = path.join(
    path.dirname(filePath),
    path.basename(filePath, originalExtName) + originalExtName.toLowerCase()
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
      transformToLowerFile(filePath);

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

function writeFile(fileTree) {
  //   console.log("🚀 ~ file: images.js:104 ~ writeFile ~ fileTree:", fileTree);
  //   console.log(fileTree.images.children["2019145_15722"].targetFile);
  Object.entries(fileTree).forEach(([k, v]) => {
    const { parent, type, children } = v;

    if (type == "dir") {
      console.log(
        "🚀 ~ file: images.js:115 ~ Object.entries ~ parent:",
        parent,
        k
      );

      //   console.log("🚀 ~ file: images.js:119 ~ Object.entries ~ k, v:", k, v);
      fs.writeFileSync(
        `${generatePath}/${parent.split("/").join("")}${k}.md`,
        `\n${transformChild(v)}`
      );
      //   writeFile(children);
    }
    if (children) {
      writeFile(children);
    }
    // if (type == "dir") {
    //   //   fs.mkdirSync(targetPath, { recursive: true });
    //   fs.writeFileSync(targetFile, `\n${transformChild(v)}`);
    //   writeFile(children);
    // }
  });
}
console.log(getFileTree(basepath));
writeFile(getFileTree(basepath));

// fs.writeFileSync(path.join(generatePath, "dd.md"), JSON.stringify(fileTree));
// console.log(JSON.stringify(fileTree));

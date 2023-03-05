const fs = require("fs");
const path = require("path");

let basepath = path.resolve(__dirname, "../docs/.vuepress/public"); //解析目录路径
let generatePath = path.resolve(__dirname, "../docs"); //生成文件路径
 
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
 
function getFileTree(dir, parent = "") {
  const files = fs.readdirSync(dir);
  const fileTree = {};
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const parentPath = `${parent}/${file}`;

    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
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

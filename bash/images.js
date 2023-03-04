const path = require('path')
const glob = require('glob')
const fs = require('fs')
const $ = require('gogocode');
const html = require('./html')
const rootDist = path.resolve(__dirname, '../images')


data = {}
function read(p) {
    const { length } = arrs = p.split('/');
    fs.readdirSync(p).forEach(d => {
        if (fs.lstatSync(path.join(p, d)).isFile()) {
            if (arrs[length - 1] === 'images') {
                if (Array.isArray(data['index'])) {
                    data["index"].push(`https://pic.zlbg.cc/images/${d}`);
                } else {
                    data["index"] = [`https://pic.zlbg.cc/images/${d}`];
                }
            } else {
                console.log(p);
                if (Array.isArray(data[arrs[length - 1]])) {
                    data[arrs[length - 1]].push(
                      `https://pic.zlbg.cc/${arrs
                        .slice(arrs.indexOf("images"), length)
                        .join("/")}/${d}`
                    );
                } else {
                    data[arrs[length - 1]] = [
                      `https://pic.zlbg.cc/${arrs
                        .slice(arrs.indexOf("images"), length)
                        .join("/")}/${d}`,
                    ];
                }
            }
        } else {
            read(path.join(p, d))
        }
    })
}
read(rootDist)

function getLi(images) {
    Object.keys(images).forEach((image, index, arr) => {
        html.replace(path.resolve(__dirname, `../${image}.html`), html.getHtml(
            {
                children: `
                    <ul>
                        ${arr.map(a => `<li><a href="/${a}.html" alt="${a}">${a}</a></li>`).join('')}
                    </ul>
                ` + images[image].map(i => {
                    return `<li style="width: 100%">
                        <p>${i}</p>
                        <img style="width: 100%" src="${i}" alt="${i}" />
                    </li>`
                }).join(''),
                title: image
            }
        ))
    })
}

getLi(data)


const shelljs = require('shelljs')
const path = require('path')
const glob = require('glob')
const fs = require('fs')
const $ = require('gogocode');

els = []
const fix = ["PNG", "JPG", "png", 'jpg', 'jpeg']
fix.forEach(fix => {

    glob.sync(path.resolve(__dirname, `../images/**/*.${fix}`)).forEach(file => {
        const filename = file.split('images')
        els.push(`
         <li style="width: 100%">
             <img style="width: 100%" src="https://pic.zenglbg.com/images${filename[filename.length - 1]}" />
         </li>
        `)
    })

})

function replace(file) {
    fs.writeFileSync(file, `
        <!doctype html>
        <html lang="en">
        <head>
            <meta charset="UTF-8"/>
            <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>images</title>
        </head>
        <body>
            <ol style="width: 100%">
                ${els.join('')}
            </ol>
        </body>
        </html>
    `, console.log);
}

replace(path.resolve(__dirname, '../index.html'))


shelljs.exec(`git add . && git commit -m '添加图片' && git push`)




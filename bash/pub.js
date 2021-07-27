const shelljs = require('shelljs')
const path = require('path')
const glob = require('glob')
const fs = require('fs')
const $ = require('gogocode');

els = []
const fix = ["PNG", "JPG", "png", 'jpg']
fix.forEach(fix => {

    glob.sync(path.resolve(__dirname, `../images/**/*.${fix}`)).forEach(file => {
        const filename = file.split('images')
        els.push(`
         <li>
             <img src="https://pic.zenglbg.com/images/${filename[filename.length - 1]}" />
         </li>
        `)
    })

})

function replace(file) {
    const newCode = $.loadFile(file, {
        parseOptions: {
            language: 'html'
        }
    }).replace('<ol></ol>', `<ol>
        ${els.join('')}
    </ol>`).generate()

    fs.writeFileSync(file, newCode, console.log);
}

replace(path.resolve(__dirname, '../index.html'))


shelljs.exec(`git add . && git commit -m '添加图片' && git push`)




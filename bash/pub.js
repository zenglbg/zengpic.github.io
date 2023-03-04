const shelljs = require('shelljs')
require('./images')

function pub() {
    shelljs.exec(`git add . && git commit -m '添加图片' && git push`)
}


pub()
const fs = require('fs')

module.exports = {
    getHtml({ children, title }) {
        return `
            <!doctype html>
            <html lang="en">
            <head>
                <meta charset="UTF-8"/>
                <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>${title}</title>
            </head>
            <body>
                <ol style="width: 100%">
                    ${children}
                </ol>
            </body>
            </html>
        `

    },




    replace(file, newCode) {
        fs.writeFileSync(file, newCode, console.log);
    }

}
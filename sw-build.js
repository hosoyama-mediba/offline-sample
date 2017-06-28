const fs = require('fs');

const src = `${__dirname}/sw-template.js`;
const dist = `${__dirname}/docs/sw.js`;
const publish = template => template.replace(/<%\s*chacheId\s*%>/, new Date().getTime());

fs.readFile(src, 'utf8', (err, template) => {
    fs.writeFile(dist, publish(template));
});

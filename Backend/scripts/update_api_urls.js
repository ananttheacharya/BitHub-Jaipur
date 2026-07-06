const fs = require('fs');
const path = require('path');

const srcDir = path.resolve('C:/Users/anant/Downloads/NEW BITHUB/BitHuB/BitHuB Jaipur/Front-End New/src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            results.push(fullPath);
        }
    });
    return results;
}

const files = walk(srcDir);
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    if (content.includes("fetch('/api/")) {
        content = content.replace(/fetch\('\/api\//g, "fetch((import.meta.env.VITE_API_BASE_URL || '') + '/api/");
        modified = true;
    }

    if (content.includes("fetch(`/api/")) {
        content = content.replace(/fetch\(`\/api\//g, "fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/");
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        console.log("Updated API URLs in: " + file);
    }
});

import fs from 'fs';
export function getAll(type) {
    const data = fs.readFileSync(`data/tbl${type}.json`, 'utf8');
    return JSON.parse(data);
}

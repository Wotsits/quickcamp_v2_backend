import fs from 'fs';
export function getOne(type, id) {
    const data = fs.readFileSync(`data/tbl${type}.json`, 'utf8');
    const json = JSON.parse(data);
    return json.find((thing) => thing.id === id);
}

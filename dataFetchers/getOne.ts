import fs from 'fs'

export function getOne(type: string, id: number) {
    const data = fs.readFileSync(`data/tbl${type}.json`, 'utf8')
    const json = JSON.parse(data)
    return json.find((thing: {id: number}) => thing.id === id)
}
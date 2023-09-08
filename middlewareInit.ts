
import {Express} from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser'

export function middlewareInit(app: Express, express: any) {
    app.use(cors());
    // parse requests of content-type - application/json
    app.use(express.json())
    // parse requests of content-type - application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
}


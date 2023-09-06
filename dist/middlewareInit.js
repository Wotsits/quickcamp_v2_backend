import cors from 'cors';
import cookieSession from 'cookie-session';
export function middlewareInit(app, express, jwtSecret) {
    app.use(cors());
    // parse requests of content-type - application/json
    app.use(express.json());
    // parse requests of content-type - application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieSession({
        name: "bezkoder-session",
        keys: [jwtSecret],
        httpOnly: true,
    }));
}

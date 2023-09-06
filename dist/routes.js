import { getAll } from './dataFetchers/getAll.js';
import { getOne } from './dataFetchers/getOne.js';
export function routesInit(app) {
    app.get("/", (req, res) => {
        res.json({ message: "Express + TypeScript Server" });
    });
    // TENANTS
    app.get("/tenants", (req, res) => {
        // return all tenants here, paginated.
        const data = getAll('Tenants');
        res.json(data);
    });
    app.get("/tenants/:id", (req, res) => {
        // return tenant by id here.
        const id = parseInt(req.params.id);
        const data = getOne('Tenants', id);
        res.json(data);
    });
    // SITES
    app.get("/sites", (req, res) => {
        // return all sites here, paginated.
        const data = getAll('Sites');
        res.json(data);
    });
    app.get("/sites/:id", (req, res) => {
        // return site by id here.
        const id = parseInt(req.params.id);
        const data = getOne('Sites', id);
        res.json(data);
    });
    // USERS
    // UNITTYPES
    app.get("/unit-types", (req, res) => {
        // return all unit-types here, paginated.
        const data = getAll('UnitTypes');
        res.json(data);
    });
    app.get("/unit-types/:siteId", (req, res) => {
        // return unit-types by site id here, paginated.
    });
    app.get("/unit-types/:id", (req, res) => {
        // return unit-type by id here.
        const id = parseInt(req.params.id);
        const data = getOne('UnitTypes', id);
        res.json(data);
    });
    // UNITS
    app.get("/units", (req, res) => {
        // return all units here, paginated.
        const data = getAll('Units');
        res.json(data);
    });
    app.get("/units/:unitTypeId", (req, res) => {
        // return units by unitTypeId here, paginated.
    });
    app.get("/units/:id", (req, res) => {
        // return unit by id here.
        const id = parseInt(req.params.id);
        const data = getOne('Units', id);
        res.json(data);
    });
    // GUESTS
    app.get("/guests", (req, res) => {
        // return all guests here, paginated.
        const data = getAll('Guests');
        res.json(data);
    });
    app.get("/guests/:id", (req, res) => {
        // return guest by id here.
        const id = parseInt(req.params.id);
        const data = getOne('Guests', id);
        res.json(data);
    });
    // VEHICLES
    app.get("/vehicles", (req, res) => {
        // return all vehicles here, paginated.
        const data = getAll('Vehicles');
        res.json(data);
    });
    app.get("/vehicles/:id", (req, res) => {
        // return vehicle by id here.
        const id = parseInt(req.params.id);
        const data = getOne('Vehicles', id);
        res.json(data);
    });
    // PETS
    app.get("/pets", (req, res) => {
        // return all pets here, paginated.
        const data = getAll('Pets');
        res.json(data);
    });
    app.get("/pets/:id", (req, res) => {
        // return pet by id here.
        const id = parseInt(req.params.id);
        const data = getOne('Pets', id);
        res.json(data);
    });
    // BOOKINGS
    app.get("/bookings", (req, res) => {
        // return all bookings here, paginated.
        const data = getAll('Bookings');
        res.json(data);
    });
    app.get("/bookings/:id", (req, res) => {
        // return booking by id here.
        const id = parseInt(req.params.id);
        const data = getOne('Bookings', id);
        res.json(data);
    });
    // PAYMENTS
    app.get("/payment", (req, res) => {
        // return all payments here, paginated.
        const data = getAll('Payments');
        res.json(data);
    });
    app.get("/payment/:id", (req, res) => {
        // return payments by id here.
        const id = parseInt(req.params.id);
        const data = getOne('Payments', id);
        res.json(data);
    });
    app.get("/payment/:bookingId", (req, res) => {
        // return payments by bookingId here, paginated.
    });
}

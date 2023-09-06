import {Express, Request, Response} from 'express'
import { getAll } from './dataFetchers/getAll.js';
import { getOne } from './dataFetchers/getOne.js';

export function routesInit(app: Express) {

  app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Express + TypeScript Server" });
  });

  // TENANTS

  app.get("/tenants", (req: Request, res: Response) => {
    // return all tenants here, paginated.
    const data = getAll('Tenants');
    res.json(data)
  });

  app.get("/tenants/:id", (req: Request, res: Response) => {
    // return tenant by id here.
    const id = parseInt(req.params.id);
    const data = getOne('Tenants', id);
    res.json(data)
  });

  // SITES

  app.get("/sites", (req: Request, res: Response) => {
    // return all sites here, paginated.
    const data = getAll('Sites');
    res.json(data)
  });

  app.get("/sites/:id", (req: Request, res: Response) => {
    // return site by id here.
    const id = parseInt(req.params.id);
    const data = getOne('Sites', id);
    res.json(data)
  });

  // USERS

  // UNITTYPES

  app.get("/unit-types", (req: Request, res: Response) => {
    // return all unit-types here, paginated.
    const data = getAll('UnitTypes');
    res.json(data)
  });

  app.get("/unit-types/:siteId", (req: Request, res: Response) => {
    // return unit-types by site id here, paginated.
  });

  app.get("/unit-types/:id", (req: Request, res: Response) => {
    // return unit-type by id here.
    const id = parseInt(req.params.id);
    const data = getOne('UnitTypes', id);
    res.json(data)
  });

  // UNITS

  app.get("/units", (req: Request, res: Response) => {
    // return all units here, paginated.
    const data = getAll('Units');
    res.json(data)
  });

  app.get("/units/:unitTypeId", (req: Request, res: Response) => {
    // return units by unitTypeId here, paginated.
  });

  app.get("/units/:id", (req: Request, res: Response) => {
    // return unit by id here.
    const id = parseInt(req.params.id);
    const data = getOne('Units', id);
    res.json(data)
  });

  // GUESTS

  app.get("/guests", (req: Request, res: Response) => {
    // return all guests here, paginated.
    const data = getAll('Guests');
    res.json(data)
  });

  app.get("/guests/:id", (req: Request, res: Response) => {
    // return guest by id here.
    const id = parseInt(req.params.id);
    const data = getOne('Guests', id);
    res.json(data)
  });

  // VEHICLES

  app.get("/vehicles", (req: Request, res: Response) => {
    // return all vehicles here, paginated.
    const data = getAll('Vehicles');
    res.json(data)
  });

  app.get("/vehicles/:id", (req: Request, res: Response) => {
    // return vehicle by id here.
    const id = parseInt(req.params.id);
    const data = getOne('Vehicles', id);
    res.json(data)
  });

  // PETS

  app.get("/pets", (req: Request, res: Response) => {
    // return all pets here, paginated.
    const data = getAll('Pets');
    res.json(data)
  });

  app.get("/pets/:id", (req: Request, res: Response) => {
    // return pet by id here.
    const id = parseInt(req.params.id);
    const data = getOne('Pets', id);
    res.json(data)
  });

  // BOOKINGS

  app.get("/bookings", (req: Request, res: Response) => {
    // return all bookings here, paginated.
    const data = getAll('Bookings');
    res.json(data)
  });

  app.get("/bookings/:id", (req: Request, res: Response) => {
    // return booking by id here.
    const id = parseInt(req.params.id);
    const data = getOne('Bookings', id);
    res.json(data)
  });

  // PAYMENTS

  app.get("/payment", (req: Request, res: Response) => {
    // return all payments here, paginated.
    const data = getAll('Payments');
    res.json(data)
  });

  app.get("/payment/:id", (req: Request, res: Response) => {
    // return payments by id here.
    const id = parseInt(req.params.id);
    const data = getOne('Payments', id);
    res.json(data)
  });

  app.get("/payment/:bookingId", (req: Request, res: Response) => {
    // return payments by bookingId here, paginated.
  });
}

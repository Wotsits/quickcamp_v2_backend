import { Express, Request, Response } from "express";
import { getAll } from "../dataFetchers/getAll.js";
import { getOneById } from "../dataFetchers/getOneById.js";
import { Booking, PrismaClient } from "@prisma/client";
import { registerLoginRoute, registerRegisterRoute } from "./auth.js";
import { entityTypes, urls } from "../enums.js";
import { loggedIn } from "../utilities/userManagement/middleware.js";

export function routesInit(
  app: Express,
  prisma: PrismaClient,
  jwtSecret: string
) {
  app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Express + TypeScript Server" });
  });

  // TENANTS

  app.get(urls.TENANTS, loggedIn, async (req: Request, res: Response) => {
    // return all tenants here, paginated.
    const data = await getAll(entityTypes.TENANT, prisma);
    res.json(data);
  });

  app.get(`${urls.TENANTS}/:id`, loggedIn, async (req: Request, res: Response) => {
    // return tenant by id here.
    const id = parseInt(req.params.id);
    const data = await getOneById(entityTypes.TENANT, id, prisma);
    res.json(data);
  });

  // SITES

  app.get(urls.SITES, loggedIn, async (req: Request, res: Response) => {
    // return all sites here, paginated.
    const data = await getAll(entityTypes.SITE, prisma);
    res.json(data);
  });

  app.get(`${urls.SITES}/:id`, loggedIn, async (req: Request, res: Response) => {
    // return site by id here.
    const id = parseInt(req.params.id);
    const data = getOneById(entityTypes.SITE, id, prisma);
    res.json(data);
  });

  // USERS

  registerRegisterRoute(app, prisma);
  registerLoginRoute(app, prisma, jwtSecret);

  // UNITTYPES

  app.get(urls.UNITTYPES, loggedIn, async (req: Request, res: Response) => {
    // return all unit-types here, paginated.
    const data = getAll(entityTypes.UNITTYPE, prisma);
    res.json(data);
  });

  app.get(`${urls.UNITTYPES}/:siteId`, loggedIn, async (req: Request, res: Response) => {
    // return unit-types by site id here, paginated.
  });

  app.get(`${urls.UNITTYPES}/:id`, loggedIn, async (req: Request, res: Response) => {
    // return unit-type by id here.
    const id = parseInt(req.params.id);
    const data = getOneById(entityTypes.UNITTYPE, id, prisma);
    res.json(data);
  });

  // UNITS

  app.get(urls.UNITS, loggedIn, async (req: Request, res: Response) => {
    // return all units here, paginated.
    const data = await getAll(entityTypes.UNIT, prisma);
    res.json(data);
  });

  app.get(`${urls.UNITS}/:unitTypeId`, loggedIn, async (req: Request, res: Response) => {
    // return units by unitTypeId here, paginated.
  });

  app.get(`${urls.UNITS}/:id`, loggedIn, async (req: Request, res: Response) => {
    // return unit by id here.
    const id = parseInt(req.params.id);
    const data = await getOneById(entityTypes.UNIT, id, prisma);
    res.json(data);
  });

  // GUESTS

  app.get(urls.GUESTS, loggedIn, async (req: Request, res: Response) => {
    // return all guests here, paginated.
    const data = await getAll(entityTypes.GUEST, prisma);
    res.json(data);
  });

  app.get(`${urls.GUESTS}/:id`, loggedIn, async (req: Request, res: Response) => {
    // return guest by id here.
    const id = parseInt(req.params.id);
    const data = await getOneById(entityTypes.GUEST, id, prisma);
    res.json(data);
  });

  // VEHICLES

  app.get(urls.VEHICLES, loggedIn, async (req: Request, res: Response) => {
    // return all vehicles here, paginated.
    const data = await getAll(entityTypes.VEHICLE, prisma);
    res.json(data);
  });

  app.get(`${urls.VEHICLES}/:id`, loggedIn, async (req: Request, res: Response) => {
    // return vehicle by id here.
    const id = parseInt(req.params.id);
    const data = await getOneById(entityTypes.VEHICLE, id, prisma);
    res.json(data);
  });

  // PETS

  app.get(urls.PETS, loggedIn, async (req: Request, res: Response) => {
    // return all pets here, paginated.
    const data = await getAll(entityTypes.PET, prisma);
    res.json(data);
  });

  app.get(`${urls.PETS}/:id`, loggedIn, async (req: Request, res: Response) => {
    // return pet by id here.
    const id = parseInt(req.params.id);
    const data = await getOneById(entityTypes.PET, id, prisma);
    res.json(data);
  });

  // BOOKINGS

  app.get(urls.BOOKINGS, loggedIn, async (req: Request, res: Response) => {
    // return all bookings here, paginated.
    const data = await getAll(entityTypes.BOOKING, prisma);
    res.json(data);
  });

  app.get(`${urls.BOOKINGS}/:id`, loggedIn, async (req: Request, res: Response) => {
    // return booking by id here.
    const id = parseInt(req.params.id);
    const data = await getOneById(entityTypes.BOOKING, id, prisma);
    res.json(data);
  });

  // PAYMENTS

  app.get(urls.PAYMENTS, loggedIn, async (req: Request, res: Response) => {
    // return all payments here, paginated.
    const data = await getAll(entityTypes.PAYMENT, prisma);
    res.json(data);
  });

  app.get(`${urls.PAYMENTS}/:id`, loggedIn, async (req: Request, res: Response) => {
    // return payments by id here.
    const id = parseInt(req.params.id);
    const data = await getOneById(entityTypes.PAYMENT, id, prisma);
    res.json(data);
  });

  app.get(
    `${urls.PAYMENTS}/:bookingId`, loggedIn,
    async (req: Request, res: Response) => {
      // return payments by bookingId here, paginated.
    }
  );
}

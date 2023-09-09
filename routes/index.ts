import { Express, Request, Response } from "express";
import { getAll } from "../dataFetchers/getAll.js";
import { getOneById } from "../dataFetchers/getOneById.js";
import { PrismaClient } from "@prisma/client";
import { registerLoginRoute, registerRegisterRoute } from "./auth.js";
import { entityTypes, urls } from "../enums.js";

export function routesInit(
  app: Express,
  prisma: PrismaClient,
  jwtSecret: string
) {
  app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Express + TypeScript Server" });
  });

  // TENANTS

  app.get(urls.TENANTS, async (req: Request, res: Response) => {
    // return all tenants here, paginated.
    const data = await getAll(entityTypes.TENANT, prisma);
    res.json(data);
  });

  app.get(`${urls.TENANTS}/:id`, async (req: Request, res: Response) => {
    // return tenant by id here.
    const id = parseInt(req.params.id);
    const data = await getOneById(entityTypes.TENANT, id, prisma);
    res.json(data);
  });

  // SITES

  app.get(urls.SITES, async (req: Request, res: Response) => {
    // return all sites here, paginated.
    const data = await getAll(entityTypes.SITE, prisma);
    res.json(data);
  });

  app.get(`${urls.SITES}/:id`, async (req: Request, res: Response) => {
    // return site by id here.
    const id = parseInt(req.params.id);
    const data = getOneById(entityTypes.SITE, id, prisma);
    res.json(data);
  });

  // USERS

  registerRegisterRoute(app, prisma, jwtSecret);
  registerLoginRoute(app, prisma, jwtSecret);

  // UNITTYPES

  app.get(urls.UNITTYPES, async (req: Request, res: Response) => {
    // return all unit-types here, paginated.
    const data = getAll(entityTypes.UNITTYPE, prisma);
    res.json(data);
  });

  app.get(`${urls.UNITTYPES}/:siteId`, async (req: Request, res: Response) => {
    // return unit-types by site id here, paginated.
  });

  app.get(`${urls.UNITTYPES}/:id`, async (req: Request, res: Response) => {
    // return unit-type by id here.
    const id = parseInt(req.params.id);
    const data = getOneById(entityTypes.UNITTYPE, id, prisma);
    res.json(data);
  });

  // UNITS

  app.get(urls.UNITS, async (req: Request, res: Response) => {
    // return all units here, paginated.
    const data = getAll(entityTypes.UNIT, prisma);
    res.json(data);
  });

  app.get(`${urls.UNITS}/:unitTypeId`, async (req: Request, res: Response) => {
    // return units by unitTypeId here, paginated.
  });

  app.get(`${urls.UNITS}/:id`, async (req: Request, res: Response) => {
    // return unit by id here.
    const id = parseInt(req.params.id);
    const data = getOneById(entityTypes.UNIT, id, prisma);
    res.json(data);
  });

  // GUESTS

  app.get(urls.GUESTS, async (req: Request, res: Response) => {
    // return all guests here, paginated.
    const data = getAll(entityTypes.GUEST, prisma);
    res.json(data);
  });

  app.get(`${urls.GUESTS}/:id`, async (req: Request, res: Response) => {
    // return guest by id here.
    const id = parseInt(req.params.id);
    const data = getOneById(entityTypes.GUEST, id, prisma);
    res.json(data);
  });

  // VEHICLES

  app.get(urls.VEHICLES, async (req: Request, res: Response) => {
    // return all vehicles here, paginated.
    const data = getAll(entityTypes.VEHICLE, prisma);
    res.json(data);
  });

  app.get(`${urls.VEHICLES}/:id`, async (req: Request, res: Response) => {
    // return vehicle by id here.
    const id = parseInt(req.params.id);
    const data = getOneById(entityTypes.VEHICLE, id, prisma);
    res.json(data);
  });

  // PETS

  app.get(urls.PETS, async (req: Request, res: Response) => {
    // return all pets here, paginated.
    const data = getAll(entityTypes.PET, prisma);
    res.json(data);
  });

  app.get(`${urls.PETS}/:id`, async (req: Request, res: Response) => {
    // return pet by id here.
    const id = parseInt(req.params.id);
    const data = getOneById(entityTypes.PET, id, prisma);
    res.json(data);
  });

  // BOOKINGS

  app.get(urls.BOOKINGS, async (req: Request, res: Response) => {
    // return all bookings here, paginated.
    const data = getAll(entityTypes.BOOKING, prisma);
    res.json(data);
  });

  app.get(`${urls.BOOKINGS}/:id`, async (req: Request, res: Response) => {
    // return booking by id here.
    const id = parseInt(req.params.id);
    const data = getOneById(entityTypes.BOOKING, id, prisma);
    res.json(data);
  });

  // PAYMENTS

  app.get(urls.PAYMENTS, async (req: Request, res: Response) => {
    // return all payments here, paginated.
    const data = getAll(entityTypes.PAYMENT, prisma);
    res.json(data);
  });

  app.get(`${urls.PAYMENTS}/:id`, async (req: Request, res: Response) => {
    // return payments by id here.
    const id = parseInt(req.params.id);
    const data = getOneById(entityTypes.PAYMENT, id, prisma);
    res.json(data);
  });

  app.get(
    `${urls.PAYMENTS}/:bookingId`,
    async (req: Request, res: Response) => {
      // return payments by bookingId here, paginated.
    }
  );
}

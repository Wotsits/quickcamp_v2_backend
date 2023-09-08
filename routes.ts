import { Express, Request, Response } from "express";
import { getAll } from "./dataFetchers/getAll.js";
import { getOneById } from "./dataFetchers/getOneById.js";
import { PrismaClient } from "@prisma/client";
import { isPasswordOk } from "./utilities/userManagement/helpers.js";
import bcrypt from "bcryptjs";

export function routesInit(app: Express, prisma: PrismaClient) {
  app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Express + TypeScript Server" });
  });

  // TENANTS

  app.get("/tenants", async (req: Request, res: Response) => {
    // return all tenants here, paginated.
    const data = await getAll("tenant", prisma);
    res.json(data);
  });

  app.get("/tenants/:id", async (req: Request, res: Response) => {
    // return tenant by id here.
    const id = parseInt(req.params.id);
    const data = await getOneById("tenant", id, prisma);
    res.json(data);
  });

  // SITES

  app.get("/sites", async (req: Request, res: Response) => {
    // return all sites here, paginated.
    const data = await getAll("site", prisma);
    res.json(data);
  });

  app.get("/sites/:id", async (req: Request, res: Response) => {
    // return site by id here.
    const id = parseInt(req.params.id);
    const data = getOneById("site", id, prisma);
    res.json(data);
  });

  // USERS

  app.post("/register", async (req, res, next) => {
    const { email, name, password, role } = req.body;
    // how do I get the tenant making the new user?
    if (!isPasswordOk(password)) {
      return res
        .status(400)
        .json({ message: "Password does not meet minimum requirements" });
    }
    try {
      const hash = await bcrypt.hash(password, 10);
      await prisma.user
        .create({
          data: {
            email,
            name,
            password: hash,
            role,
            tenantId: 0, //TODO replace this with the tenantId when you've figured out how to get it.
          },
        })
        .then((user) =>
          res.status(200).json({
            message: "User successfully created",
            user,
          })
        );
    } catch (err) {
      res.status(401).json({
        message: "User not successful created",
        error: err,
      });
    }
  });

  app.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    // Check if username and password is provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Email or Password not present",
      });
    }
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        res.status(401).json({
          message: "Login not successful",
          error: "Credentials did not match.",
        });
      } else {
        // comparing given password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) res.status(400).json({ message: "Login not succesful" });
        res.status(200).json({
          message: "Login successful",
          user,
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "An error occurred",
        error: error,
      });
    }
  });

  // UNITTYPES

  app.get("/unit-types", async (req: Request, res: Response) => {
    // return all unit-types here, paginated.
    const data = getAll("unitType", prisma);
    res.json(data);
  });

  app.get("/unit-types/:siteId", async (req: Request, res: Response) => {
    // return unit-types by site id here, paginated.
  });

  app.get("/unit-types/:id", async (req: Request, res: Response) => {
    // return unit-type by id here.
    const id = parseInt(req.params.id);
    const data = getOneById("unitType", id, prisma);
    res.json(data);
  });

  // UNITS

  app.get("/units", async (req: Request, res: Response) => {
    // return all units here, paginated.
    const data = getAll("unit", prisma);
    res.json(data);
  });

  app.get("/units/:unitTypeId", async (req: Request, res: Response) => {
    // return units by unitTypeId here, paginated.
  });

  app.get("/units/:id", async (req: Request, res: Response) => {
    // return unit by id here.
    const id = parseInt(req.params.id);
    const data = getOneById("unit", id, prisma);
    res.json(data);
  });

  // GUESTS

  app.get("/guests", async (req: Request, res: Response) => {
    // return all guests here, paginated.
    const data = getAll("guest", prisma);
    res.json(data);
  });

  app.get("/guests/:id", async (req: Request, res: Response) => {
    // return guest by id here.
    const id = parseInt(req.params.id);
    const data = getOneById("guest", id, prisma);
    res.json(data);
  });

  // VEHICLES

  app.get("/vehicles", async (req: Request, res: Response) => {
    // return all vehicles here, paginated.
    const data = getAll("vehicle", prisma);
    res.json(data);
  });

  app.get("/vehicles/:id", async (req: Request, res: Response) => {
    // return vehicle by id here.
    const id = parseInt(req.params.id);
    const data = getOneById("vehicle", id, prisma);
    res.json(data);
  });

  // PETS

  app.get("/pets", async (req: Request, res: Response) => {
    // return all pets here, paginated.
    const data = getAll("pet", prisma);
    res.json(data);
  });

  app.get("/pets/:id", async (req: Request, res: Response) => {
    // return pet by id here.
    const id = parseInt(req.params.id);
    const data = getOneById("pet", id, prisma);
    res.json(data);
  });

  // BOOKINGS

  app.get("/bookings", async (req: Request, res: Response) => {
    // return all bookings here, paginated.
    const data = getAll("booking", prisma);
    res.json(data);
  });

  app.get("/bookings/:id", async (req: Request, res: Response) => {
    // return booking by id here.
    const id = parseInt(req.params.id);
    const data = getOneById("booking", id, prisma);
    res.json(data);
  });

  // PAYMENTS

  app.get("/payment", async (req: Request, res: Response) => {
    // return all payments here, paginated.
    const data = getAll("payment", prisma);
    res.json(data);
  });

  app.get("/payment/:id", async (req: Request, res: Response) => {
    // return payments by id here.
    const id = parseInt(req.params.id);
    const data = getOneById("payment", id, prisma);
    res.json(data);
  });

  app.get("/payment/:bookingId", async (req: Request, res: Response) => {
    // return payments by bookingId here, paginated.
  });
}

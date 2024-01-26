import { urls } from "../../enums.js";
import { loggedIn } from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";
import { app } from "../../index.js";
import { getUsers } from "./usersControllers.js";

export function registerUserRoutes() {
  app.get(urls.USERS, validateProvidedData, loggedIn, getUsers);
}

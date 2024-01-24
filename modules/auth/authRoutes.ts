import { loggedIn } from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";
import { app } from "../../index.js";
import { login, logout, register, token } from "./authControllers.js";

export function registerLoginRoute() {
  app.post("/login", validateProvidedData, login);
}

export function registerRegisterRoute() {
  app.post("/register", validateProvidedData, loggedIn, register);
}

export function registerTokenRoute() {
  app.post("/token", validateProvidedData, token);
}

export function registerLogoutRoute() {
  app.delete("/logout", validateProvidedData, logout);
}

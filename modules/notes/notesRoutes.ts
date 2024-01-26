import { urls } from "../../enums.js";
import { loggedIn } from "../../utilities/middleware/userManagement/middleware.js";
import { validateProvidedData } from "../../utilities/middleware/validation/middleware.js";
import { app } from "../../index.js";
import { createNewNote } from "./notesControllers.js";

export function registerNoteRoutes() {
  app.post(
    urls.NEW_NOTE,
    validateProvidedData,
    loggedIn,
    createNewNote
  );

}

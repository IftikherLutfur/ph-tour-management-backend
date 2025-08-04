import { Router } from "express";
import { DivisionController } from "./division.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { divisionZodSchem, divisionZodUpdateSchem } from "./division.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { multerUpload } from "../../config/multer.config";

const route = Router()

route.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("image"), // ✅ typo fixed
//   validateRequest(divisionZodSchem),
  DivisionController.createDivision
);

route.get("/", DivisionController.getDivision)
route.get("/:slug", DivisionController.getSingleDivision)
route.patch("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(divisionZodUpdateSchem), DivisionController.updateDivision)

route.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.deleteDivision)


export const divisionRoute = route 
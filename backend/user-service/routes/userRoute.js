import express from "express";
import * as UserController from "../controllers/userController.js";

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/", UserController.getAll);
router.get("/all-restaurants", UserController.getAllRestaurants);
router.get("/all-riders", UserController.getAllRiders);
router.get("/:id", UserController.getById);
router.delete("/:id", UserController.remove);
router.patch("/:id/status", UserController.changeStatus);
router.put("/:id", UserController.update);
router.get("/restaurants/:id", UserController.getRestaurantById);
router.get("/riders/:id", UserController.getRiderById);
router.patch(
  "/restaurants/:id/availability",
  UserController.updateRestaurantAvailability
);
router.patch("/riders/:id/location", UserController.updateRiderLocation);

//route to get users by role
router.get("/role/:role", UserController.getByRole);

export default router;

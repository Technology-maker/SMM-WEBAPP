import Service from "../models/Service.js";
import { ok } from "../utils/apiResponse.js";

export const getServices = async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) filter.name = { $regex: req.query.search, $options: "i" };

    const services = await Service.find(filter).populate("category", "name icon").sort({ name: 1 });
    ok(res, "Services fetched", { services });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findOne({ _id: req.params.id, isActive: true }).populate("category", "name icon");
    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }
    ok(res, "Service fetched", { service });
  } catch (error) {
    next(error);
  }
};

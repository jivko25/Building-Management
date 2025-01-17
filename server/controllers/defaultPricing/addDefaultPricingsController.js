const db = require("../../data/index.js");
const { DefaultPricing, Artisan, Activity, Measure } = db;
const ApiError = require("../../utils/apiError");

const addDefaultPricings = async (req, res, next) => {
  try {
    const artisan_id = req.params.id;
    const isArtisan = await Artisan.findOne({
      where: {
        id: artisan_id
      },
      attributes: {
        exclude: ["artisan_id"]
      }
    });
    if (!isArtisan) {
      throw new ApiError(404, "Artisan not found!");
    }
    //Array of the newly created or updated pricings
    const { pricings } = req.body;

    if (!pricings) {
      throw new ApiError(400, "Pricings are required!");
    }
    //If there is an existing pricing, it will be updated, otherwise a new one will be created
    await Promise.all(pricings.map(pricing => addOrUpdateDefaultPricingAsync(pricing, artisan_id)));
    res.status(200).json({
      message: "Pricings added successfully!",
      pricings
    });
  } catch (error) {
    next(error);
  }
};
/**
 * Adds or updates a default pricing
 * @param {Object} pricing - The pricing object to add or update
 * @param {string} artisan_id - The ID of the artisan
 * @returns {Promise<void>}
 */
const addOrUpdateDefaultPricingAsync = async (pricing, artisan_id) => {
  try {
    const { activity_id, measure_id, price } = pricing;
    const existingPricing = await DefaultPricing.findOne({
      where: {
        activity_id,
        measure_id,
        artisan_id
      }
    });
    if (existingPricing) {
      //if the price is the same, do nothing
      if (existingPricing.price === price) return;
      //if the price is different, update the pricing
      existingPricing.price = price;
      await existingPricing.save();
    } else {
      await DefaultPricing.create({
        activity_id,
        measure_id,
        artisan_id,
        price
      });
    }
  } catch (error) {
    console.error("Error adding or updating default pricing:", error);
    throw new ApiError(500, "Failed to add or update default pricing!");
  }
};

module.exports = {
  addDefaultPricings
};

// Import required modules
import express from "express";
import cors from "cors";
import path from "path";
import { promises } from "fs";
import { fileURLToPath } from "url";
// import { get_compared_rates } from "./ship_engine/index.js";
import {
  get_section32_insights_ai,
  get_top_rates_ai,
  get_ports_insights_ai,
  get_compared_rates_details_ai,
} from "./open_ai/index.js";

// Create an instance of express
const app = express();

// Middleware to handle JSON request bodies
app.use(express.json());

// Enable CORS for cross-origin requests
app.use(cors());

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Get shipping rates
app.post("/rates", async (req, res) => {
  const {
    country_of_origin,
    product_description,
    weight,
    dimensions,
    shipping_method,
    us_destination,
  } = req.body;

  if (
    !country_of_origin ||
    !product_description ||
    !weight ||
    !dimensions ||
    !shipping_method ||
    !us_destination
  ) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const optimal_rates = await get_top_rates_ai({
      shipment: {
        country_of_origin,
        product_description,
        weight,
        dimensions,
        shipping_method,
        us_destination,
      },
    });

    res.json({
      optimal_rates,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Section 321 insights
app.post("/section321-insights", async (req, res) => {
  try {
    const {
      country_of_origin,
      product_description,
      weight,
      dimensions,
      shipping_method,
      us_destination,
      shipping_value,
    } = req.body;

    // Validate input
    if (
      !country_of_origin ||
      !product_description ||
      !weight ||
      !dimensions ||
      !shipping_method ||
      !us_destination ||
      !shipping_value
    ) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Call OpenAI API
    const response = await get_section32_insights_ai({
      country_of_origin,
      product_description,
      weight,
      dimensions,
      shipping_method,
      us_destination,
      shipping_value,
    });

    res.json(response);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
});

app.post("/ports-insights", async (req, res) => {
  try {
    const {
      country_of_origin,
      product_description,
      weight,
      dimensions,
      shipping_method,
      us_destination,
      shipping_value,
    } = req.body;

    // Validate input
    if (
      !country_of_origin ||
      !product_description ||
      !weight ||
      !dimensions ||
      !shipping_method ||
      !us_destination ||
      !shipping_value
    ) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const response = await get_ports_insights_ai({
      country_of_origin,
      product_description,
      weight,
      dimensions,
      shipping_method,
      us_destination,
      shipping_value,
    });

    res.json(response);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
});

app.post("/compare-rates", async (req, res) => {
  try {
    const { rates, shipment } = req.body;

    // Validate input
    if (!rates) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const response = await get_compared_rates_details_ai({ rates, shipment });
    res.json(response);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
});

// Set the server to listen on a specific port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

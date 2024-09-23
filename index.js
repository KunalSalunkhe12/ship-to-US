// Import required modules
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { get_compared_rates } from "./ship_engine/index.js";
import { get_top_rates_ai } from "./open_ai/index.js";

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

// Define USPS service codes
const service_codes = [
  "usps_priority_mail_international",
  "usps_priority_mail_express_international",
  "usps_first_class_mail_international",
  "globalpost_economy",
  "globalpost_priority",
  "gp_plus",
  "ups_ground_international",
  "ups_standard_international",
  "ups_3_day_select",
  "ups_worldwide_saver",
  "ups_worldwide_express",
  "ups_worldwide_expedited",
  "ups_worldwide_express_plus",
];

// Define a GET route
app.get("/rates", async (req, res) => {
  //   const {
  //     country_of_origin,
  //     product_description,
  //     weight,
  //     dimensions,
  //     shipping_method,
  //     us_destination,
  //   } = req.body;

  const response = await get_compared_rates(
    {
      rate_options: {
        carrier_ids: ["se-836173", "se-836174"],
        service_codes,
      },
      shipment: {
        ship_from: {
          city_locality: "Mumbai",
          state_province: "Maharashtra",
          postal_code: "400022",
          country_code: "IN",
        },
        ship_to: {
          city_locality: "San Jose",
          state_province: "CA",
          postal_code: "95128",
          country_code: "US",
        },
        packages: [
          {
            weight: {
              value: 17,
              unit: "pound",
            },
            dimensions: {
              length: 36,
              width: 12,
              height: 24,
              unit: "inch",
            },
          },
        ],
      },
    },
    "Air"
  );
  //   const response = await get_compared_rates(
  //     {
  //       rate_options: {
  //         carrier_ids: ["se-836173", "se-836174"],
  //         service_codes,
  //       },
  //       shipment: {
  //         ship_from: {
  //           name: "John Doe",
  //           address_line1: "4009 Marathon Blvd",
  //           city_locality: "Austin",
  //           state_province: "TX",
  //           postal_code: "78756",
  //           country_code: "US",
  //           phone: "512-555-5555",
  //         },
  //         ship_to: {
  //           name: "Amanda Miller",
  //           address_line1: "525 S Winchester Blvd",
  //           city_locality: "San Jose",
  //           state_province: "CA",
  //           postal_code: "95128",
  //           country_code: "US",
  //         },
  //         packages: [
  //           {
  //             weight: {
  //               value: 17,
  //               unit: "pound",
  //             },
  //             dimensions: {
  //               length: 36,
  //               width: 12,
  //               height: 24,
  //               unit: "inch",
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     shipping_method
  //   );

  const top_service_codes = await get_top_rates_ai(response);

  res.json({
    message: "Hello from the Express server!",
    top_service_codes,
  });
});

// Set the server to listen on a specific port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

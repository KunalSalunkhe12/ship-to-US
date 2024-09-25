// const response = await get_compared_rates(
//   {
//     rate_options: {
//       carrier_ids: ["se-836173", "se-836174"],
//       service_codes: [
//         "usps_priority_mail_international",
//         "usps_priority_mail_express_international",
//         "usps_first_class_mail_international",
//         "globalpost_economy",
//         "globalpost_priority",
//         "gp_plus",
//         "ups_ground_international",
//         "ups_standard_international",
//         "ups_3_day_select",
//         "ups_worldwide_saver",
//         "ups_worldwide_express",
//         "ups_worldwide_expedited",
//         "ups_worldwide_express_plus",
//       ],
//     },
//     shipment: {
//       ship_from: {
//         name: "John Doe",
//         company_name: "Example Corp.",
//         address_line1: "4009 Marathon Blvd",
//         city_locality: "Arcadia",
//         state_province: "NSW",
//         postal_code: "2159",
//         country_code: "AU",
//         phone: "512-555-5555",
//       },
//       ship_to: {
//         name: "Amanda Miller",
//         address_line1: "525 S Winchester Blvd",
//         city_locality: "San Jose",
//         state_province: "CA",
//         postal_code: "95128",
//         country_code: "US",
//       },
//       packages: [
//         {
//           weight: {
//             value: 17,
//             unit: "pound",
//           },
//           dimensions: {
//             length: 12,
//             width: 12,
//             height: 6,
//             unit: "inch",
//           },
//         },
//       ],
//     },
//   },
//   shipping_method
// );
// if (response.error) {
//   return res.status(400).json({ message: response.data });
// }

const jsonPath = path.join(__dirname, "shipping_rates_au.json");
const jsonData = await promises.readFile(jsonPath, "utf-8");
const rates = JSON.parse(jsonData);

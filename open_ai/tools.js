const tools = [
  {
    type: "function",
    function: {
      name: "get_shipping_rates",
      description:
        "Fetches shipping rates based on provided parameters. Call this function whenever you need to know the best two shipping rates for a shipment.",
      parameters: {
        type: "object",
        properties: {
          carrier_ids: {
            type: "array",
            items: { type: "string" },
          },
          service_codes: {
            type: "array",
            items: { type: "string" },
          },
          shipment: {
            type: "object",
            properties: {
              ship_from: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  address_line1: { type: "string" },
                  city_locality: { type: "string" },
                  state_province: { type: "string" },
                  postal_code: { type: "string" },
                  country_code: { type: "string" },
                  phone: { type: "string" },
                },
              },
              ship_to: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  address_line1: { type: "string" },
                  city_locality: { type: "string" },
                  state_province: { type: "string" },
                  postal_code: { type: "string" },
                  country_code: { type: "string" },
                },
              },
              packages: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    weight: {
                      type: "object",
                      properties: {
                        value: { type: "number" },
                        unit: { type: "string" },
                      },
                    },
                    dimensions: {
                      type: "object",
                      properties: {
                        length: { type: "number" },
                        width: { type: "number" },
                        height: { type: "number" },
                        unit: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        required: ["carrier_ids", "shipment"],
      },
    },
  },
];

export default tools;

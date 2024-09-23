import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const get_top_rates_ai = async (compared_rates) => {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `I need to find the best shipping options for a package I'm sending from these Rates: ${JSON.stringify(
          compared_rates
        )} 
        Can you provide me the two service_codes out of all carrier services with the best shipping rates Considering factors 
        like Rates, delivery_days, guaranteed_service, estimated_delivery_date and other factors you find suitable. 
        Also give reason for why you selected the service_codes?
        `,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "top_rates",
        schema: {
          type: "object",
          properties: {
            rates: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  carrier_id: { type: "string" },
                  shipping_rate: { type: "number" },
                  other_charges: { type: "number" },
                  delivery_days: { type: "number" },
                  guaranteed_service: { type: "boolean" },
                  estimated_delivery_date: { type: "string" },
                  service_code: { type: "string" },
                  package_type: { type: "string" },
                  shipping_method: { type: "string" },
                  reason: { type: "string" },
                },
                required: [
                  "carrier_id",
                  "shipping_rate",
                  "other_charges",
                  "delivery_days",
                  "guaranteed_service",
                  "estimated_delivery_date",
                  "service_code",
                  "package_type",
                  "shipping_method",
                  "reason",
                ],
                additionalProperties: false,
              },
            },
          },
          required: ["rates"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
  });

  return JSON.parse(res.choices[0].message.content);
};

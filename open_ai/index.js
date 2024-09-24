import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const get_top_rates_ai = async ({ rates, shipment }) => {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `
    I need to estimate shipping rates in the year 2024 from the origin country specified in the shipment details to the US. Please analyze the following information and provide estimates:

    Shipment Details:
    ${JSON.stringify(shipment)}

    Instructions:
    1. Use the 'country_of_origin' specified in the shipment details as the source country for shipping to the US.
    2. Estimate rates for the specified origin country to the US.
    3. Consider factors such as distance,shipping_method, product weight (kg), dimensions (lxwxh), description, us_destination and country_of_origin, economic differences, and trade relationships that might affect shipping rates between the origin country and the US.

    Output Required:
    1. Estimated shipping rates and details for:
      [Origin Country] to US in the year 2024
    2. Include:
      a. Three estimated rates with different shipping methods (e.g., Air, Sea, Express)
      b. Shipping method (e.g., Air, Sea, Express)
      c. Estimated delivery times based on shipping method
      d. Any additional charges or factors that could affect the final shipping cost
      e. Brief explanation (2-3 sentences) of how you arrived at these estimates

    Please ensure your estimates are reasonable given the baseline data and known geographical and economic factors related to the origin country.
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
                  shipping_rate: { type: "number" },
                  custom_fee: { type: "number" },
                  other_charges: { type: "number" },
                  total_cost: { type: "number" },
                  delivery_days: { type: "number" },
                  shipping_method: { type: "string" },
                  reason: { type: "string" },
                },
                required: [
                  "shipping_rate",
                  "other_charges",
                  "delivery_days",
                  "shipping_method",
                  "reason",
                  "custom_fee",
                  "total_cost",
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

export const get_section32_insights_ai = async ({
  country_of_origin,
  product_description,
  weight,
  dimensions,
  shipping_method,
  us_destination,
  shipping_value,
}) => {
  // Prepare the prompt for OpenAI
  const prompt = `Analyze the following shipment for Section 321 De Minimis Strategy:
    
    Country of Origin: ${country_of_origin}
    Product Description: ${product_description}
    Weight: ${weight}
    Dimensions: ${dimensions}
    Shipping Method: ${shipping_method}
    US Destination City: ${us_destination}
    Shipment Value: ${shipping_value}

    Provide a detailed analysis including:
    1. Whether the shipment qualifies for the Section 321 De Minimis Strategy
    2. A detailed explanation of the analysis
    3. Recommended actions or steps to increase potential savings

    `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "section321_insights",
        schema: {
          type: "object",
          properties: {
            qualifies: {
              type: "object",
              properties: {
                qualifies: { type: "boolean" },
                reason: { type: "string" },
              },
              required: ["qualifies", "reason"],
              additionalProperties: false,
            },
            analysis: { type: "string" },
            recommendations: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["qualifies", "analysis", "recommendations"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
  });

  return JSON.parse(completion.choices[0].message.content);
};

export const get_compared_rates_details_ai = async ({ rates, shipment }) => {
  const prompt = `Analyze the following shipping rates and provide a detailed comparison

    Shipping Rates:
    ${JSON.stringify(rates)}

    Shipping Details:
    ${JSON.stringify(shipment)}


    Instructions:
    1. Analyze the shipping rates to identify the most cost-effective option
    2. Consider factors such as shipping_rate, other_charges, delivery_days
    3. Provide a detailed comparison of the rates and recommendations for the best option
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "compared_rates",
        schema: {
          type: "object",
          properties: {
            analysis: { type: "string" },
            recommendations: { type: "array", items: { type: "string" } },
          },
          required: ["analysis", "recommendations"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
  });

  return JSON.parse(completion.choices[0].message.content);
};

export const get_ports_insights_ai = async (shipment) => {
  const prompt = `Analyze the following shipment details and provide insights on the optimal ports for shipping

    Shipment Details:
    ${JSON.stringify(shipment)}

    Instructions:
    1. Analyze the shipment details to determine the optimal ports for shipping
    2. Consider factors such as distance, shipping_method, product weight, dimensions, description, us_destination, and country_of_origin
    3. Provide insights on the analysis and recommendations for the optimal ports
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "optimized_ports",
        schema: {
          type: "object",
          properties: {
            analysis: { type: "string" },
            recommendations: { type: "array", items: { type: "string" } },
          },
          required: ["analysis", "recommendations"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
  });

  return JSON.parse(completion.choices[0].message.content);
};

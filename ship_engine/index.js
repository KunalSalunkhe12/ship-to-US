import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const SHIPENGINE_API_KEY = process.env.SHIPENGINE_API_KEY;
const SHIPENGINE_API_URL = process.env.SHIPENGINE_API_URL;

function categorizeShippingMethod(rates) {
  return rates.map((rate) => {
    const {
      service_code,
      estimated_delivery_date,
      shipping_rate,
      other_charges,
    } = rate;

    const currentDate = new Date();
    const deliveryDate = new Date(estimated_delivery_date);
    const delivery_days = Math.ceil(
      (deliveryDate - currentDate) / (1000 * 60 * 60 * 24)
    );
    const amount = shipping_rate + other_charges;

    let method = "Unknown";

    // Check for express services by service type keywords
    if (service_code.toLowerCase().includes("express")) {
      method = "Express";
    }
    // Check for air shipping based on delivery days (2-3 days typically air)
    else if (delivery_days <= 3) {
      method = "Air";
    }
    // Assume sea shipping for longer delivery times
    else if (delivery_days > 7) {
      method = "Sea";
    }
    // As a fallback, categorize based on price ranges (Sea typically cheaper)
    else if (amount < 50) {
      method = "Sea";
    } else {
      method = "Air";
    }

    return {
      ...rate,
      shipping_method: method,
    };
  });
}

export const get_compared_rates = async (parameters, shipping_method) => {
  const response = await axios.post(`${SHIPENGINE_API_URL}/rates`, parameters, {
    headers: {
      "API-Key": SHIPENGINE_API_KEY,
      "Content-Type": "application/json",
    },
  });
  const rates = response.data.rate_response.rates;
  const format_rates = rates.map((rate) => {
    return {
      carrier_id: rate.carrier_id,
      service_code: rate.service_code,
      package_type: rate.package_type,
      shipping_rate: rate.shipping_amount.amount,
      other_charges: rate.other_amount.amount,
      delivery_days: rate.delivery_days,
      guaranteed_service: rate.guaranteed_service,
      estimated_delivery_date: rate.estimated_delivery_date,
    };
  });
  const categorizedRates = categorizeShippingMethod(format_rates);
  return categorizedRates.filter(
    (rate) =>
      rate.shipping_method !== "Unknown" &&
      rate.shipping_method === shipping_method
  );
};

export const get_carrier_services_codes = async (carrier_id) => {
  const response = await axios.get(
    `${SHIPENGINE_API_URL}/carriers/${carrier_id}/services`,
    {
      headers: {
        "API-Key": SHIPENGINE_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  const services_codes = response.data.services
    .filter((service) => service.international === true)
    .map((service) => service.service_code);

  return services_codes;
};

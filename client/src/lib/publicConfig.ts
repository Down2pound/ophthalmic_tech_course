import { useEffect, useState } from "react";

export interface PublicConfig {
  businessName: string;
  businessLegalName: string;
  businessAddress: string;
  supportEmail: string;
  pricePerSeat: number;
  refundDays: number;
  termsVersion: string;
}

const fallback: PublicConfig = {
  businessName: "OptiTech Academy",
  businessLegalName: "OptiTech Academy",
  businessAddress: "",
  supportEmail: "",
  pricePerSeat: 699,
  refundDays: 7,
  termsVersion: "2026-07-21",
};

export function usePublicConfig(): PublicConfig {
  const [config, setConfig] = useState<PublicConfig>(fallback);

  useEffect(() => {
    fetch("/api/public/config")
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load site configuration.");
        return response.json() as Promise<PublicConfig>;
      })
      .then(setConfig)
      .catch(() => setConfig(fallback));
  }, []);

  return config;
}

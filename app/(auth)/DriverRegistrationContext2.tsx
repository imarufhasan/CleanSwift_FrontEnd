// ─── DriverRegistrationContext.tsx ───────────────────────────────────────────
// Shared state across all 4 registration steps

import React, { createContext, useContext, useState } from "react";

export interface PickedFile {
  uri: string;
  name: string;
  mimeType?: string | null;
  size?: number;
  type?: string;
}

export interface DriverFormData {
  // Step 1 — Driver License
  driverLicenseFile: PickedFile | null;

  // Step 2 — Selfie Photo
  selfieFile: PickedFile | null;

  // Step 3 — Car Insurance
  insuranceFile: PickedFile | null;
  insuranceProvider: string;
  policyNumber: string;
  expirationDate: Date | null;

  // Step 4 — Vehicle Details
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  licensePlateNo: string;
}

interface DriverFormContextType {
  formData: DriverFormData;
  setDriverLicense: (file: PickedFile | null) => void;
  setSelfie: (file: PickedFile | null) => void;
  setInsuranceFile: (file: PickedFile | null) => void;
  setInsuranceProvider: (v: string) => void;
  setPolicyNumber: (v: string) => void;
  setExpirationDate: (d: Date | null) => void;
  setVehicleMake: (v: string) => void;
  setVehicleModel: (v: string) => void;
  setVehicleYear: (v: string) => void;
  setLicensePlateNo: (v: string) => void;
}

const DriverFormContext = createContext<DriverFormContextType | null>(null);

export function DriverFormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<DriverFormData>({
    driverLicenseFile: null,
    selfieFile: null,
    insuranceFile: null,
    insuranceProvider: "",
    policyNumber: "",
    expirationDate: null,
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    licensePlateNo: "",
  });

  const update = (patch: Partial<DriverFormData>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  return (
    <DriverFormContext.Provider
      value={{
        formData,
        setDriverLicense: (file) => update({ driverLicenseFile: file }),
        setSelfie: (file) => update({ selfieFile: file }),
        setInsuranceFile: (file) => update({ insuranceFile: file }),
        setInsuranceProvider: (v) => update({ insuranceProvider: v }),
        setPolicyNumber: (v) => update({ policyNumber: v }),
        setExpirationDate: (d) => update({ expirationDate: d }),
        setVehicleMake: (v) => update({ vehicleMake: v }),
        setVehicleModel: (v) => update({ vehicleModel: v }),
        setVehicleYear: (v) => update({ vehicleYear: v }),
        setLicensePlateNo: (v) => update({ licensePlateNo: v }),
      }}
    >
      {children}
    </DriverFormContext.Provider>
  );
}

export function useDriverForm() {
  const ctx = useContext(DriverFormContext);
  if (!ctx) throw new Error("useDriverForm must be used inside DriverFormProvider");
  return ctx;
}

// src/components/DetailedBillForm.tsx
import { useForm } from "react-hook-form";

export type FormData = {
  startDate: string;
  endDate: string;
  mainStart: number;
  mainEnd: number;
  subStart: number;
  subEnd: number;
  billStartDate: string;
  billEndDate: string;
  totalUnits: number;
  energyBill: number;
  demandCharge: number;
  vatCharge: number;
};

interface Props {
  onSubmit: (data: FormData) => void;
}

export default function MeterForm({ onSubmit }: Readonly<Props>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: "onTouched" });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Electricity Meter Bill Entry
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Meter Readings */}
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            📅 Meter Readings (Your Inputs)
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                {...register("startDate", {
                  required: "Start date is required",
                })}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm">
                  {errors.startDate.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                {...register("endDate", { required: "End date is required" })}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Main Meter Start Reading (kWh)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("mainStart", { required: "Required", min: 0 })}
                className="w-full border rounded-md px-3 py-2"
              />
              {errors.mainStart && (
                <p className="text-red-500 text-sm">
                  {errors.mainStart.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Main Meter End Reading (kWh)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("mainEnd", { required: "Required", min: 0 })}
                className="w-full border rounded-md px-3 py-2"
              />
              {errors.mainEnd && (
                <p className="text-red-500 text-sm">{errors.mainEnd.message}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Submeter Start Reading (kWh)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("subStart", { required: "Required", min: 0 })}
                className="w-full border rounded-md px-3 py-2"
              />
              {errors.subStart && (
                <p className="text-red-500 text-sm">
                  {errors.subStart.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Submeter End Reading (kWh)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("subEnd", { required: "Required", min: 0 })}
                className="w-full border rounded-md px-3 py-2"
              />
              {errors.subEnd && (
                <p className="text-red-500 text-sm">{errors.subEnd.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Actual Bill Info */}
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            🧾 Electricity Bill Details
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bill Start Date
              </label>
              <input
                type="date"
                {...register("billStartDate", { required: "Required" })}
                className="w-full border rounded-md px-3 py-2"
              />
              {errors.billStartDate && (
                <p className="text-red-500 text-sm">
                  {errors.billStartDate.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bill End Date
              </label>
              <input
                type="date"
                {...register("billEndDate", { required: "Required" })}
                className="w-full border rounded-md px-3 py-2"
              />
              {errors.billEndDate && (
                <p className="text-red-500 text-sm">
                  {errors.billEndDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Units (kWh)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("totalUnits", { required: "Required", min: 0 })}
                className="w-full border rounded-md px-3 py-2"
              />
              {errors.totalUnits && (
                <p className="text-red-500 text-sm">
                  {errors.totalUnits.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Energy Bill (৳)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("energyBill", { required: "Required", min: 0 })}
                className="w-full border rounded-md px-3 py-2"
              />
              {errors.energyBill && (
                <p className="text-red-500 text-sm">
                  {errors.energyBill.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Demand Charge (৳)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("demandCharge", { required: "Required", min: 0 })}
                className="w-full border rounded-md px-3 py-2"
              />
              {errors.demandCharge && (
                <p className="text-red-500 text-sm">
                  {errors.demandCharge.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                VAT (৳)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("vatCharge", { required: "Required", min: 0 })}
                className="w-full border rounded-md px-3 py-2"
              />
              {errors.vatCharge && (
                <p className="text-red-500 text-sm">
                  {errors.vatCharge.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition mt-4 cursor-pointer"
        >
          Submit Data
        </button>
      </form>
    </div>
  );
}

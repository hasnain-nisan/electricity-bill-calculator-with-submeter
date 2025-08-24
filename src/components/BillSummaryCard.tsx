export interface BillData {
  mainConsumption: number;
  subConsumption: number;
  myConsumption: number;
  mainPerDay: number;
  subPerDay: number;
  myPerDay: number;
  mainUsageInBill: number;
  subUsageInBill: number;
  myUsageInBill: number;
  totalUnitRatio: number;
  subMeterRatio: number;
  myRatio: number;
  subEnergyBill: number;
  myEnergyBill: number;
  demandCharge: number;
  vatCharge: number;
  subTotal: number;
  myTotal: number;
  adjustedSub: number;
  adjustedMine: number;
  finalSubMeterUnits: number;
  finalMyUnits: number;
  finalTotalUnits: number;
}
interface Props {
  data: BillData | null;
}

export default function BillSummaryCard({ data }: Readonly<Props>) {
  if (!data) {
    return (
      <div className="flex items-center justify-center">
        <div className="bg-blue-50 p-6 md:p-10 rounded-xl shadow-md w-full">
          <h3 className="text-xl font-bold text-blue-700 mb-4">
            Your Estimated Bill
          </h3>
          <p className="text-gray-600">
            Enter readings and rate to calculate your bill.
          </p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number): string => `৳${value.toFixed(2)}`;
  const formatKWh = (value: number): string => `${value.toFixed(2)} kWh`;

  console.log(data)

  return (
    <div className="flex items-center justify-center">
      <div className="bg-blue-50 p-6 md:p-10 rounded-xl shadow-md w-full space-y-6">
        <h3 className="text-xl font-bold text-blue-700">
          Bill Breakdown Summary
        </h3>

        {/* Meter Readings */}
        <section>
          <h4 className="text-lg font-semibold text-blue-600 mb-2">
            🔌 Meter Readings
          </h4>
          <p>
            <strong>Main Meter:</strong> {formatKWh(data.mainConsumption)}
          </p>
          <p>
            <strong>Sub Meter:</strong> {formatKWh(data.subConsumption)}
          </p>
          <p>
            <strong>My Consumption:</strong> {formatKWh(data.myConsumption)}
          </p>
        </section>

        {/* Per Day Consumption */}
        <section>
          <h4 className="text-lg font-semibold text-blue-600 mb-2">
            📊 Per Day Consumption
          </h4>
          <p>
            <strong>Main:</strong> {formatKWh(data.mainPerDay)}
          </p>
          <p>
            <strong>Sub:</strong> {formatKWh(data.subPerDay)}
          </p>
          <p>
            <strong>Mine:</strong> {formatKWh(data.myPerDay)}
          </p>
        </section>

        {/* Bill Period Usage */}
        <section>
          <h4 className="text-lg font-semibold text-blue-600 mb-2">
            📅 Bill Period Usage
          </h4>
          <p>
            <strong>Main Meter:</strong> {formatKWh(data.mainUsageInBill)}
          </p>
          <p>
            <strong>Sub Meter:</strong> {formatKWh(data.subUsageInBill)}
          </p>
          <p>
            <strong>My Usage:</strong> {formatKWh(data.myUsageInBill)}
          </p>
        </section>

        {/* Ratios */}
        <section>
          <h4 className="text-lg font-semibold text-blue-600 mb-2">
            ⚖️ Consumption Ratios
          </h4>
          <p>
            <strong>Total Unit Ratio:</strong> {data.totalUnitRatio.toFixed(4)}
          </p>
          <p>
            <strong>Sub Meter Ratio:</strong> {data.subMeterRatio.toFixed(4)}
          </p>
          <p>
            <strong>My Ratio:</strong> {data.myRatio.toFixed(4)}
          </p>
        </section>

        {/* Final Unit Usage */}
        <section>
          <h4 className="text-lg font-semibold text-blue-600 mb-2">
            🔢 Final Unit Usage
          </h4>
          <p>
            <strong>Sub Meter Units:</strong>{" "}
            {(data.finalSubMeterUnits.toFixed(2))}
          </p>
          <p>
            <strong>My Units:</strong> {(data.finalMyUnits.toFixed(2))}
          </p>
          <p>
            <strong>Total Units (from Bill):</strong>{" "}
            {(data.finalTotalUnits)}
          </p>
        </section>

        {/* Energy Bill */}
        <section>
          <h4 className="text-lg font-semibold text-blue-600 mb-2">
            💡 Energy Charges
          </h4>
          <p>
            <strong>Sub Meter Energy Bill:</strong>{" "}
            {formatCurrency(data.subEnergyBill)}
          </p>
          <p>
            <strong>My Energy Bill:</strong> {formatCurrency(data.myEnergyBill)}
          </p>
        </section>

        {/* Fixed Charges */}
        <section>
          <h4 className="text-lg font-semibold text-blue-600 mb-2">
            🧾 Fixed Charges
          </h4>
          <p>
            <strong>Demand Charge:</strong> {formatCurrency(data.demandCharge)}
          </p>
          <p>
            <strong>VAT Charge:</strong> {formatCurrency(data.vatCharge)}
          </p>
        </section>

        {/* Final Bills */}
        <section>
          <h4 className="text-lg font-semibold text-blue-600 mb-2">
            📌 Final Bill Summary
          </h4>
          <p>
            <strong>Sub Meter Total:</strong> {formatCurrency(data.subTotal)}
          </p>
          <p>
            <strong>My Total:</strong> {formatCurrency(data.myTotal)}
          </p>
        </section>

        {/* Adjusted Bills */}
        <section>
          <h4 className="text-lg font-semibold text-blue-600 mb-2">
            🧮 Adjusted Bills
          </h4>
          <p>
            <strong>Adjusted Sub Meter:</strong>{" "}
            {formatCurrency(data.adjustedSub)}
          </p>
          <p>
            <strong>Adjusted Mine:</strong> {formatCurrency(data.adjustedMine)}
          </p>
        </section>
      </div>
    </div>
  );
}

import { useState } from "react";
import MeterForm, { type FormData } from "./components/MeterForm";
import BillSummaryCard, { type BillData } from "./components/BillSummaryCard";
import { adjustBills, getDateDifference } from "./helpers";

export default function App() {
  const [billData, setBillData] = useState<BillData | null>(null);

  const handleFormSubmit = (data : FormData) => {
    console.log("Submitted form data:", data);

    const myReadingDurationDays = getDateDifference(
      data.startDate,
      data.endDate
    );
    console.log(
      `Meter reading duration from my reading: ${myReadingDurationDays} days`
    );

    const mainConsumption = data.mainEnd - data.mainStart;
    const subConsumption = data.subEnd - data.subStart;
    console.log(`Main Meter Consumption: ${mainConsumption} kWh`);
    console.log(`Sub Meter Consumption: ${subConsumption} kWh`);

    const mainPerDayConsumption = mainConsumption / myReadingDurationDays;
    const subPerDayConsumption = subConsumption / myReadingDurationDays;
    const myPerDayConsumption = mainPerDayConsumption - subPerDayConsumption;
    console.log(`Main Meter Per Day Consumption: ${mainPerDayConsumption} kWh`);
    console.log(`Sub Meter Per Day Consumption: ${subPerDayConsumption} kWh`);
    console.log(`My Per Day Consumption: ${myPerDayConsumption} kWh`);

    const billReadingDurationDays = getDateDifference(
      data.billStartDate,
      data.billEndDate
    );
    console.log(
      `Meter reading duration from electricity bill: ${billReadingDurationDays} days`
    );

    const subMeterUsageInBillPeriod =
      subPerDayConsumption * billReadingDurationDays;
    const myUsageInBillPeriod = myPerDayConsumption * billReadingDurationDays;
    const mainMeterUsageInBillPeriod =
      mainPerDayConsumption * billReadingDurationDays;
    console.log(
      `Sub Meter Usage in Bill Period: ${subMeterUsageInBillPeriod} kWh`
    );
    console.log(`My Usage in Bill Period: ${myUsageInBillPeriod} kWh`);
    console.log(
      `Main Meter Usage in Bill Period: ${mainMeterUsageInBillPeriod} kWh`
    );

    const totalConsumedUnitInBill = data.totalUnits;
    console.log(`Total Consumed Unit in Bill: ${totalConsumedUnitInBill} kWh`);

    const totalConsumedUnitRatio =
      totalConsumedUnitInBill / mainMeterUsageInBillPeriod;
    console.log(`Total Consumed Unit Ratio: ${totalConsumedUnitRatio}`);

    const subMeterConsumptionInBill =
      subMeterUsageInBillPeriod * totalConsumedUnitRatio;
    const myConsumptionInBill = myUsageInBillPeriod * totalConsumedUnitRatio;
    console.log(
      `Sub Meter Consumption in Bill: ${subMeterConsumptionInBill} kWh`
    );
    console.log(`My Consumption in Bill: ${myConsumptionInBill} kWh`);

    const subMeterConsumedUnitRatio =
      subMeterConsumptionInBill / totalConsumedUnitInBill;
    const myConsumedUnitRatio = myConsumptionInBill / totalConsumedUnitInBill;
    console.log(`Sub Meter Consumed Unit Ratio: ${subMeterConsumedUnitRatio}`);
    console.log(`My Consumed Unit Ratio: ${myConsumedUnitRatio}`);

    const subMeterEnergyBill = data.energyBill * subMeterConsumedUnitRatio;
    const myEnergyBill = data.energyBill * myConsumedUnitRatio;
    console.log(`Sub Meter Energy Bill: ${subMeterEnergyBill} ৳`);
    console.log(`My Energy Bill: ${myEnergyBill} ৳`);

    const individualDemandCharge = data.demandCharge / 2;
    console.log(`Individual Demand Charge: ${individualDemandCharge} ৳`);

    /* Vat charge is now divided by two
      but it should be divided based on consumed unit ratio
      Enhancement in future
    */
    const individualVatCharge = data.vatCharge / 2;
    console.log(`Individual VAT Charge: ${individualVatCharge} ৳`);

    const subMeterTotalBill =
      subMeterEnergyBill + individualDemandCharge + individualVatCharge;
    const myTotalBill =
      myEnergyBill + individualDemandCharge + individualVatCharge;
    console.log(`Sub Meter Total Bill: ${subMeterTotalBill} ৳`);
    console.log(`My Total Bill: ${myTotalBill} ৳`);

    const adjustedBills = adjustBills(myTotalBill, subMeterTotalBill);
    console.log("adjusted bills", adjustedBills);

    setBillData({
      mainConsumption,
      subConsumption,
      myConsumption: mainConsumption - subConsumption,
      mainPerDay: mainPerDayConsumption,
      subPerDay: subPerDayConsumption,
      myPerDay: myPerDayConsumption,
      mainUsageInBill: mainMeterUsageInBillPeriod,
      subUsageInBill: subMeterUsageInBillPeriod,
      myUsageInBill: myUsageInBillPeriod,
      totalUnitRatio: totalConsumedUnitRatio,
      subMeterRatio: subMeterConsumedUnitRatio,
      myRatio: myConsumedUnitRatio,
      subEnergyBill: subMeterEnergyBill,
      myEnergyBill: myEnergyBill,
      demandCharge: individualDemandCharge,
      vatCharge: individualVatCharge,
      subTotal: subMeterTotalBill,
      myTotal: myTotalBill,
      adjustedSub: Math.max(
        adjustedBills.adjustedBill1,
        adjustedBills.adjustedBill2
      ),
      adjustedMine: Math.min(
        adjustedBills.adjustedBill1,
        adjustedBills.adjustedBill2
      ),
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="container mx-auto bg-white shadow-xl rounded-xl p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        <MeterForm onSubmit={handleFormSubmit} />
        <BillSummaryCard data={billData} />
      </div>
    </div>
  );
}

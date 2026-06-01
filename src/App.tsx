import { useEffect, useState } from "react";
import MeterForm, { type FormData } from "./components/MeterForm";
import BillSummaryCard, { type BillData } from "./components/BillSummaryCard";
import MarkdownPreview from "./components/MarkdownPreview";
import { adjustBills, getDateDifference } from "./helpers";
import walkthroughMarkdown from "../docs/electricity-bill-calculation.md?raw";

const WALKTHROUGH_PATH = "/calculation-walkthrough";

function normalizePath(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

export default function App() {
  const [billData, setBillData] = useState<BillData | null>(null);
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => {
      setPath(normalizePath(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (to: string) => {
    if (normalizePath(window.location.pathname) === normalizePath(to)) {
      return;
    }

    window.history.pushState({}, "", to);
    setPath(normalizePath(to));
  };

  const handleFormSubmit = (data: FormData) => {
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
      finalSubMeterUnits: subMeterConsumptionInBill,
      finalMyUnits: myConsumptionInBill,
      finalTotalUnits: totalConsumedUnitInBill,
    });
  };

  if (path === WALKTHROUGH_PATH) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff,_#f8fafc_42%,_#e2e8f0_100%)] px-4 py-8 md:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/85 p-5 shadow-xl backdrop-blur md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Calculation walkthrough
              </p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                How the bill split is calculated
              </h1>
            </div>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Back to calculator
            </button>
          </div>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl md:p-10">
            <MarkdownPreview content={walkthroughMarkdown} />
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff,_#f8fafc_42%,_#e2e8f0_100%)] px-4 py-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/85 p-5 shadow-xl backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Electricity bill calculator
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
              Split the main meter bill with a submeter
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Enter your readings, compare them with the official bill, and see
              a proportional breakdown in seconds.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(WALKTHROUGH_PATH)}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
          >
            Read calculation walkthrough
          </button>
        </div>

        <div className="grid grid-cols-1 gap-10 rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-2xl backdrop-blur md:grid-cols-2 md:p-10">
          <MeterForm onSubmit={handleFormSubmit} />
          <BillSummaryCard data={billData} />
          <div className="md:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
              Want to see the math in plain English?{" "}
              <button
                type="button"
                onClick={() => navigate(WALKTHROUGH_PATH)}
                className="font-semibold text-blue-700 underline-offset-4 hover:underline"
              >
                Open the calculation walkthrough
              </button>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

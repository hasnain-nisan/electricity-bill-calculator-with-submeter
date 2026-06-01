# Electricity Bill Calculation Guide

This project calculates how an official electricity bill should be split between a main meter and a submeter user.

The calculation is driven by the code in [`src/App.tsx`](../src/App.tsx) and [`src/helpers.ts`](../src/helpers.ts).  
I also checked the three PDF screenshots you provided to verify that the app output matches the intended workflow.

## What The App Needs

The form in [`src/components/MeterForm.tsx`](../src/components/MeterForm.tsx) asks for:

- Meter reading start and end dates
- Main meter start and end readings
- Submeter start and end readings
- Official bill start and end dates
- Total billed units from the utility bill
- Energy bill amount
- Demand charge
- VAT

## Step By Step Calculation

### 1. Find the meter reading period

The app calculates how many days passed between the user's meter reading start and end dates.

Formula:

```text
reading_days = ceil(end_date - start_date)
```

The helper uses `Math.ceil`, so any fractional day is rounded up.

### 2. Calculate meter consumption

The app subtracts the starting reading from the ending reading.

Formula:

```text
main_consumption = main_end - main_start
sub_consumption = sub_end - sub_start
my_consumption = main_consumption - sub_consumption
```

### 3. Convert usage into daily consumption

Each meter's total consumption is divided by the number of reading days.

Formula:

```text
main_per_day = main_consumption / reading_days
sub_per_day = sub_consumption / reading_days
my_per_day = my_consumption / reading_days
```

### 4. Project usage into the official bill period

The app then calculates how much each meter would have used during the actual electricity bill period.

Formula:

```text
bill_days = ceil(bill_end_date - bill_start_date)

main_usage_in_bill = main_per_day * bill_days
sub_usage_in_bill = sub_per_day * bill_days
my_usage_in_bill = my_per_day * bill_days
```

### 5. Scale the meter usage to the official billed units

The app assumes the main meter usage during the bill period represents the full bill, so it calculates a scaling ratio.

Formula:

```text
total_unit_ratio = total_units_from_bill / main_usage_in_bill

sub_meter_units = sub_usage_in_bill * total_unit_ratio
my_units = my_usage_in_bill * total_unit_ratio
```

This gives the share of the official bill units that belong to the submeter and to the user.

### 6. Split the energy charge

The energy bill is split using the same unit ratio.

Formula:

```text
sub_meter_ratio = sub_meter_units / total_units_from_bill
my_ratio = my_units / total_units_from_bill

sub_energy_bill = energy_bill * sub_meter_ratio
my_energy_bill = energy_bill * my_ratio
```

### 7. Split demand charge and VAT

The current code divides these fixed charges equally between the two sides.

Formula used in the app:

```text
individual_demand_charge = demand_charge / 2
individual_vat_charge = vat_charge / 2
```

Note: there is a comment in the code saying VAT should ideally be split by consumption ratio in the future, but that is not implemented yet.

### 8. Build the total bill for each side

Formula:

```text
sub_total = sub_energy_bill + individual_demand_charge + individual_vat_charge
my_total = my_energy_bill + individual_demand_charge + individual_vat_charge
```

### 9. Adjust the bill for cleaner presentation

The helper [`adjustBills`](../src/helpers.ts) keeps the total amount balanced while rounding the larger bill down to a whole number.

How it works:

```text
1. Identify the larger bill and the smaller bill
2. Remove the decimal fraction from the larger bill using floor()
3. Add that fraction to the smaller bill
```

So the final pair still adds up to the same total, but one side becomes a clean whole number.

## Worked Example From The First PDF Screenshot

The first PDF screenshot shows these values:

- Main meter: `11435` to `11775`
- Submeter: `6115` to `6356`
- Meter reading dates: `01/31/2026` to `02/28/2026`
- Bill dates: `01/28/2026` to `02/25/2026`
- Total bill units: `366`
- Energy bill: `2582`
- Demand charge: `126`
- VAT: `135`

### A. Meter consumption

```text
main_consumption = 11775 - 11435 = 340 kWh
sub_consumption = 6356 - 6115 = 241 kWh
my_consumption = 340 - 241 = 99 kWh
```

### B. Daily consumption

The meter reading period is 28 days.

```text
main_per_day = 340 / 28 = 12.14 kWh
sub_per_day = 241 / 28 = 8.61 kWh
my_per_day = 99 / 28 = 3.54 kWh
```

### C. Usage during the bill period

The bill period is also 28 days.

```text
main_usage_in_bill = 12.14 * 28 = 340.00 kWh
sub_usage_in_bill = 8.61 * 28 = 241.00 kWh
my_usage_in_bill = 3.54 * 28 = 99.00 kWh
```

### D. Ratio against the official bill units

```text
total_unit_ratio = 366 / 340 = 1.0765

sub_meter_units = 241.00 * 1.0765 = 259.43 kWh
my_units = 99.00 * 1.0765 = 106.57 kWh
```

### E. Split the energy bill

```text
sub_meter_ratio = 259.43 / 366 = 0.7088
my_ratio = 106.57 / 366 = 0.2912

sub_energy_bill = 2582 * 0.7088 = 1830.18
my_energy_bill = 2582 * 0.2912 = 751.82
```

### F. Add fixed charges

```text
individual_demand_charge = 126 / 2 = 63.00
individual_vat_charge = 135 / 2 = 67.50
```

### G. Final bill totals

```text
sub_total = 1830.18 + 63.00 + 67.50 = 1960.68
my_total = 751.82 + 63.00 + 67.50 = 882.32
```

### H. Adjusted bill values

The larger bill is rounded down and its decimal part is moved to the smaller bill.

```text
adjusted_sub = 1960.00
adjusted_my = 883.00
```

## What The Three PDF Screenshots Show

The three screenshots all follow the same calculation pattern, only with different dates and readings.

| Screenshot date | Main consumption | Sub consumption | My consumption | Total bill units | Energy bill | Demand charge | VAT | Sub total | My total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 2026-03-26 | 340 kWh | 241 kWh | 99 kWh | 366 | 2582 | 126 | 135 | 1960.68 | 882.32 |
| 2026-04-21 | 357 kWh | 278 kWh | 79 kWh | 329 | 2286 | 126 | 120 | 1903.13 | 628.87 |
| 2026-05-22 | 365 kWh | 267 kWh | 98 kWh | 366 | 2582 | 126 | 135 | 2019.25 | 823.75 |

These screenshots confirm that the app is:

- Measuring usage from the meter difference
- Projecting that usage into the official bill period
- Allocating the official bill proportionally
- Splitting fixed charges equally
- Producing a final adjusted pair of bills

## Short Summary

This app takes two meter readings:

- the main meter
- the submeter

It then compares those readings over a date range, calculates daily usage, projects the usage into the official billing period, and splits the final bill proportionally.

In simple words:

1. Measure how much electricity each meter used.
2. Convert that usage into a daily average.
3. Match that usage to the official bill period.
4. Split the bill according to the usage share.
5. Add demand charge and VAT.
6. Round the final result into a cleaner adjusted split.

This makes it easy to explain how much of the electricity bill belongs to the submeter user versus the main meter user.

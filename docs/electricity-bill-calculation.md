# Electricity Bill Calculation Guide

This walkthrough explains how the electricity bill is split between the main meter and the submeter.

## What You Need

- Main meter start and end readings
- Submeter start and end readings
- Meter reading start and end dates
- Bill start and end dates
- Total units from the official bill
- Energy bill amount
- Demand charge
- VAT

## Step By Step Calculation

### 1. Find the reading period

Count how many days passed between the meter reading start date and end date.

### 2. Calculate meter consumption

Subtract the start reading from the end reading.

```text
main_consumption = main_end - main_start
sub_consumption = sub_end - sub_start
my_consumption = main_consumption - sub_consumption
```

### 3. Find daily usage

Divide each meter's total consumption by the number of reading days.

```text
main_per_day = main_consumption / reading_days
sub_per_day = sub_consumption / reading_days
my_per_day = my_consumption / reading_days
```

### 4. Project usage into the bill period

Use the same daily usage and multiply it by the number of days in the official bill period.

```text
main_usage_in_bill = main_per_day * bill_days
sub_usage_in_bill = sub_per_day * bill_days
my_usage_in_bill = my_per_day * bill_days
```

### 5. Match the usage with the official billed units

Compare the main meter usage with the official bill units and create a ratio.

```text
total_unit_ratio = total_units_from_bill / main_usage_in_bill

sub_meter_units = sub_usage_in_bill * total_unit_ratio
my_units = my_usage_in_bill * total_unit_ratio
```

This gives the share of the bill units for the submeter and for the main user.

### 6. Split the energy bill

Split the energy bill using the same unit share.

```text
sub_meter_ratio = sub_meter_units / total_units_from_bill
my_ratio = my_units / total_units_from_bill

sub_energy_bill = energy_bill * sub_meter_ratio
my_energy_bill = energy_bill * my_ratio
```

### 7. Split the fixed charges

Divide the demand charge and VAT equally between the two sides.

```text
individual_demand_charge = demand_charge / 2
individual_vat_charge = vat_charge / 2
```

### 8. Calculate the final bill

Add the energy bill, demand charge, and VAT together.

```text
sub_total = sub_energy_bill + individual_demand_charge + individual_vat_charge
my_total = my_energy_bill + individual_demand_charge + individual_vat_charge
```

### 9. Adjust the final values

The larger bill is rounded down to a whole number, and the decimal part is moved to the smaller bill.

This keeps the total amount balanced while making the numbers look cleaner.

## Worked Example

Use this example:

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

### B. Daily usage

The meter reading period is 28 days.

```text
main_per_day = 340 / 28 = 12.14 kWh
sub_per_day = 241 / 28 = 8.61 kWh
my_per_day = 99 / 28 = 3.54 kWh
```

### C. Usage in the bill period

The bill period is also 28 days.

```text
main_usage_in_bill = 12.14 * 28 = 340.00 kWh
sub_usage_in_bill = 8.61 * 28 = 241.00 kWh
my_usage_in_bill = 3.54 * 28 = 99.00 kWh
```

### D. Match to bill units

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

```text
adjusted_sub = 1960.00
adjusted_my = 883.00
```

## Short Summary

1. Measure how much electricity each meter used.
2. Convert that usage into a daily average.
3. Match that usage to the official bill period.
4. Split the bill based on the usage share.
5. Add demand charge and VAT.
6. Round the final result into a cleaner split.

In simple words, the app compares the main meter and submeter usage, then divides the electricity bill proportionally between them.

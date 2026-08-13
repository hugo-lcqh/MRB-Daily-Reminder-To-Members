# MRB Sample Layout

This is a simplified example. The real workbook can grow horizontally.

| A | B | C | D | E | F |
|---|---|---|---|---|---|
|  | CU CHI - MRB MEETING |  |  |  |  |
|  |  | Mon | Tue | Wed | Thu |
|  |  | 10-Aug | 11-Aug | 12-Aug | 13-Aug |
| TC5 | Example User One |  | X |  |  |
| TC5 | Example User Two |  |  | X |  |
|  | DAU GIAY - MRB MEETING |  |  |  |  |
|  |  | Mon | Tue | Wed | Thu |
|  |  | 10-Aug | 11-Aug | 12-Aug | 13-Aug |
| TC5 | Example User One |  |  |  | X |
| TC5 | Example User Two | X |  |  |  |

The script searches the date row from right to left and then finds the nearest member-name column to the left of the date column.

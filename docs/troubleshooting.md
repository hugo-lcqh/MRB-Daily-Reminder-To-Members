# Troubleshooting

## Group Chat Receives Raw JSON

Cause: the group message action is using `body/result` instead of `groupMessage`, or an old shared flow is still enabled.

Fix:

1. In the group Teams action, set Message to `Body groupMessage`.
2. Check **My flows** for older MRB flows.
3. Turn off duplicated shared or test flows.

## Private Messages Are Not Sent

Check the run history:

- `Run script` should succeed.
- `Parse JSON` should succeed.
- `Apply to each` should have one loop per attendee.
- The Teams action inside the loop should have a valid recipient email.

Also check the script output:

- `attendeeCount` should be greater than `0`.
- `missingEmails` should be empty.

## Script Finds The Date But No Attendees

Use `showDebugLog = true` when testing the script manually in Excel Online.

Check:

- `todayColumnName` is the expected date column.
- `nameColumnName` is the expected name column.
- `marksFound` contains the rows marked with `X`.

If `marksFound` is empty, the script is not seeing the `X` values in the date column. Confirm the marks are actual cell values, not shapes or comments.

## Missing Email

If a row has `X` but no email match, the name appears in `missingEmails`.

Fix the `Members` sheet:

- Column A must contain the attendee name.
- Column B must contain the Teams email / UPN.
- Remove extra spaces or spelling differences.

## BadGateway Or Timeout In `Run script`

The script reads a fixed range: `B1:AZZ120`.

If the workbook grows beyond this range, increase it carefully. Very large ranges can slow Power Automate.

Examples:

```typescript
const checkedRange = "B1:BAZ150";
```

Avoid reading the entire used range when the workbook has lots of formatting.

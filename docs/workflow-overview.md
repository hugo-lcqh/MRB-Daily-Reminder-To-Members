# Workflow Overview

For the complete architecture, including component responsibilities, data flow, and common failure modes, see [architecture.md](architecture.md).

## Flow

```text
Recurrence
-> Run script
-> Parse JSON
-> Apply to each attendee
   -> Post private message
-> Post group summary
```

## Office Script Responsibilities

The script:

1. Reads the `MRB` schedule sheet.
2. Reads the `Members` directory sheet.
3. Converts today's Vietnam date to a key such as `13-Aug`.
4. Searches the schedule date row from right to left.
5. Finds the nearest member-name column to the left of today's date column.
6. Finds rows marked with `X`.
7. Maps each marked attendee to an email address.
8. Builds private messages and a group summary.
9. Returns one JSON string for Power Automate.

## Returned Fields

### `attendees`

Used by `Apply to each`.

Each item includes:

- `name`
- `email`
- `group`
- `date`
- `message`

### `groupMessage`

Used by the final group-chat Teams action.

### `debug`

Used for troubleshooting.

Important debug fields:

- `todayKey`: date searched by the script.
- `todayColumnName`: Excel column where the date was found.
- `nameColumnName`: Excel column used for attendee names.
- `attendeeCount`: number of private reminders prepared.
- `missingEmails`: names marked with `X` but missing from `Members`.
- `marksFound`: all non-empty marks found in today's column.

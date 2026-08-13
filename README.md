# MRB Teams Reminder Flow

Power Automate workflow and Office Script for reading an Excel-based MRB meeting schedule, sending private Microsoft Teams reminders to each attendee, and posting a clean daily summary to a group chat.

This repository intentionally contains no real employee data, SharePoint links, Teams chat IDs, screenshots, or Power Automate connection identifiers.

## What It Does

The workflow runs once per day:

1. Opens the MRB schedule workbook.
2. Runs `GetTodayMRBAttendees`.
3. Finds today's date in the horizontal schedule.
4. Detects attendees marked with `X`.
5. Maps attendee names to Teams email addresses from the `Members` sheet.
6. Sends a private Teams reminder to each attendee.
7. Sends a summary message to a Teams group chat.

## Excel Workbook Requirements

The workbook must contain these sheets:

### `MRB`

- Contains the schedule matrix.
- The date row is Excel row `3`.
- An `X` in a date column means the person has an MRB meeting on that date.
- The schedule can grow horizontally over time.
- The script searches the date row from right to left, so the latest matching date is used.

### `Members`

Used as the name-to-email directory.

| Column | Value |
|---|---|
| A | Name |
| B | Teams email / UPN |

Names should match the names shown in the MRB schedule. The script trims extra spaces and compares case-insensitively.

## Repository Layout

```text
mrb-teams-reminder-flow/
├─ scripts/
│  └─ GetTodayMRBAttendees.ts
├─ power-automate/
│  └─ parse-json-schema.json
├─ docs/
│  ├─ workflow-setup-guide.md
│  ├─ workflow-overview.md
│  └─ troubleshooting.md
├─ samples/
│  ├─ Members-sample.csv
│  └─ MRB-sample-layout.md
└─ SECURITY.md
```

## Power Automate Flow Shape

```text
Recurrence
-> Run script
-> Parse JSON
-> Apply to each attendee
   -> Post private Teams message
-> Post group summary Teams message
```

## Script Output

The Office Script returns a JSON string:

```json
{
  "debug": {
    "todayKey": "13-aug",
    "todayColumnName": "QS",
    "nameColumnName": "B",
    "attendeeCount": 2
  },
  "groupMessage": "Nhac lich hop MRB hom nay...",
  "attendees": [
    {
      "name": "Example User",
      "email": "example.user@company.com",
      "group": "CU CHI - MRB MEETING",
      "date": "13-Aug",
      "message": "Hi Example User,..."
    }
  ]
}
```

Use `groupMessage` for the shared group chat and `attendees[*].email` plus `attendees[*].message` for private messages.

## Quick Start

1. Copy `scripts/GetTodayMRBAttendees.ts` into Excel Online under **Automate**.
2. Create or update the `Members` sheet in the workbook.
3. In Power Automate, create a scheduled cloud flow.
4. Add **Excel Online (Business) -> Run script**.
5. Add **Data Operations -> Parse JSON** with `power-automate/parse-json-schema.json`.
6. Add **Apply to each** over `attendees`.
7. Inside the loop, send private Teams messages.
8. Outside the loop, send one group summary using `groupMessage`.

See [docs/workflow-setup-guide.md](docs/workflow-setup-guide.md) for detailed setup.

# Workflow Setup Guide

This guide describes how to build the Power Automate flow for MRB meeting reminders.

## 1. Prepare The Workbook

Create two sheets:

- `MRB`: the schedule matrix.
- `Members`: the name-to-email directory.

In `Members`, use:

| A | B |
|---|---|
| Name | Email |
| Example User | example.user@company.com |

Do not store test or production secrets in this workbook.

## 2. Add The Office Script

1. Open the workbook in Excel Online.
2. Go to **Automate**.
3. Create a new script named `GetTodayMRBAttendees`.
4. Paste the contents of `scripts/GetTodayMRBAttendees.ts`.
5. Save the script.

For script testing only, set `showDebugLog` to `true` when running manually. Keep it `false` for Power Automate.

## 3. Create The Scheduled Cloud Flow

1. Open Power Automate.
2. Create a **Scheduled cloud flow**.
3. Set the recurrence:
   - Frequency: `Day`
   - Interval: `1`
   - Time zone: `(UTC+07:00) Bangkok, Hanoi, Jakarta`
   - Hour/minute: choose the daily reminder time.

## 4. Add `Run Script`

Add **Excel Online (Business) -> Run script**.

Typical settings:

- Location: `OneDrive for Business` or the relevant SharePoint site.
- Document Library: the library containing the workbook.
- File: the workbook path.
- Script: `GetTodayMRBAttendees`.

## 5. Add `Parse JSON`

Add **Data Operations -> Parse JSON**.

- Content: dynamic value `body/result` from `Run script`.
- Schema: paste `power-automate/parse-json-schema.json`.

## 6. Send Private Messages

Add **Apply to each**.

- Input: `attendees` from `Parse JSON`.

Inside the loop, add **Microsoft Teams -> Post message in a chat or channel**:

- Post as: `Flow bot`
- Post in: `Chat with Flow bot`
- Recipient: `Body email`
- Message: `Body message`

If the dynamic values do not appear, use expressions:

```text
items('Apply_to_each')?['email']
```

```text
items('Apply_to_each')?['message']
```

## 7. Send Group Summary

Outside the `Apply to each` loop, add another **Post message in a chat or channel** action:

- Post as: `Flow bot`
- Post in: `Group chat`
- Group chat: select the target group chat.
- Message: `Body groupMessage`

If the dynamic value does not appear, use:

```text
body('Parse_JSON')?['groupMessage']
```

## 8. Test Safely

During testing:

- Use a test workbook.
- Temporarily map attendee emails in `Members` to your own email.
- Use a test group chat.
- Turn off older shared flows to avoid duplicate messages.

Run **Save -> Test -> Manually -> Run flow**.

# Security Notes

This project is designed for internal workflow automation. Treat employee names, emails, meeting schedules, SharePoint links, Teams chat IDs, and Power Automate connection identifiers as sensitive internal data.

## Do Not Commit

- Real Excel workbooks.
- Real employee email lists.
- SharePoint or OneDrive URLs.
- Teams group chat IDs.
- Power Automate exported packages that include connection references.
- Screenshots with tenant, user, or company-private information.

## Recommended Repository Visibility

Use a private GitHub repository unless your company explicitly approves public publication.

## Testing

When testing private messages, map all attendee emails in the `Members` sheet to your own email first. Replace them with real user emails only after the flow is verified.

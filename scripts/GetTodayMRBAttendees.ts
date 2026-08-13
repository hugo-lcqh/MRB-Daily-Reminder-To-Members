function main(workbook: ExcelScript.Workbook, showDebugLog: boolean = false): string {
  const scheduleSheet = workbook.getWorksheet("MRB");
  const membersSheet = workbook.getWorksheet("Members");

  const startColumnNumber = 2; // B = 2
  const checkedRange = "B1:AZZ120";
  const scheduleValues = scheduleSheet.getRange(checkedRange).getValues();
  const memberValues = membersSheet.getUsedRange().getValues();

  const memberEmailByName = new Map<string, string>();

  for (let r = 1; r < memberValues.length; r++) {
    const name = normalizeName(memberValues[r][0]);
    const email = String(memberValues[r][1] ?? "").trim();

    if (name && email) {
      memberEmailByName.set(name, email);
    }
  }

  const dateRow = 2; // Excel row 3
  const todayDisplay = toDayMonthKey(getVietnamToday());
  const todayKey = todayDisplay.toLowerCase();

  let todayCol = -1;

  for (let c = scheduleValues[dateRow].length - 1; c >= 0; c--) {
    const dateKey = cellToDayMonthKey(scheduleValues[dateRow][c]).toLowerCase();

    if (dateKey === todayKey) {
      todayCol = c;
      break;
    }
  }

  const nameCol = todayCol === -1 ? -1 : findNameColumnForToday(scheduleValues, todayCol);

  const attendees: {
    name: string;
    email: string;
    group: string;
    date: string;
    message: string;
  }[] = [];

  const missingEmails: string[] = [];

  const marksFound: {
    row: number;
    name: string;
    rawMark: string;
    normalizedMark: string;
    emailFound: boolean;
  }[] = [];

  let currentGroup = "";

  if (todayCol !== -1 && nameCol !== -1) {
    for (let r = 0; r < scheduleValues.length; r++) {
      const name = String(scheduleValues[r][nameCol] ?? "").trim();
      const rawMark = String(scheduleValues[r][todayCol] ?? "");
      const mark = normalizeMark(rawMark);

      if (rawMark.trim()) {
        marksFound.push({
          row: r + 1,
          name,
          rawMark,
          normalizedMark: mark,
          emailFound: memberEmailByName.has(normalizeName(name))
        });
      }

      if (name.includes("MRB MEETING")) {
        currentGroup = name;
        continue;
      }

      if (!name || r <= dateRow) {
        continue;
      }

      if (mark === "X") {
        const email = memberEmailByName.get(normalizeName(name)) ?? "";

        if (!email) {
          missingEmails.push(name);
          continue;
        }

        attendees.push({
          name,
          email,
          group: currentGroup,
          date: todayDisplay,
          message: [
            `Hi ${name},`,
            "",
            `Hôm nay (${todayDisplay}) bạn có lịch họp MRB: ${currentGroup}.`,
            "",
            "Vui lòng tham dự đúng giờ. Cảm ơn bạn."
          ].join("\n")
        });
      }
    }
  }

  const groupMessage =
    attendees.length === 0
      ? `Hôm nay (${todayDisplay}) không có lịch họp MRB.`
      : [
          `Nhắc lịch họp MRB hôm nay (${todayDisplay}):`,
          "",
          ...attendees.map((attendee, index) =>
            `${index + 1}. ${attendee.name} (${attendee.group})`
          ),
          "",
          "Vui lòng tham dự đúng giờ. Cảm ơn mọi người."
        ].join("\n");

  const todayColumnNumber = todayCol === -1 ? -1 : startColumnNumber + todayCol;
  const nameColumnNumber = nameCol === -1 ? -1 : startColumnNumber + nameCol;

  const result = {
    debug: {
      todayKey,
      todayColumnName: todayCol === -1 ? "" : columnNumberToName(todayColumnNumber),
      nameColumnName: nameCol === -1 ? "" : columnNumberToName(nameColumnNumber),
      attendeeCount: attendees.length,
      checkedRange,
      missingEmailCount: missingEmails.length,
      missingEmails,
      marksFound
    },
    groupMessage,
    attendees
  };

  if (showDebugLog) {
    console.log(JSON.stringify(result, null, 2));
  }

  return JSON.stringify(result);
}

function findNameColumnForToday(values: (string | number | boolean)[][], todayCol: number): number {
  for (let c = todayCol - 1; c >= 0; c--) {
    let score = 0;

    for (let r = 0; r < values.length; r++) {
      const text = String(values[r][c] ?? "").trim();

      if (!text) {
        continue;
      }

      if (text.includes("MRB MEETING")) {
        score += 5;
        continue;
      }

      if (text.length >= 5 && /[A-Za-zÀ-ỹ]/.test(text) && !/^\d{1,2}-[A-Za-z]{3}$/.test(text)) {
        score++;
      }
    }

    if (score >= 5) {
      return c;
    }
  }

  return -1;
}

function normalizeName(value: string | number | boolean): string {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function normalizeMark(value: string | number | boolean): string {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace("×", "X")
    .replace("✕", "X")
    .replace("Ｘ", "X");
}

function getVietnamToday(): Date {
  const now = new Date();
  return new Date(now.getTime() + 7 * 60 * 60 * 1000);
}

function cellToDayMonthKey(value: string | number | boolean): string {
  if (typeof value === "number") {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(excelEpoch.getTime() + value * 86400000);
    return toDayMonthKey(date);
  }

  const text = String(value ?? "").trim();
  const match = text.match(/^(\d{1,2})-([A-Za-z]{3})$/);

  if (match) {
    return `${Number(match[1])}-${match[2].slice(0, 3)}`;
  }

  return text;
}

function toDayMonthKey(date: Date): string {
  const day = date.getUTCDate();
  const month = date.toLocaleString("en-US", {
    month: "short",
    timeZone: "UTC"
  });

  return `${day}-${month}`;
}

function columnNumberToName(columnNumber: number): string {
  let name = "";

  while (columnNumber > 0) {
    const remainder = (columnNumber - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    columnNumber = Math.floor((columnNumber - 1) / 26);
  }

  return name;
}

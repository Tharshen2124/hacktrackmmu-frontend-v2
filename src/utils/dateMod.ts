export function dateMod(val: string) {
  const [a] = val.split("T");
  const [year, month, day] = a.split("-");
  let monthName = " ";

  switch (month) {
    case "01":
      monthName = "January";
      break;
    case "02":
      monthName = "Febuary";
      break;
    case "03":
      monthName = "March";
      break;
    case "04":
      monthName = "April";
      break;
    case "05":
      monthName = "May";
      break;
    case "06":
      monthName = "June";
      break;
    case "07":
      monthName = "July";
      break;
    case "08":
      monthName = "August";
      break;
    case "09":
      monthName = "September";
      break;
    case "10":
      monthName = "October";
      break;
    case "11":
      monthName = "November";
      break;
    case "12":
      monthName = "December";
      break;
  }

  const fullDate = `${day} ${monthName} ${year}`;

  return fullDate;
}

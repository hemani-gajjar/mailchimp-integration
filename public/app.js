const excel_file = document.getElementById("excel_file");

var sheet_data;
console.log("Sheet Data" + sheet_data);

const submitBtnElement = document.getElementsByClassName("subBtn")[0];
const sendBtnElement = document.getElementsByClassName("sendBtn")[0];
const subLineElement = document.getElementsByClassName("subLine")[0];
const mailContentElement = document.getElementsByClassName("mailContent")[0];
const schedBtnElement = document.getElementsByClassName("schedBtn")[0];
const prevBtnElement = document.getElementsByClassName("prevBtn")[0];
const dateTimeElement = document.getElementsByClassName("datetimepicker")[0];
const startBtnElement = document.getElementsByClassName("startBtn")[0];
const freqSelectElement = document.getElementsByClassName("frequency")[0];
const timeSelectElement = document.getElementsByClassName("time")[0];
const daySelectElement = document.getElementsByClassName("form-check-input");

let iFrameElement = document.getElementById("code");

submitBtnElement.addEventListener("click", () => {
  // Example request options
  fetch("http://localhost:5000/submit", {
    method: "post", // Default is 'get'
    body: JSON.stringify({
      value: "test",
      array: sheet_data,
    }),
    mode: "cors",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      if (data) {
        console.log(data);
        if (data.statusCode == 200) {
          // Snackbar
          var x = document.getElementById("members-snackbar");
          // Show the Snackbar
          // Add the "show" class to div
          x.className = "show";
          // After 3 seconds, remove the show class from div
          setTimeout(function () {
            x.className = x.className.replace("show", "");
          }, 3000);
        }
      }
    })
    .catch((err) => console.error(err));
});

function compilePreview() {
  var html = document.getElementById("rawHtml");
  var code = document.getElementById("code").contentWindow.document;

  document.body.onkeyup = function () {
    code.open();
    code.writeln(html.value);
    code.close();
  };
}

compilePreview();

sendBtnElement.addEventListener("click", () => {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:5000/send", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(
    JSON.stringify({
      value: "test",
      subject: subLineElement.value,
      content: mailContentElement.value,
    })
  );
});

schedBtnElement.addEventListener("click", () => {
  console.log("Schedule Button was clicked!");
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:5000/schedule", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(
    JSON.stringify({
      dateTime: dateTimeElement.value,
    })
  );
});

prevBtnElement.addEventListener("click", () => {
  console.log("Preview button was clicked!");
  initialText = "Preview";
  if (
    prevBtnElement.textContent.toLowerCase().includes(initialText.toLowerCase())
  ) {
    prevBtnElement.textContent = "Close";
    iFrameElement.scrollIntoView();
  } else {
    prevBtnElement.textContent = initialText;
  }

  //   if ((prevBtnElement.textContent = "Preview")) {
  //     prevBtnElement.textContent = "Close";
  //   } else if ((prevBtnElement.textContent = "Close")) {
  //     prevBtnElement.textContent = "Preview";
  //   }

  var code = document.getElementById("code");
  if (code.style.display === "none") {
    code.style.display = "block";
  } else {
    code.style.display = "none";
  }
});

startBtnElement.addEventListener("click", () => {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:5000/start", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(
    JSON.stringify({
      frequency: freqSelectElement.value,
      hour: timeSelectElement.value,
      dailySend: {
        sunday: daySelectElement[0].checked,
        monday: daySelectElement[1].checked,
        tuesday: daySelectElement[2].checked,
        wednesday: daySelectElement[3].checked,
        thursday: daySelectElement[4].checked,
        friday: daySelectElement[5].checked,
        saturday: daySelectElement[6].checked,
      },
    })
  );
});

excel_file.addEventListener("change", (event) => {
  var reader = new FileReader();
  reader.readAsArrayBuffer(event.target.files[0]);
  reader.onload = function (event) {
    var data = new Uint8Array(reader.result);
    var work_book = XLSX.read(data, { type: "array" });
    var sheet_name = work_book.SheetNames;
    sheet_data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], {
      header: 1,
    });
    console.log(sheet_data);

    if (sheet_data.length > 0) {
      var table_output = '<table class="table table-striped table-bordered">';
      for (var row = 0; row < sheet_data.length; row++) {
        table_output += "<tr>";
        for (var cell = 0; cell < sheet_data[row].length; cell++) {
          if (row == 0) {
            table_output += "<th>" + sheet_data[row][cell] + "</th>";
          } else {
            table_output += "<td>" + sheet_data[row][cell] + "</td>";
          }
        }
        table_output += "</tr>";
      }
      table_output += "</table>";
      table_output += "<br/>";

      document.getElementById("excel_data").innerHTML = table_output;
    }
  };
});

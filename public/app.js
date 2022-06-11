const excel_file = document.getElementById("excel_file");

var sheet_data;
console.log("Sheet Data" + sheet_data);

const submitBtnElement = document.getElementsByClassName("subBtn")[0];
const sendBtnElement = document.getElementsByClassName("sendBtn")[0];
const subLineElement = document.getElementsByClassName("subLine")[0];
const mailContentElement = document.getElementsByClassName("mailContent")[0];
const prevBtnElement = document.getElementsByClassName("prevBtn")[0];

submitBtnElement.addEventListener("click", () => {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:5000/submit", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(
    JSON.stringify({
      value: "test",
      array: sheet_data,
    })
  );

  // // Snackbar
  // var x = document.getElementById("snackbar");
  // // Add the "show" class to div
  // x.className = "show";
  // // After 3 seconds, remove the show class from div
  // setTimeout(function () {
  //   x.className = x.className.replace("show", "");
  // }, 3000);
});

function compilePreview() {
  var html = document.getElementById("rawHtml");
  var code = document.getElementById("code").contentWindow.document;

  console.log(html);
  console.log(code);

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

prevBtnElement.addEventListener("click", () => {
  console.log("Preview Button was clicked!");
  var code = document.getElementById("code");
  if (code.style.display === "none") {
    code.style.display = "block";
  } else {
    code.style.display = "none";
  }
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

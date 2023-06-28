// script.js
document.getElementById("pontoForm").addEventListener("submit", function(event) {
   event.preventDefault();

   var tipo = document.getElementById("tipo").value;
   var data = document.getElementById("data").value;
   var hora = document.getElementById("hora").value;

   var ponto = {
     tipo: tipo,
     data: data,
     hora: hora
   };

   var pontos = [];
   if (localStorage.getItem("pontos")) {
     pontos = JSON.parse(localStorage.getItem("pontos"));
   }

   // Verifica se já existe um ponto registrado com o mesmo tipo e data
   var pontoExistente = pontos.find(function(p) {
     return p.tipo === ponto.tipo && p.data === ponto.data;
   });

   if (pontoExistente) {
     alert("Já foi registrado um ponto do mesmo tipo para essa data.");
     return;
   }

   pontos.push(ponto);
   localStorage.setItem("pontos", JSON.stringify(pontos));

   displayPontos();
   document.getElementById("pontoForm").reset();
});

document.getElementById("filtroData").addEventListener("change", function() {
   displayPontos();
});

function displayPontos() {
   var pontos = [];
   if (localStorage.getItem("pontos")) {
     pontos = JSON.parse(localStorage.getItem("pontos"));
   }

   pontos.sort(function(a, b) {
     var dateA = new Date(a.data + "T" + a.hora);
     var dateB = new Date(b.data + "T" + b.hora);
     return dateB - dateA;
   });

   var filtroData = document.getElementById("filtroData").value;
   if (filtroData) {
     pontos = pontos.filter(function(ponto) {
       return ponto.data === filtroData;
     });
   }

   var pontosTableBody = document.getElementById("pontosTableBody");
   pontosTableBody.innerHTML = "";

   pontos.forEach(function(ponto) {
     var row = document.createElement("tr");

     var tipoCell = document.createElement("td");
     tipoCell.textContent = ponto.tipo;
     row.appendChild(tipoCell);

     var dataCell = document.createElement("td");
     var dataFormatted = formatDate(ponto.data);
     dataCell.textContent = dataFormatted;
     row.appendChild(dataCell);

     var horaCell = document.createElement("td");
     horaCell.textContent = ponto.hora;
     row.appendChild(horaCell);

     var deleteCell = document.createElement("td");
     var deleteButton = document.createElement("button");
     deleteButton.textContent = "Excluir";
     deleteButton.className = "btn btn-danger btn-sm";
     deleteButton.addEventListener("click", function() {
       deletePonto(ponto);
     });
     deleteCell.appendChild(deleteButton);
     row.appendChild(deleteCell);

     pontosTableBody.appendChild(row);
   });
}

function deletePonto(ponto) {
   var pontos = JSON.parse(localStorage.getItem("pontos"));

   pontos = pontos.filter(function(item) {
     return (
       item.tipo !== ponto.tipo ||
       item.data !== ponto.data ||
       item.hora !== ponto.hora
     );
   });

   localStorage.setItem("pontos", JSON.stringify(pontos));
   displayPontos();
}

function formatDate(dateString) {
   var dateParts = dateString.split("-");
   var day = dateParts[2];
   var month = dateParts[1];
   var year = dateParts[0];
   return day + "/" + month + "/" + year;
}

displayPontos();

var vehicles = [];

async function init() {
  var stored = localStorage.getItem("shift-vehicles");
  if (stored && JSON.parse(stored).length > 0) {
    vehicles = JSON.parse(stored);
  } else {
    var res = await fetch("vehicles.json");
    vehicles = await res.json();
  }
  populateFilters();
  renderVehicles(vehicles);
}

function populateFilters() {
  var years = [...new Set(vehicles.map(function(v){return v.year;}))].sort().reverse();
  var sel = document.getElementById("filter-year");
  years.forEach(function(y){ var o = document.createElement("option"); o.value=y; o.textContent=y; sel.appendChild(o); });
}

function filterVehicles() {
  var search = document.getElementById("search").value.toLowerCase();
  var year = document.getElementById("filter-year").value;
  var filtered = vehicles.filter(function(v) {
    var matchSearch = (v.brand + " " + v.model).toLowerCase().indexOf(search) >= 0;
    var matchYear = !year || v.year == year;
    return matchSearch && matchYear;
  });
  renderVehicles(filtered);
}

function renderVehicles(list) {
  var grid = document.getElementById("vehicles-grid");
  if (list.length === 0) { grid.innerHTML = "<p style='text-align:center;color:var(--text-muted)'>Nenhum veiculo encontrado.</p>"; return; }
  grid.innerHTML = list.map(function(v,i) {
    return '<div class="vehicle-card" onclick="openDetail('+i+')">' +
      '<img src="'+(v.image||"https://via.placeholder.com/400x200/222/666?text=Sem+Foto")+'" alt="'+v.brand+" "+v.model+'">' +
      '<div class="info"><h3>'+v.brand+" "+v.model+'</h3>' +
      '<div class="year-km">'+v.year+' | '+v.km+' km | '+v.fuel+'</div>' +
      '<div class="price">R$ '+v.price+'</div></div></div>';
  }).join("");
}

function openDetail(index) {
  var v = vehicles[index];
  var modal = document.getElementById("vehicle-modal");
  modal.innerHTML = '<div class="modal-content">' +
    '<button class="modal-close" onclick="closeDetail()">&times;</button>' +
    '<img src="'+(v.image||"https://via.placeholder.com/800x400/222/666?text=Sem+Foto")+'" alt="'+v.brand+" "+v.model+'">' +
    '<h2>'+v.brand+' '+v.model+'</h2>' +
    '<div class="detail-price">R$ '+v.price+'</div>' +
    '<div class="specs">' +
      '<div class="spec-item"><div class="label">Ano</div><div class="value">'+v.year+'</div></div>' +
      '<div class="spec-item"><div class="label">Km</div><div class="value">'+v.km+' km</div></div>' +
      '<div class="spec-item"><div class="label">Combustivel</div><div class="value">'+v.fuel+'</div></div>' +
      '<div class="spec-item"><div class="label">Cambio</div><div class="value">'+v.transmission+'</div></div>' +
      '<div class="spec-item"><div class="label">Cor</div><div class="value">'+v.color+'</div></div>' +
      '<div class="spec-item"><div class="label">Portas</div><div class="value">'+v.doors+'</div></div>' +
    '</div>' +
    '<div class="description">'+v.description+'</div>' +
    '<a href="https://wa.me/5511939347332?text=Ola! Tenho interesse no '+v.brand+' '+v.model+' '+v.year+'" class="whatsapp-detail" target="_blank">Tenho Interesse - WhatsApp</a>' +
  '</div>';
  modal.classList.add("active");
}

function closeDetail() {
  document.getElementById("vehicle-modal").classList.remove("active");
}

document.addEventListener("keydown", function(e){ if(e.key==="Escape") closeDetail(); });

init();



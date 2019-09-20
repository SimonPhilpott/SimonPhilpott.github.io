function filterResults() {
  // Declare variables 
  var input, filter, table, tr, td, service, taxonomy, i;
  input = document.getElementById("searchBar");
  filter = input.value.toUpperCase();
  table = document.getElementById("searchable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    service = tr[i].getElementsByTagName("td")[1];
    taxonomy = tr[i].getElementsByTagName("td")[2];
    fullTerm = service + " " + taxonomy;
    if (service, taxonomy) {
      if (service.textContent.toUpperCase().indexOf(filter) > -1 ||  taxonomy.textContent.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = ""; }
       else {
        tr[i].style.display = "none";
      }
    } 
  }
}
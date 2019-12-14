    function drawTable(size) {
        // get the reference for the body
        var div1 = document.getElementById('mapdiv');

        // creates a <table> element
        var tbl = document.createElement("table");

        // creating rows
        for (var r = 0; r < size; r++) {
            var row = document.createElement("tr");

	     // create cells in row
             for (var c = 0; c < size; c++) {
                var cell = document.createElement("td");
		// getRandom = Math.floor(Math.random() * (max - min + 1)) + min;
                // var cellText = document.createTextNode(Math.floor(Math.random() * (max - min + 1)) + min);
                if (maze[size - 1 - r][ size - 1- c] && !(r == entranceZidx - 1 && c == entranceXidx)) { //needs to be reversed
                  cell.setAttribute('class', 'tree');
                }
                else {
                  cell.setAttribute('class', 'empty');
                }
                // cell.appendChild(cellText);
                row.appendChild(cell);
            }

	tbl.appendChild(row); // add the row to the end of the table body
        }

     div1.appendChild(tbl); // appends <table> into <div1>
}
// window.onload=drawTable;

// 
// function updateTable(size, row, col) {
//   document.remove("table");
//   drawTable(size);
// }

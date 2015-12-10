var templ_table = _.template (
    "<tbody> <%_.forEach(rows, function (u) {%>"
	+ "<%= u %>"
	+ "<%})%> </tbody>"
);

var templ_row = _.template (
    "<tr> <%_.forEach(cells, function (u) {%>"
	+ "<%= u %>"
	+ "<%})%> </tr>"
);

var templ_cell = _.template(
	"<td> <div class='square' id='<%= id %>' > <%= shape %> </div> </td>" 
);

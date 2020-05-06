
// Global variable containing the filtering tags
selected_tags = new Set();

// Filtering function
$.fn.dataTable.ext.search.push(
    function(settings, data, dataIndex) {
        if (selected_tags.size == 0) {
            // show all rows if no tag is selected
            return true;
        }
        else {
            // show only rows whose at least one tag matches the selected tags
            data_tags = data[0].split(" ");
            for (var i = 0; i < data_tags.length; i++) {
                if ( selected_tags.has(data_tags[i]) ) {
                    return true;
                }
            }
        }
        return false;
    }
);

// Helper to build link/tag sub-classe names
function getSubClass(class_type, str) {
    return class_type + "_" + str.replace(/[^a-zA-Z-_]/g,'_');
}

// Links
function buildLink(link) {
    return "<div class='link " + getSubClass("link", link.text) + "'><a href='" + link.url + "'>" + link.text + "</a></div>";
}

function buildLinksCell(links) {
    var linksCell = "";
    $.each(links, function(index, link) {
        linksCell += buildLink(link);
    });
    return linksCell
}

// Tags
function buildTag(tag) {
    return "<div class='tag " + getSubClass("tag", tag) + "' onclick='toggleTag(\"" + tag + "\")'>" + tag + "</div>";
}

function buildTagsCell(tags, unique_tags) {
    var tagsCell = "";
    var separator = ""
    $.each(tags, function(index, tag) {
        // Build content
        tagsCell += separator + buildTag(tag);
        separator = " "

        // Save to tag list
        if (unique_tags.indexOf(tag) == -1) {
            unique_tags.push(tag);
        }
    });
    return tagsCell
}

function updateTagSelector() {
    $('#tag_selector .tag').each(function(index) {
        if( selected_tags.has( $(this).text() ) ) {
            $(this).addClass('selected');
        }
        else {
            $(this).removeClass('selected');
        }
    });
}

function toggleTag(tag) {
    // Change tag selection
    if( selected_tags.has(tag) ) {
        selected_tags.delete(tag);
    }
    else {
        selected_tags.add(tag);
    }

    // Update view
    updateTagSelector();
    $('#files').DataTable().draw();
}

// Main
$(document).ready(function() {
    $.getJSON( "SQL.json", function( data ) {
        var unique_tags = []

        // Read JSON
        var DT_columns = [ {"title": "Tags"}, {"title": "Table"}, {"title": "Column"}, {"title": "Type"}, {"title": "C++ Binding"} ];
        var DT_data = [];
        $.each( data.tables, function(index, table) {
            var tagsCell = "";
            if( "tags" in table ) {
                tagsCell = buildTagsCell(table.tags, unique_tags);
            }
            var tableCell = table.name;
            if( "links" in table ) {
                tableCell = "<a href='" + table["links"]["url"] + "'>" + table.name + "</a>";
            }
            $.each( table.columns, function(cindex, column) {
                var bindCell = ""
                if( "bind" in column ) {
                    bindCell = column.bind
                }
                DT_data.push( [tagsCell, tableCell, column.name, column.type, bindCell] )
            })
        });

        // Build table
        var table = $('#files').DataTable( {
            data: DT_data,
            columns: DT_columns,
            paging: false
        });

        // Add all tags to tag selector
        $.each(unique_tags, function(index, tag) {
            $('#tag_selector').append( buildTag(tag) );
        });
    });
});


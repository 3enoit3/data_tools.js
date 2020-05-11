
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
            data_tags = data[2].split(" ");
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
    $('#rows').DataTable().draw();
}

// Main
$(document).ready(function() {
    $.getJSON("cpp_features.json", function(data) {
        var unique_tags = []

        // Read JSON
        var DT_columns = [ {"title": "name"}, {"title": "links"}, {"title": "tags"}, {"title": "comments"} ];
        var DT_data = [];
        $.each( data.rows, function(index, row) {
            DT_data.push( [row.name,
                          buildLinksCell(row.links),
                          buildTagsCell(row.tags, unique_tags),
                          row.comments] );
        });

        // Build table
        var table = $('#rows').DataTable( {
            data: DT_data,
            columns: DT_columns,
            paging: false
        });

        // Add all tags to tag selector
        $.each(unique_tags.sort(), function(index, tag) {
            $('#tag_selector').append( buildTag(tag) );
        });
    });
});


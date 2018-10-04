var reference = [];
var lastSearch = '';

const getJSON = url => fetch(url).then(r => r.json());

function loadContent() {
    return fetch("reference.json")
        .then(
            data => {return data.json()},
            (j, s, e) => console.log(e)
        );
}

function makeArg(name, type, desc, optional) {
    var argClass = $('<span>')
        .addClass('arg')
        .addClass('arg-type-' + type)
        .text(optional ? '[' + name + ']' : name)
        .attr('arg-desc', desc)
        .attr('arg-type', type)
        .hover(function() {
            $(this).children().fadeIn(100);
        }, function() {
            $(this).children().fadeOut(100);
        })
    var argTooltip = $('<div>')
        .addClass('arg-tooltip')
        .append($('<span>').addClass('arg-tooltip-text')
            .text(desc)
        )
        .hide()
    console.log(argTooltip);
    argClass.append(argTooltip);
    return argClass;
}

function makeTag(tag) {
    var tagClass = $('<div>')
        .addClass('tag')
        .addClass('tag-' + tag)
        .text(tag)
        .hover(function() {
            var current = $(this);
            $('.tag-' + current.text()).not(current).parents('div.function').addClass('highlighted')
        }, function() {
            var current = $(this);
            $('.tag-' + current.text()).not(current).parents('div.function').removeClass('highlighted')
        });
    return tagClass;
}

function constructFunction(f) {
    var div = $('<div>').addClass('function');
    var name = $('<div>').addClass('function-name').text(f.function);
    var info = $('<div>').addClass('function-info')
    var usage = $('<div>').addClass('function-usage');

    var args = [];
    usage.append(f.function + '(');
    for (var i = 0; i < f.arguments.length; i++) {
        var arg = f.arguments[i];
        usage.append(makeArg(arg.name, arg.type, arg.desc, arg.optional));
        if (i < f.arguments.length - 1) {
            usage.append(', '); 
        }
    }
    usage.append(')');
    if (f.returns) {
        var returns = $('<span>').addClass('returns');
        returns.append(' -> ')
        returns.append(makeArg(f.returns.type, f.returns.type, f.returns.desc, false));
    }

    usage.append(returns);

    var desc = $('<div>').addClass('function-desc');

    $.each(f.desc, function() {
        switch (this.type) {
            case 'text':
                desc.append($('<p>').text(this.content));
                break;
        }
    })

    var tags = $('<div>').addClass('function-tags');

    $.each(f.tags, function() {
        tags.append(makeTag(this));
    })

    name.click(function() {
        $(this).parent().children('.function-info').toggle(100);
        $(this).parent().children('.function-name').toggleClass('underline');
    })

    info.append($('<span>').addClass('function-usage-text').text("> "));
    info.append(usage);
    info.append(desc);
    info.append(tags);
    info.toggle();
    div.append(name)
    div.append(info);
    return div;
}

function viewByWeek() {
    $('.content').empty();
    var weeks = [];
    var has_general = false;
    $.each(reference.functions, function() {
        if (this.hasOwnProperty('week'))
            weeks.push(this.week);
        else has_general = true;
    });
    weeks.sort();
    $.each(weeks, function() {
        if ($('.content').children('#week-' + this).length == 0) {
            var week = $('<div>')
                .addClass('week')
                .attr("id", 'week-' + this)
                .append(
                    $('<div>')
                    .addClass('week-heading')
                    .text("Week " + this)
                );
            week.append($('<div>').addClass('function-list'));
            $('.content').append(week);
        }
    });
    if (has_general) {
        var general = $('<div>')
            .addClass('week')
            .attr("id", 'week-general')
            .append(
                $('<div>')
                .addClass('week-heading')
                .text("General")
            );
        general.append($('<div>').addClass('function-list'));
        $('.content').append(general);
    }
    $.each(reference.functions, function() {
        if (this.hasOwnProperty("week"))
            $('#week-' + this.week + '> .function-list').append(constructFunction(this));
        else
            $('#week-general > .function-list').append(constructFunction(this));
    });
}

function viewByTag() {
    $('.content').empty();
    var tags = {};
    $.each(reference.functions, function(_, func) {
        $.each(func.tags, function(_, tag) {
            if (!tags.hasOwnProperty(tag)) {
                tags[tag] = [];
            }
            tags[tag].push(func)
        });
    });

    $.each(tags, function(key, value) {
        var tagCont = $('<div>')
            .addClass('tag-cont')
            .attr('id', 'tag-cont-' + key)
            .append(
                $('<div>')
                .addClass('tag-heading')
                .text(key.toUpperCase())
            )
        var functionList = $('<div>').addClass('function-list');
        $.each(value, function(_, func) {
            functionList.append(constructFunction(func));
        });
        tagCont.append(functionList);
        $('.content').append(tagCont)
    })
}

function filterFunctions() {
    var text = $('.search > input').val().toLowerCase().trim();
    if (text == lastSearch) return;
    lastSearch = text;
    if (text == '') {
        $('.function').show().parent().parent().show();
        return;
    }
    $('.function').filter(function() {
        return !$(this).text().toLowerCase().includes(text)
    }).hide().parent().parent().not($(".function:visible").parent().parent()).hide();


    $('.function').filter(function() {
        return $(this).text().toLowerCase().includes(text)
    }).show().parent().parent().show()
}

$('*').on('keyup', function(event) {
    if (event.which == 70 || event.which == 191)
        $('.search > input').focus();
});

$(document).ready(function() {
    $('.search > input').on('keyup', filterFunctions);
    loadContent()
        .then((data) => {
            reference = data;
            console.log("Done loading. Rendering now.");
            viewByTag(); 
            // viewByWeek();
        });
});

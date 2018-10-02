var reference = [];

function loadContent() {
    return $.getJSON("reference.json")
        .done(function (data) {
            reference = data;
        })
        .fail(function (j, s, e) {
            console.log(e)
        }).promise();
}

function makeArg(name, type, desc, optional) {
    var argClass = $('<span>')
        .addClass('arg')
        .addClass(type)
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
    div.append($('<div>').addClass('function-name').text(f.function))
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

    info.append($('<span>').addClass('function-usage-text').text("Usage: "));
    info.append(usage);
    info.append(desc);
    info.append(tags);
    info.toggle();
    div.append(info);
    div.click(function() {
        $(this).children('.function-info').toggle(100);
        $(this).children('.function-name').toggleClass('underline');
    })
    return div;
}

function viewByWeek() {
    var weeks = [];
    $.each(reference.functions, function() {
        console.log("Found week " + this.week);
        if (this.hasOwnProperty('week'))
            weeks.push(this.week);
    });
    weeks.sort();
    $.each(weeks, function() {
        if ($('.content').children('#week-' + this).length == 0) {
            console.log("Adding week " + this);
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

    $.each(reference.functions, function() {
        console.log("Adding " + this.function)
        if (this.hasOwnProperty("week"))
            $('#week-' + this.week + '> .function-list').append(constructFunction(this));
        else
            $('#week-general > .function-list').append(constructFunction(this));
    });
}

function filterFunctions() {
    var text = $('.search > input').val().toLowerCase();
    console.log(text);
    $('.function').filter(function() {
        return !$(this).text().toLowerCase().includes(text)
    }).hide()
    $('.function').filter(function() {
        return $(this).text().toLowerCase().includes(text)
    }).show().parent().parent().show()
    $(".function:hidden").parent().parent().not($(":visible").parent().parent()).hide();
}

$(document).ready(function() {
    $('.search > input').keyup(filterFunctions);
    loadContent()
        .done(function() {
            console.log("Done loading. Rendering now.");
            viewByWeek();
        });
});

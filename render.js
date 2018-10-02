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

function makeArg(name, type, desc) {
    var argClass = $('<span>')
        .addClass('arg')
        .addClass(type)
        .text(name)
        .attr('arg-desc', desc)
        .attr('arg-type', type)
        .hover(function() {
            $(this).children().fadeToggle({duration: 100, queue: true});
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

function constructFunction(f) {
    var div = $('<div>').addClass('function');
    div.append($('<div>').addClass('function-name').text(f.function))
    var info = $('<div>').addClass('function-info')
    var usage = $('<div>').addClass('function-usage');

    var args = [];
    usage.append(f.function + '(');
    for (var i = 0; i < f.arguments.length; i++) {
        var arg = f.arguments[i];
        usage.append(makeArg(arg.name, arg.type, arg.desc));
        if (i < f.arguments.length - 1) {
            usage.append(', '); 
        }
    }
    usage.append(')');
    if (f.returns) {
        var returns = $('<span>').addClass('returns');
        returns.append(' -> ')
        returns.append(makeArg(f.returns.type, f.returns.type, f.returns.desc));
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

    info.append(usage);
    info.append(desc);
    info.toggle();
    div.append(info);
    div.click(function() {
        $(this).children('.function-info').toggle(100);
        $(this).children('.function-name').toggleClass('underline');
    })
    return div;
}

function viewByWeek() {
    $.each(reference, function() {
        var weekNum = this.week;
        var week = $('<div>')
            .addClass('week')
            .attr("id", 'week-' + weekNum)
            .append(
                $('<div>')
                .addClass('week-heading')
                .text("Week " + weekNum)
            );
        $('.content').append(week);
        var functions = $('<div>').addClass('function-list');
        $.each(this.content, function() {
            console.log("Adding " + this.function)
            functions.append(constructFunction(this));
        });
        week.append(functions);
    });
}

$(document).ready(function() {
    loadContent()
        .done(function() {
            console.log("Done loading. Rendering now.");
            viewByWeek();
        });
});

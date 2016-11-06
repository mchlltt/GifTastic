$(document).ready(function() {

    // Variables
    // Initial buttons
    var topics = [
        'Ana',
        'Bastion',
        'DVa',
        'Genji',
        'Hanzo',
        'Junkrat',
        'Lucio',
        'McCree',
        'Mei',
        'Mercy',
        'Pharah',
        'Reaper',
        'Reinhardt',
        'Roadhog',
        'Soldier 76',
        'Sombra',
        'Symmetra',
        'Torbjorn',
        'Tracer',
        'Widowmaker',
        'Zarya',
        'Zenyatta'
    ];

    var baseQueryURL;
    var method = 'GET';


    // Button creation functions.
    var buttonFunctions = {
        // Variables
        buttonHolder: $('.button-holder'),
        // Methods
        listToButtons: function(list) {
            buttonFunctions.buttonHolder.empty();
            for (var i = 0; i < list.length; i++) {
                buttonFunctions.stringToButton(list[i]);
            }
        },
        stringToButton: function(str) {
            var button = $('<button>');
            var p = $('<p>');
            p.text(str);
            button.addClass('btn btn-info gif-button');
            button.attr('data-topic', str);
            button.append(p);
            buttonFunctions.buttonHolder.append(button);
        }
    };

    var gifFunctions = {
        createGIF: function(results) {
            for (var i = 0; i < results.length; i++) {
                var gifDiv = $('<div>');
                var p = $('<p>');
                p.text('Rating: ' + results[i].rating);
                p.addClass('text-center');
                var gifImage = $('<img>');
                gifImage.addClass('gif');
                gifImage.attr('data-state', 'still');
                gifImage.attr('data-still', results[i].images.fixed_height_still.url);
                gifImage.attr('data-active', results[i].images.fixed_height.url);
                gifImage.attr('src', results[i].images.fixed_height_still.url);
                gifDiv.addClass('gif-div');
                gifDiv.append(p);
                gifDiv.append(gifImage);
                $('.gif-holder').prepend(gifDiv);
            }
        }
    };


    // Immediately on page-load
    buttonFunctions.listToButtons(topics);

    // On-click events

    // Click submit button to add new topic.
    $('#submit-button').on('click', function() {
        // Get text of topicAddition input.
        var text = $('#topicAddition').val();
        // Add the text to the topics array.
        topics.push(text);
        // Create buttons over.
        buttonFunctions.listToButtons(topics);
        // Don't reload the page.
        return false;
    });

    // Click topic button to get GIFs.
    $(document).on('click', '.gif-button', function() {
        var topic = $(this).data('topic');
        $('.gif-holder').empty();
        var animal = $(this).data('topic');
        var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=dc6zaTOxFJmzC&limit=10";

        $.ajax({
                url: queryURL,
                method: 'GET'
            })
            .done(function(response) {
                var results = response.data;
                gifFunctions.createGIF(results);
            });
    });

    // Click GIF to toggle animation.
    $(document).on('click', '.gif', function() {
        var state = $(this).attr('data-state');
        if (state == 'still') {
            $(this).attr('src', $(this).data('active'));
            $(this).attr('data-state', 'active');
        } else {
            $(this).attr('src', $(this).data('still'));
            $(this).attr('data-state', 'still');
        }

    });
});

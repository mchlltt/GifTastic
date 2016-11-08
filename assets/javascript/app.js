$(document).ready(function() {

    // Initial set of topics
    var topics = [
        'Ana',
        'Bastion',
        'D.Va',
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
        'Soldier: 76',
        'Sombra',
        'Symmetra',
        'Torbjorn',
        'Tracer',
        'Widowmaker',
        'Winston',
        'Zarya',
        'Zenyatta'
    ];

    // Button creation functions.
    var buttonFunctions = {
        // Set the button-holder div to a property.
        buttonHolder: $('.button-holder'),

        // Takes an array of strings and creates a button for each item.
        listToButtons: function(list) {
            // Remove all the buttons first to avoid duplicates.
            buttonFunctions.buttonHolder.empty();
            // Then pass each item to stringToButton.
            list.map(buttonFunctions.stringToButton);
        },

        // Takes a single string and creates a button for it.
        stringToButton: function(str) {
            var button = $('<button>');
            var span = $('<span>');
            span.text(str);
            button.addClass('btn btn-info gif-button');
            button.attr('data-topic', str);
            button.append(span);
            buttonFunctions.buttonHolder.append(button);
        }
    };

    // Immediately on page-load, display the initial topic list.
    buttonFunctions.listToButtons(topics);

    // Click submit button to add new topic.
    $('#submit-button').on('click', function() {
        // Get text of topicAddition input.
        var text = $('#topicAddition').val().trim();
        // Clear any input.
        $('#topicAddition').val('');
        // If there was input and that input was not already in topics,
        if ((text !== '') && topics.indexOf(text) === -1) {
            // Add the text to the topics array.
            topics.push(text);
            // Create buttons over.
            buttonFunctions.listToButtons(topics);
        }
        // Don't reload the page.
        return false;
    });

    // Click topic button to make GIPHY API call.
    $(document).on('click', '.gif-button', function() {
        // Remove any GIFs currently on the page.
        $('.gif-holder').empty();
        // Get the topic data attribtue from the button clicked.
        var topic = $(this).data('topic').trim();
        // Strip non-alphanumeric characters and replace them with '+'
        var term = topic.replace(/[^A-Za-z0-9]/g, '+');
        // If it is one of the original search terms, add '+overwatch' to the end to get better results.
        if (topics.indexOf(topic) < 23) {
            term += '+overwatch';
        }

        // API call parameters 
        var method = 'GET';
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + term + "&api_key=dc6zaTOxFJmzC&limit=10";

        $.ajax({
            url: queryURL,
            method: 'GET'
        }).done(function(response) {
            // Assign the 'data' array from the response to a variable.
            var results = response.data;
            // Pass that variable to createGIF.
            createGIF(results,topic);
        });
    });

    // Create GIFs from API call results
    var createGIF = function(results, topic) {
        // For each GIF result,
        console.log(results);
        results.map(function(result) {
            // Create a div, an img, and a p tag.
            // Include identifying classes and centering helper classes.
            var gifDiv = $('<div class="gif-div">');
            var gifImage = $('<img class="gif center-block">');
            var p = $('<p class="text-center">');
            // Add image src, alternate src, and state attributes.
            gifImage.attr('src', result.images.fixed_height_still.url);
            gifImage.attr('alt', 'A GIF related to ' + topic);
            gifImage.attr('data-state', 'still');
            gifImage.attr('data-still', result.images.fixed_height_still.url);
            gifImage.attr('data-active', result.images.fixed_height.url);
            // Add rating text.
            p.text('Rating: ' + result.rating);
            // Add GIF and rating text to gifDiv
            gifDiv.append(p);
            gifDiv.prepend(gifImage);
            // Add gifDiv to the GIF holder.
            $('.gif-holder').prepend(gifDiv);
        });
    };


    // Click GIF to toggle animation.
    $(document).on('click', '.gif', function() {
        var state = $(this).attr('data-state');
        // If the GIF is currently still, animate it.
        if (state == 'still') {
            $(this).attr('src', $(this).data('active'));
            $(this).attr('data-state', 'active');
            // Otherwise, make it still.
        } else {
            $(this).attr('src', $(this).data('still'));
            $(this).attr('data-state', 'still');
        }

    });
});

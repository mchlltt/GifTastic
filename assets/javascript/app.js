$(document).ready(function() {

    // Initial set of topics
    var topics = ['Ana', 'Bastion', 'D.Va', 'Genji', 'Hanzo', 'Junkrat', 'Lucio', 'McCree', 'Mei', 'Mercy', 'Pharah', 'Reaper', 'Reinhardt', 'Roadhog', 'Soldier: 76', 'Sombra', 'Symmetra', 'Torbjorn', 'Tracer', 'Widowmaker', 'Winston', 'Zarya', 'Zenyatta'];

    // Button creation functions.
    var buttonFunctions = {
        // Set the button-holder div to a property because you will need it in both child functions.
        buttonHolder: $('.dynamic-button-holder'),

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

    // Begin API Calls

    // General API call parameters
    var queryMethod = 'GET';
    var baseURL = 'https://api.giphy.com/v1/gifs/';
    var APIKey = 'api_key=dc6zaTOxFJmzC';
    var limit = '&limit=10';
    // These always go together at the end of the query, so concatenate them into one variable.
    var APIKeyAndLimit = APIKey + limit;

    // Click topic button to make GIPHY API call about that topic.
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
        var queryURL = baseURL + 'search?q=' + term + '&' + APIKeyAndLimit;

        $.ajax({
            url: queryURL,
            method: queryMethod
        }).done(function(response) {
            // Assign the 'data' array from the response to a variable.
            var results = response.data;
            // Pass that variable to createGIF.
            createGIF(results, alt = 'A GIF related to ' + topic);
        });
    });

    // Click trending button to make GIPHY API call.
    $(document).on('click', '#trending-button', function() {
        // Remove any GIFs currently on the page.
        $('.gif-holder').empty();

        // API call parameters 
        var queryURL = baseURL + 'trending?' + APIKeyAndLimit;

        $.ajax({
            url: queryURL,
            method: queryMethod
        }).done(function(response) {
            // Assign the 'data' array from the response to a variable.
            var results = response.data;
            // Pass that variable to createGIF.
            createGIF(results, alt = 'A trending GIF');
        });
    });

    // Click random button to make Pokeapi then GIPHY API calls.
    $(document).on('click', '#random-button', function() {
        // Remove any GIFs currently on the page.
        $('.gif-holder').empty();
        // Then call Pokeapi function.
        pokeapiCall();
    });

    // This call is in a named function to simplify repeating in the case of no results.
    var pokeapiCall = function() {
        // Pokeapi call parameters
        // Select random Pokemon ID.
        var pokemonID = Math.ceil(Math.random() * 721);
        var queryURL = 'https://pokeapi.co/api/v2/pokemon/';

        // Make a Pokeapi API call for random Pokemon ID.
        $.ajax(url = queryURL + pokemonID + '/', method = queryMethod).done(function(response) {
            // Return Pokemon's name.
            var topic = response.species.name;
            // Add 'pokemon' to the search for better results
            var term = topic + '+pokemon';

            // GIPHY API call parameters 
            var queryURL = baseURL + 'search?q=' + term + '&' + APIKeyAndLimit;

            $.ajax({
                url: queryURL,
                method: queryMethod
            }).done(function(response) {
                // Assign the 'data' array from the response to a variable.
                var results = response.data;
                // If there was at least one result, proceed.
                if (results.length > 0) {
                    // Pass that variable to createGIF.
                    createGIF(results, alt = 'A GIF related to ' + term);
                // If not, pull a new Pokemon name.
                } else {
                    pokeapiCall();
                }
            });
        });
    };

    // End API Calls


    // Create GIFs from API call results
    var createGIF = function(results, alt) {
        // For each GIF result,
        results.map(function(result) {
            // Create a div, an img, and a p tag.
            // Include identifying classes and centering helper classes.
            var gifDiv = $('<div class="gif-div">');
            var gifImage = $('<img class="gif center-block">');
            var p = $('<p class="text-center">');
            // Add image src, alternate src, alt, and state attributes.
            gifImage.attr('src', result.images.fixed_height_still.url);
            gifImage.attr('alt', alt);
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

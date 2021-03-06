$(document).ready(function(){

    function loadData() {
        var w = $(document).width();
        var h = $(document).height();

        var $body = $('body');
        var $wikiElem = $('#wikipedia-links');
        var $nytHeaderElem = $('#nytimes-header');
        var $nytElem = $('#nytimes-articles');
        var $greeting = $('#greeting');

        // clear out old data before new request
        $wikiElem.text("");
        $nytElem.text("");

        var cityStr = $('#form-container :input#city').val();
        var streetStr = $('#form-container :input#street').val();
        var address = streetStr + ", " + cityStr;

        $greeting.text("So, you want to live at " + address + "?");

        // load streetview
        var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=' +
                                              w +
                                              'x' +
                                              h +
                                              '&location=' +
                                              address;
        // add the image to the body
        $body.append('<img class="bgimg" src="' + streetviewUrl + '">');
        console.log('body appended with img');

        //define the NYT address for accessing articlesearch
        var nytUrl = "https://api.dddnytimes.com/svc/search/v2/articlesearch.json?q=" + cityStr + "&sort=newest&api-key=XXXXXXXXXXXXXXXXXXXXXXXX";

        $.getJSON(nytUrl, function(data){
            console.log(data);
            $nytHeaderElem.text('NYTimes Artiles about ' + cityStr);
            var articles = data.response.docs;
            for(var i = 0; i < articles.length; i++){
              var article = articles[i];
              $nytElem.append(
                  '<li class="article">' +
                  '<a href="' + article.web_url + '">' + article.headline.main + '</a>' +
                  '<p>' + article.snippet + '</p>' +
                  '</li>');
            }
        }).error(function(e){
           $nytHeaderElem.text("NYTimes articles are not available. Please fix me.");
        });

        var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';

        var wikiRequestTimeout = setTimeout(function(){
          $wikiElem.text("failed to get wikipedia resources");
        }, 8000);

        $.ajax({
            url: wikiUrl,
            dataType: 'jsonp',
            jsonp: 'callback',
            done: function(response){ //this means upon the success of the request from wikipedia you now can assemble your output
              var articles = response[1];
              for(var i = 0; i<articles.length; i++){
                var articleStr = articles[i];
                var url = "http://en.wikipedia.org/wiki/" + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
              };
              clearTimeout(wikiRequestTimeout);
            }
        });

        return false;
    }

    $('.form-container').submit(loadData); //The page's input form.
    //When user submits their input, the loadData function runs on the data.
});



/*
http://maps.googleapis.com/maps/api/streetview?size=500x500&location=1600 pennsylvania avenue, washington dc
*/

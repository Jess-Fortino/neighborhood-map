
/*
Building a neighborhood data model by inquring Foursquare with initila value of zip code 98005
*/
var Venue = function(data){
    this.name = data.name;
    this.address = data.location.formattedAddress[0] + ' ' + data.location.formattedAddress[1] + ' ' + data.location.formattedAddress[2];
    this.category = data.categories[0].shortName;
    this.lat = data.location.lat;
    this.lng = data.location.lng;
};

var ViewModel = function() {

    var self = this;

    this.venuesList = ko.observableArray([]);
    this.mapLocation = ko.observable("60007");    // Initial value
    this.query = ko.observable(''); // Initial selection
    this.queryResults = ko.observableArray([]);

    ClearQueryBox = function(){
    // Clear the filter text box upon new location search
      self.query('');
    };


    updateList = function() {
        // Setting the query paramters to FourSquare to retrive the venues list
        ClearQueryBox();
        var foursquareClientID = 'KJXASR1JSSF2WM4CESIZ2IFICH2ELPXK1WXE1T4FBQ1A5H5X';
        var foursquareClientSecret = '0G1MUWJDN3P5GNYWLAVC12SNTBE1TZTPANYPHWMLMT3LRSB4';
        var foursquareSearchURI = 'https://api.foursquare.com/v2/venues/search';
        var forsquareSearchParms = {
            'client_id' : foursquareClientID,
            'client_secret' : foursquareClientSecret,
            'near' : self.mapLocation,
            'intent' : 'browse',
             // 'query': self.foodCategory,
            'categoryId': '4d4b7105d754a06374d81259', //looking for the Food Category
            'v' : '20170101'
        };
        $.ajax ({
            // Ajex call to get the JSON list of relevant venues
            type: "GET",
            url: foursquareSearchURI,
            dataType: 'json',
            async: true,
            data: forsquareSearchParms,
            success: function(data){
                //console.log(data);
                self.venuesList.removeAll();
                data.response.venues.forEach(function (venueItem){
                    self.venuesList.push(new Venue(venueItem));
                                });
                showListings(ko.toJS(self.venuesList));
                $('#myalert').hide();
              },
              error: function(e) {
                  $('#myalert').show();
              },
            });

        };

    searchResults = ko.computed(function () {
        if (this.query()) {
            var search = this.query().toLowerCase();
            this.queryResults = ko.utils.arrayFilter(this.venuesList(), function (venueItem) {
                return venueItem.name.toLowerCase().indexOf(search) >= 0;
            });
        } else {
            this.queryResults = self.venuesList();
        }
        // hide unhide the markers as the filter progress on screen.
        for (var i = 0; i < markers.length; i++) {
            if (this.queryResults.length <1) {
                markers[i].setVisible(false);
            } else {
                for (var j = 0; j < this.queryResults.length; j++) {
                    if (markers[i].title === this.queryResults[j].name) {
                        markers[i].setVisible(true);
                        break;
                    } else {
                        markers[i].setVisible(false);
                    }
                }
            }
        }
        return this.queryResults;
    }, this, {deferEvaluation: true});

    this.currentVenue = ko.observable( self.queryResults[0]);
    this.setVenue = function(clickedVenue) {
        // adding listener to each venue. upon click firing the associated map marker
        self.currentVenue(clickedVenue);
        populateInfoWindow(markers[self.venuesList.indexOf(clickedVenue)]);
    };

};


$(document).ready(function() {
    var geocoder;
    var map;
    var markerBounds = [];
    geocoder = new google.maps.Geocoder();
    
    function initialize() {
        var mapOptions = {
        center: new google.maps.LatLng(40.7441,-74.0324),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
        }; 
        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    }
    
    // when page is ready, initialize the map!
    google.maps.event.addDomListener(window, 'load', initialize);
    var length=parseInt($('#arrayLength').text());
    for(let i=0;i<10;i++){
        var locationId='#locationId'+i.toString();
        var address=$(locationId).text();
        var urlAddress=address.toString().split(' ').join('+');
        //console.log( address);
        var locationName='#locationName'+i.toString();
        let name=$(locationName).text();
        console.log(name);
        var formData={address,name};
        var urlAddress=address.toString().split(' ').join('+');
        let id=$('#id'+i.toString()).text();
        url="https://maps.googleapis.com/maps/api/geocode/json?address=" + urlAddress + "&key=" + "AIzaSyAwQhgCXQI5ELmiH6wu-O-MqQN26CQToco",
        $.ajax({ 
            type:'POST', 
            url:url,
            data: formData,
            success: function(response) {
                var marker = new google.maps.Marker({
                    map: map,
                    position: response.results[0].geometry.location });
                    var infowindow = new google.maps.InfoWindow();
                    infowindow.setContent(name);
                    google.maps.event.addListener(marker, 'click', function() {
                        // infowindow.open(map, marker);
                        $(location).attr('href', 'http://localhost:3000/restaurants/'+id);
                    });            
                },
            dataType: 'json', 
            encode : true
            }).done(function(data) {console.log(data);}); 
        }
});


window.onload = init;

function init() {
    const mapElement = document.getElementById('map')

    // Basemaps
    const Esri_NatGeoWorldMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy;  National Geographic, Esri',
        maxZoom: 20
    });
    const Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri; Source: Esri'
    });

    // Map element
    const map = L.map(mapElement, {
        center:[39.7,7],
        zoom:5,
        layers: [Esri_WorldStreetMap]
    })

    // Layers
    const baseMaps = {

        "Streets": Esri_WorldStreetMap,
        "National Geo": Esri_NatGeoWorldMap,

    };


    function stylePoints(feature){
        if (feature.properties.Result == 'Roman victory'){
            return {
                radius:7, 
                color:'darkred',
                weight:2,
                fillColor:'darkred',
                fillOpacity:0.5
            }
        } else {
            return {
                radius:7, 
                color:'blue',
                weight:2,
                fillColor:'blue',
                fillOpacity:0.5
            }
        }
        
    }
    
    function stylePolys(feature){
        if (feature.properties.Territory == 'Rome'){
            return {
                radius:7, 
                color:'darkred',
                weight:2,
                fillColor:'darkred',
                fillOpacity:0
            }
        } else {
            return {
                radius:7, 
                color:'blue',
                weight:2,
                fillColor:'blue',
                fillOpacity:0
            }
        }
        
    }
    const hoverStyle = {
        radius:7, 
        color:'yellow',
        weight:2,
        fillColor:'yellow',
        fillOpacity:0.5
    }
    // Funciton to add geojson to map
    function addGeoJSONData(data){
        let geoJasonLayer = L.geoJSON(data,{
            pointToLayer: function(feature, latlng){
                return L.circleMarker(latlng,stylePoints(feature))
            },
            style: function(feature){
                if(feature.geometry.type == 'MultiPolygon'){
                    return stylePolys(feature)
            }},
            onEachFeature: function(feature, layer){
                if(feature.geometry.type == 'Point'){
                    layer.bindPopup('<b>'+feature.properties.Title+'</b>'+ '<br>'+'Roman Strength: '+feature.properties.Roman_Strength.toLocaleString()+ '<br>'+'Carthaginian Strength: '+feature.properties.Carthaginian_Strength.toLocaleString()+ '<br>'+'Date: '+feature.properties.Date+ '<br>'+'<b>Result: '+feature.properties.Result+'</b>');
                    layer.on('mouseover',function(e){
                        layer.setStyle(hoverStyle)  

                    });
                    layer.on('mouseout',function(e){
                        layer.setStyle(stylePoints(feature))
                    })
                    
                }
            }
        })
        geoJasonLayer.addTo(map)

    }

    function fetchData(url){
        fetch(url,{
            method:'GET',
            mode: 'same-origin'
        })
        .then(function(response){
            if (response.status == 200) {
                return response.json(response)
            } else {
                throw new Error('Could not locate data')
            }      
        }).then(function(geojson){
            addGeoJSONData(geojson)
        }).catch (function(error){
            console.log(error)
        })
    }

    const territoriesLayer = fetchData('./data/territories.json')

    const battlesLayer = fetchData('./data/battles.json')
    
    const overlayLayers ={}
    
    var layerControl = L.control.layers(baseMaps, overlayLayers,{
        collapsed:false,
    }).addTo(map);


    const legend = L.control.Legend({
        position: "bottomleft",
        collapsed: false,
        symbolWidth: 20,
        opacity: 1,
        column: 2,
        legends: [{
            label: "Rome (ca. 218 BC)",
            type: "polygon",
            sides: 4,
            color: "darkred",
            weight: 1
        },{
            label: "Roman Victory",
            type: "circle",
            radius: 6,
            color: "darkred",
            fillColor: "darkred",
            fillOpacity: 0.5,
            weight: 2,
        },
        {
            label: "Carthage (ca. 218 BC)",
            type: "polygon",
            sides: 4,
            color: "blue",
            weight: 1
        },{
            label: "Carthage Victory",
            type: "circle",
            radius: 6,
            color: "blue",
            fillColor: "blue",
            fillOpacity: 0.5,
            weight: 2,
        }
    ]
    })
    .addTo(map);


    // map.on('click', function(e){
    //     var coord = e.latlng;
    //     console.log(coord.lat, coord.lng);
    // });


   

}

# Kepler.gl-Offline (🚧 WIP)

Kepler.gl-Offline is a curation of different modules to enable **Free**, **Offline** and **Self-Hosted** mapping and geospatial-visualisation. Useful for when you have no internet access and are unable to use cloud providers like ArcGis, Esri, Mapbox, Google, Bing etc.
 
 Some Objectives/ Constraints for this project:
 - Completely free
 - **Windows** only - avoid booting or vming into another os
 - Avoid using docker
 - End result should be completely air gapped from internet (middle steps can utilise an internet PC)
 - Try to use as much public domain data as possible (avoid icky licensing situations)
 - Able to visualize geographic data generated from programs like Excel, Python and MATLAB

 Get the installation instructions [HERE](#installation).

# Table of contents
- [Kepler.gl-Offline (🚧 WIP)](#keplergl-offline--wip)
- [Table of contents](#table-of-contents)
- [Installation](#installation)
    - [Steps to install from scratch](#steps-to-install-from-scratch)
- [Components](#components)
  - [Overview](#overview)
  - [Data Sources](#data-sources)
  - [Premade Tile Sources](#premade-tile-sources)
  - [Tile Generation](#tile-generation)
  - [Styling](#styling)
  - [Tile server/ hosting](#tile-server-hosting)
  - [Displaying the map](#displaying-the-map)
  - [Data visualisation](#data-visualisation)
- [To be explored](#to-be-explored)
- [License](#license)
# Installation
### Steps to install from scratch
On an online computer:
- Download any required osm data and tile sources
- Download a node.js offline installer from [here](https://nodejs.org/en/download/)
- Download tilemaker-windows.zip from [here](https://github.com/systemed/tilemaker/releases/)
- run `npm install mbtiles-server` and copy the node-modules folder to an offline computer
- Download `kepler.gl-offline` and cd into `kepler.gl-offline/kepler.gl-demo-app` 
- run `npm install` and copy the node-modules folder to an offline computer
- Cd into static_server and run `npm install` and copy the node-modules folder to an offline computer

On the offline computer:
- Copy over the downloaded osm data and tile sources
- Install node.js using the installer
- Copy the mbtiles-server node-modules
- Copy the kepler.gl-offline node-modules
- Run tilemaker to generate the tiles (See [Tile Generation](#tile-generation))
- Run a static node server serving styles,fonts and sprites (`cd static_server` and run `node index.js`)
- Run mbtiles-server serving natural-earth raster tiles and osm vector tiles (`mbtiles-server --cache /folder/containing/mbtiles --verbose --port 3000`)
- cd into `kepler.gl-offline/kepler.gl-demo-app` and run `npm start`
- If all is good, kepler.gl should run. If not, try running Chrome or MS Edge in Windows 8 compatibility mode and opening `kepler.gl-demo-app/index.html` again.

# Components
## Overview
To have a working end-to-end solution, we need a data source for tiles, a way to generate tiles, a tile server and a client rendering library.

|Description|Name|
---|---
Data Sources| OSM [data extracts](http://download.geofabrik.de/) (.pbf)<br> Simonepri's [coastline](https://github.com/simonepri/geo-maps/blob/master/info/countries-coastline.md) (.geojson) 
Premade Tile Sources| [Natural Earth](https://github.com/lukasmartinelli/naturalearthtiles) (Vector and raster tiles) <br> 
Tile Generation| [Tilemaker](https://github.com/systemed/tilemaker)
Styles| [Maputnik](https://maputnik.github.io/editor) <br> [osm-liberty](https://github.com/maputnik/osm-liberty)
Tile server/ Hosting| [mbtiles-server](https://github.com/DenisCarriere/mbtiles-server) <br> [tileserver-gl-light](https://github.com/maptiler/tileserver-gl)
Displaying the map| [Leaflet](https://leafletjs.com/) <br> [Openlayers](https://openlayers.org/) <br> [Maplibre-gl](https://github.com/maplibre/maplibre-gl-js)
Data Visualization| [Kepler.gl](https://github.com/keplergl/kepler.gl)

## Data Sources
TODO
## Premade Tile Sources
TODO
## Tile Generation
TODO
## Styling
We can use [maputnik](https://maputnik.github.io/editor/) to preview the following free styles:
- [Maptiler Basic](https://github.com/openmaptiles/maptiler-basic-gl-style)
- [Osm-liberty](https://github.com/maputnik/osm-liberty) (also includes sprites)
- [OSM Bright](https://github.com/openmaptiles/osm-bright-gl-style)
- [Dark matter](https://github.com/openmaptiles/dark-matter-gl-style)
- [Toner](https://github.com/openmaptiles/maptiler-toner-gl-style)
- [Positron](https://github.com/openmaptiles/positron-gl-style)
  
To make the styles work with our mbstiles-server, we need to edit the layer source url to point to our self-hosted server. My static server is at `localhost:4000` and mbstiles-server is at `localhost:3000` so these are the two endpoints used in the style files.

The format that mapboxgl (which is what kepler.gl uses) expects is a TileJSON schema[[1](https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/),[2](https://github.com/mapbox/tilejson-spec/tree/master/2.0.0)] in the source of our style.json. This TileJSON format is also what tileserver-gl serves at its default `http://localhost:8080/data/v3.json` endpoint.

Fonts can be found at the releases page of [openmaptiles/fonts](https://github.com/openmaptiles/fonts). These can then be hosted using a static server.

## Tile server/ hosting
Both mbtiles-server and tileserver-gl-light works fine. Another static server can be used to host styles.json and sprites.

Tileserver-gl (which supports server-side rasterization) cannot be installed on Windows since it depends on `mapbox-gl-native` and installing `mapbox-gl-native` requires a closed source binary blob which [mapbox has since stopped releasing](https://github.com/maptiler/tileserver-gl/issues/523). It does work on linux if you mess with the node version to find a s3 bucket endpoint that is still live.

## Displaying the map
TODO
## Data visualisation
TODO
Integration with traditional data processing workflows (Excel, Python, MATLAB)

# To be explored
- Using Digital elevation maps to make topo contour maps [[1](http://viewfinderpanoramas.org/) [2](https://github.com/e-n-f/srtm-gridded-vector) [3](https://github.com/der-stefan/OpenTopoMap)]
- Reducing Vector tile size by removing redundant information during generation with tilemaker

# License
[© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

TODO Attributions


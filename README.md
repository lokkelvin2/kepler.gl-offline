# Kepler.gl-Offline (🚧 WIP)
Kepler.gl-Offline is a curation of different modules to enable **Free**, **Offline** and **Self-Hosted** mapping and geospatial-visualisation. Useful for when you have no internet access and are unable to use cloud providers like ArcGis, Esri, Mapbox, Google, Bing etc. 
 
 Some Objectives/ Constraints for this project:
 - Completely free
 - **Windows** only - avoid booting or vming into another os
 - Avoid using docker
 - End result should be completely air gapped from internet (middle steps can utilise an internet PC)
 - Try to use as much public domain data as possible (avoid icky licensing situations)
 - Able to visualize geographic data generated from programs like Excel, Python and MATLAB

  

## Table of contents
- [Kepler.gl-Offline (🚧 WIP)](#keplergl-offline--wip)
  - [Table of contents](#table-of-contents)
- [Installation](#installation)
    - [Steps to install from scratch](#steps-to-install-from-scratch)
- [Components](#components)
  - [Overview](#overview)
  - [Data Sources](#data-sources)
  - [Premade Tile Sources](#premade-tile-sources)
  - [Tile Generation](#tile-generation)
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

On the offline computer:
- Copy overthe downloaded osm data and tile sources
- Install node.js using the installer
- Copy the mbtiles-server node-modules
- Copy the kepler.gl-offline node-modules
- Run tilemaker to generate the tiles (See [Tile Generation](#tile-generation))
- Run a static node server serving styles.json and sprites
- Run mbtiles-server serving natural-earth raster tiles and osm vector tiles
- cd into `kepler.gl-offline/kepler.gl-demo-app` and run `npm start`

# Components
## Overview
To have a working end-to-end solution, we need a data source for tiles, a tile server and a client rendering library.

|Description|Name|
---|---
Data Sources| OSM [data extracts](http://download.geofabrik.de/) (.pbf)<br> Simonepri's [coastline](https://github.com/simonepri/geo-maps/blob/master/info/countries-coastline.md) (.geojson) 
Premade Tile Sources| [Natural Earth](https://github.com/lukasmartinelli/naturalearthtiles) (Vector and raster tiles) <br> 
Tile Generation| [Tilemaker](https://github.com/systemed/tilemaker)
Tile server/ Hosting| [mbtiles-server](https://github.com/DenisCarriere/mbtiles-server) <br> [tileserver-gl-light](https://github.com/maptiler/tileserver-gl)
Displaying the map| Leaflet <br> Openlayers <br> Maplibre-gl
Data Visualization| Kepler.gl

## Data Sources
TODO
## Premade Tile Sources
## Tile Generation

## Tile server/ hosting
Both mbtiles-server and tileserver-gl-light works fine. Another static server can be used to host styles.json and sprites.

Tileserver-gl (which supports server-side rasterization) cannot be installed on Windows since it depends on `mapbox-gl-native` and installing `mapbox-gl-native` requires a closed source binary blob which [mapbox has since stopped releasing](https://github.com/maptiler/tileserver-gl/issues/523). It does work on linux if you mess with the node version to find a s3 bucket endpoint that is still live.

## Displaying the map
## Data visualisation
Integration with traditional data processing workflows (Excel, Python, MATLAB)

# To be explored
- Using Digital elevation maps to make topo contour maps [[1](http://viewfinderpanoramas.org/) [2](https://github.com/e-n-f/srtm-gridded-vector) [3](https://github.com/der-stefan/OpenTopoMap)]
- Reducing Vector tile size by removing redundant information during generation with tilemaker

# License
[© OpenStreetMap contributors](https://www.openstreetmap.org/copyright)


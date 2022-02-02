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
    - [Contour line generation](#contour-line-generation)
  - [Styling](#styling)
    - [Side note on fonts/labels and Tilemaker](#side-note-on-fontslabels-and-tilemaker)
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
- Edit `\kepler.gl-offline\static_server\public\TileJson2.json` to point to your mbtiles url
- Run a static node server serving styles,fonts and sprites (`cd static_server` and run `node index.js`)
- Run mbtiles-server serving natural-earth raster tiles and osm vector tiles (`mbtiles-server --cache /folder/containing/mbtiles --verbose --port 3000`)
- cd into `kepler.gl-offline/kepler.gl-demo-app` and run `npm start`
- If all is good, kepler.gl should run. If not, try running Chrome or MS Edge in Windows 8 compatibility mode and opening `kepler.gl-demo-app/index.html` again.

# Components
## Overview
To have a working end-to-end solution, we need a data source for tiles, a way to generate tiles, a tile server and a client rendering library.

|Description|Name|
---|---
Data Sources| OSM [data extracts](http://download.geofabrik.de/) (.pbf)<br> Simonepri's [coastline](https://github.com/simonepri/geo-maps/blob/master/info/countries-coastline.md) (.geojson) <br> OpenDEM [SRTM based Contour Lines](https://www.opendem.info/download_contours.html) (.shp)
Premade Tile Sources| [Natural Earth](https://github.com/lukasmartinelli/naturalearthtiles) (Vector and raster tiles) <br> 
Tile Generation| [Tilemaker](https://github.com/systemed/tilemaker) (pbf to mbtiles) <br> [Tippecanoe](https://github.com/mapbox/tippecanoe) (geojson to mbtiles)
Styles| [Maputnik](https://maputnik.github.io/editor) <br> [osm-liberty](https://github.com/maputnik/osm-liberty) <br> [Qwant style](https://github.com/Qwant/qwant-basic-gl-style)
Tile server/ Hosting| [mbtiles-server](https://github.com/DenisCarriere/mbtiles-server) <br> [tileserver-gl-light](https://github.com/maptiler/tileserver-gl)
Displaying the map| [Leaflet](https://leafletjs.com/) <br> [Openlayers](https://openlayers.org/) <br> [Maplibre-gl](https://github.com/maplibre/maplibre-gl-js)
Data Visualization| [Kepler.gl](https://github.com/keplergl/kepler.gl)

## Data Sources
TODO
## Premade Tile Sources
TODO
## Tile Generation
TODO
### Contour line generation
- Download [SRTM shapefiles from OpenDEM](https://www.opendem.info/download_contours.html). These are shape files generated from .hgt SRTM data with 3-arc-seconds (90m) global resolution. An alternative data source is [MERIT DEM](http://hydro.iis.u-tokyo.ac.jp/~yamadai/MERIT_DEM/)
- Convert .shp files to geojson using [ogr2ogr in gdal](https://gis.stackexchange.com/a/280653) or [QGIS](https://gist.github.com/YKCzoli/b7f5ff0e0f641faba0f47fa5d16c4d8d) or [any one of these github repos](https://github.com/search?q=convert+shp+to+geojson)
- Convert geojson to mbtiles using tippecanoe. Using docker desktop:
  ```bash
  docker pull osgeo/gdal:ubuntu-small-latest
  docker run -it --rm -v D:/data:/data tippecanoe:latest tippecanoe /data/N01E01.geojson  --output=/data/contours.mbtiles
  ````
  where `N01E01.geojson` is saved in D:/data.
- Create a TileJson that points to the contours.mbtiles endpoint
```json
{
	"attribution": "OpenDEM, SRTM by USGS",
	"description": "SRTM based Contour Lines",
	"format": "pbf",
	"maxzoom": 14,
	"minzoom": 0,
	"name": "contours",
	"scheme": "xyz",
	"tiles": ["http://localhost:3000/contours/{z}/{x}/{y}.pbf"],
	"version": "2.0.0"
}
```
- Edit styles to include the new source layer
```json
  "sources": {
    "openmaptiles": {
      "type": "vector",
      "url": "http://localhost:4000/TileJson2.json"
    },
    "natural_earth_shaded_relief": {
      "maxzoom": 6,
      "tileSize": 256,
      "tiles": [
        "http://localhost:3000/natural_earth_2_shaded_relief_raster/{z}/{x}/{y}.png"
      ],
      "type": "raster"
    },
    "contours": {
      "type": "vector",
      "url": "http://localhost:4000/TileContour.json"
    }
  },
```
- Next, style the new contour layer, taking note that `"source-layer"` should be the `"id"` String value in the contours.mbtiles metatable. We can use a SQLite DB browser to query this value.
```json
{
  "id": "contours_index",
  "type": "line",
  "source": "contours",
  "source-layer": "N01E01",
  "filter": ["all"],
  .
  .
  .
}
```

## Styling
We can use [maputnik](https://maputnik.github.io/editor/) to preview the following free styles:
- [Maptiler Basic](https://github.com/openmaptiles/maptiler-basic-gl-style)
- [Osm-liberty](https://github.com/maputnik/osm-liberty) (also includes sprites)
- [OSM Bright](https://github.com/openmaptiles/osm-bright-gl-style)
- [Dark matter](https://github.com/openmaptiles/dark-matter-gl-style)
- [Toner](https://github.com/openmaptiles/maptiler-toner-gl-style)
- [Positron](https://github.com/openmaptiles/positron-gl-style)
- [Qwant basic style](https://github.com/Qwant/qwant-basic-gl-style)

To make the styles work with our mbstiles-server, we need to edit the layer source url to point to our self-hosted server. My static server is at `localhost:4000` and mbstiles-server is at `localhost:3000` so these are the two endpoints used in the style files.

The format that mapboxgl (which is what kepler.gl uses) expects is a TileJSON schema[[1](https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/),[2](https://github.com/mapbox/tilejson-spec/tree/master/2.0.0)] in the source of our style.json. This TileJSON format is also what tileserver-gl serves at its default `http://localhost:8080/data/v3.json` endpoint.

Fonts can be found at the releases page of [openmaptiles/fonts](https://github.com/openmaptiles/fonts). These can then be hosted using a static server.

### Side note on fonts/labels and Tilemaker
There is a known [incompatibility](https://github.com/systemed/tilemaker/issues/285#issuecomment-902149324) with the name tags from tilemaker and OpenMapTiles schema styles. Easiest fix is to replace all occurance of `"text-field:{key}"` in your style.json to `"text-filed:{name:latin}"`.

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


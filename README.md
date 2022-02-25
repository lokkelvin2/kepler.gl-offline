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
    - [Hillshade generation](#hillshade-generation)
    - [Raster DEM generation](#raster-dem-generation)
      - [Installing GDAL](#installing-gdal)
      - [Optional](#optional)
    - [Bathymetry vector tile generation (Mapbox's guide).](#bathymetry-vector-tile-generation-mapboxs-guide)
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
Data Sources| OSM [data extracts](http://download.geofabrik.de/) (.pbf)<br> Simonepri's [coastline](https://github.com/simonepri/geo-maps/blob/master/info/countries-coastline.md) (.geojson) <br> OpenDEM [SRTM based Contour Lines](https://www.opendem.info/download_contours.html) (.shp) <br> Viewfinder Panorama's [SRTM/Hybrid DEM](http://viewfinderpanoramas.org/) (.hgt) <br> Natural Earth [shapefiles](https://github.com/nvkelso/natural-earth-vector) (.shp)
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

### Hillshade generation
- Download .hgt SRTM DEM from [Viewfinder Panoramas](http://viewfinderpanoramas.org/dem3.html).
- Import all .hgt into QGIS and [generate a virtual raster](https://gis.stackexchange.com/questions/296155/setting-the-same-min-max-for-multiple-raster-layers-qgis) through `Raster - Miscellaneous - Build Virtual Raster`.
- Follow this [guide](https://ieqgis.com/2015/04/04/create-great-looking-topographic-maps-in-qgis-2/) to generate Hillshade with a colormap
  - Note: Under `Raster - Analysis - Hillshade`, use 61120 instead of 111120 for `Scale ratio vertical units to horizontal` to produce finer details.
  - Create another layer using the same virtual raster and set the blending mode of Singleband pseudocolor to `Multiply`
- Export the hillshade by going to `Processing toolbox - Raster Tools - Generate XYZ tiles (MBTiles)`.
- Set the extent based on the hill shade (take note of this extent as we will need it later)
- Max zoom of 12 is sufficient for the precision of this DEM dataset
- Follow [above](#contour-line-generation) for instructions on creating a Tilejson for our new raster layer
  - Following [TileJSON 2.0.0 spec](https://github.com/mapbox/tilejson-spec/tree/master/2.0.0), we include the `'bounds'` parameter based on the extent from QGIS
  - QGIS displays the extent in [Left, Right, Bottom, Top] but TileJSON 2.0.0 takes in [Left, Bottom, Right, Top]. Be sure to change the order accordingly.
- The raster tile source should look like this: 

```json
"sources": {
    "Hillshade": {
      "maxzoom": 12,
      "minzoom": 6,
      "tileSize": 256,
      "tiles": [
        "http://localhost:3000/HillshadeMBTileFromQGIS/{z}/{x}/{y}.png"
      ],
      "type": "raster",
      "bounds": [0,0,2,2], 
      "attribution": "Viewfinder Panoramas, VFP-DEM"
    },
    .
    .
    .
}
```
- and the style will be:
```json
    {
      "id": "Hillshadestyle",
      "type": "raster",
      "source": "Hillshade",
      "maxzoom": 16,
      "minzoom": 0,
      "paint": {"raster-opacity": {"base": 1.5, "stops": [[0, 1],[6, 1], [12, 0.1]]}}
    },
```

### Raster DEM generation
For raster-dem mbtile generation, we follow this [guide by Makina Maps](https://makina-corpus.com/sig-webmapping/representation-des-modeles-numeriques-de-terrain-sur-le-web-ombrage-et-3d) (google translate it). Again, we use 90m interval SRTM DEM from [Viewfinder Panoramas](http://viewfinderpanoramas.org/dem3.html).

First, we will need to install GDAL and the python bindings for GDAL.
#### Installing GDAL
- Download the prebuilt GDAL [binaries for windows](https://www.gisinternals.com/query.html?content=filelist&file=release-1928-x64-gdal-3-4-1-mapserver-7-6-4.zip)
- Create a python venv and pip install `gdal`
- git clone https://github.com/makina-maps/rio-rgbify.git. `cd rio-rgbify` and run `pip install .`

The full build commands are as follows:
```bash
gdalbuildvrt -a_srs EPSG:4326 -hidenodata "output.virt" "srtm\*.hgt"
gdal_translate -co compress=lzw -of GTiff "output.virt" "output.tiff"
python gdal_calc.py --co="COMPRESS=LZW" --type=Float32 -A "output.tiff" --outfile="output_.tiff" --calc="A*(A>0)" --NoDataValue=0
rio rgbify -b -10000 -i 0.1 -j 8 --format webp --max-z 11 --min-z 5 "output_.tiff" "rasterdem_.mbtiles"
```
#### Optional
Use DB Browser for SQLite to populate the metadata table of the rasterdem mbtile according to the [official specs](https://github.com/mapbox/mbtiles-spec/blob/master/1.3/spec.md).
Things to include are
- center
- bounds
- minzoom
- maxzoom
- attribution (optional)

### Bathymetry vector tile generation ([Mapbox's guide](https://www.mapbox.com/blog/custom-bathymetry-tilesets-with-mts)). 
For bathymetry, we use ESRI Shapefiles from Natural Earth. This data comes from [SRTM30_PLUS](https://topex.ucsd.edu/WWW_html/srtm30_plus.html) which is a processed bathymetry dataset with 30-arc second resolution.
- Download natural earth data from its github release page [here](https://github.com/nvkelso/natural-earth-vector/archive/refs/tags/v5.0.0.zip)
- Using GDAL, we combine the shapefiles and convert the merged file into a GeoJSON
```bash
set PROJ_LIB=C:\Program Files\GDAL\projlib
ogr2ogr merge.shp ne_10m_bathymetry_L_0.shp
ogr2ogr -update -append -nln merge merge.shp ne_10m_bathymetry_K_200.shp
ogr2ogr -update -append -nln merge merge.shp ne_10m_bathymetry_J_1000.shp
ogr2ogr -update -append -nln merge merge.shp ne_10m_bathymetry_I_2000.shp
ogr2ogr -update -append -nln merge merge.shp ne_10m_bathymetry_H_3000.shp
ogr2ogr -update -append -nln merge merge.shp ne_10m_bathymetry_G_4000.shp
ogr2ogr -update -append -nln merge merge.shp ne_10m_bathymetry_F_5000.shp
ogr2ogr -update -append -nln merge merge.shp ne_10m_bathymetry_E_6000.shp
ogr2ogr -update -append -nln merge merge.shp ne_10m_bathymetry_D_7000.shp
ogr2ogr -update -append -nln merge merge.shp ne_10m_bathymetry_C_8000.shp
ogr2ogr -update -append -nln merge merge.shp ne_10m_bathymetry_B_9000.shp
ogr2ogr -update -append -nln merge merge.shp ne_10m_bathymetry_A_10000.shp
ogr2ogr -f GeoJSON merge.geojson merge.shp
```
- Convert the GeoJSON into mbtiles using Tippecanoe ([through cygwin](https://github.com/GISupportICRC/ArcGIS2Mapbox#installing-tippecanoe-on-windows)) or any online tool

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
There is a known [incompatibility](https://github.com/systemed/tilemaker/issues/285#issuecomment-902149324) with the name tags from tilemaker and OpenMapTiles schema styles. Easiest fix is to replace all occurance of `"text-field:{key}"` in your style.json to `"text-field:{name:latin}"`.

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


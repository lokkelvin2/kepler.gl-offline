# Static server
Currently used to host the following:
1) Mapbox style document (style.json)
2) TileJSON file which points to the mbtiles-server
3) Fonts
4) Sprites

## To install
```sh
npm install
```
## To Run
```sh
node index.js
```
Add files to be hosted inside the public folder.
Files will be available at `localhost:4000/<path>/<tofile>`.
Port can be changed by editing index.js.


Code is based off stackoverflow [[1](https://stackoverflow.com./a/40899767)]. 

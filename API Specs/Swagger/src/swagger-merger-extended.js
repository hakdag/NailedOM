// npm install yamljs
// npm install fmtconv
// node swagger-merger-extended.js
const fs = require('fs');
const YAML = require('yamljs');
const fmtconv = require('fmtconv')
var spec = YAML.load('swagger.yaml');
var new_paths = [];
add_new_paths(spec.paths, new_paths);
spec.paths = {};
new_paths.forEach(function(new_path) {
    for (var new_path_key in new_path) {
        spec.paths[new_path_key] = new_path[new_path_key];
    }
});
let dump = fmtconv.stringJSON2YAML(spec)
var file = fs.openSync('swagger.yaml', 'w+');
fs.writeSync(file, dump);
fs.closeSync(file);
function add_new_paths (spec_paths, new_paths) {
    for (var path in spec_paths) {
        var inner_paths = spec_paths[path];
        for (var inner_path in inner_paths) {
            var inner_object = {};
            inner_object[inner_path] = inner_paths[inner_path];
            if (inner_path.indexOf('/') === -1) {
                add_new_paths(inner_object, new_paths);
            } else {
                new_paths.push(inner_object);
            }            
        }
    }
}
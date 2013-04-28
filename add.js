#!/usr/bin/env node
var fs = require('fs');
var npm = require('npm');
var util = require('util');

var help = '\nnpm-add is a tool for adding dependencies to your package.json file. \
\n\nUsage: \n\tnpm-add <packages> [options]\nOptions:\n\t-h, --help\tHelp screen\n\t-v, --version\tCurrent version\n\t-i, --install\tinstall packages after adding them';
var version = 'v0.0.1';

function inArray(value,array) {
  var count=array.length;
  for(var i=0;i<count;i++) {
    if(array[i]===value) {
      return true;
    }
  }
  return false;
}

function exit(message, error){
	util.puts(message);
	err = error || null;
	process.exit(err);
}

if (process.argv[0] == 'node') {
  argv = process.argv.slice(2);
} else {
  argv = process.argv;
}
function recursiveGetProperty(obj, lookup, callback) {
    for (property in obj) {
        if (property == lookup) {
            callback(obj[property]);
        } else if (obj[property] instanceof Object) {
            recursiveGetProperty(obj[property], lookup, callback);
        }
    }
}  

function _install(){
	npm.load({}, function(err){
		npm.commands.install([], function(er, rd){})
	})
}


//add version and help outputs

main = function(dependencies, install){
  
  npm.load({}, function(err){
	for (i=0;i<dependencies.length;i+=1) {
	  package = dependencies[i][0];
	  this.version1 = dependencies[i][1];
	  (function(version1, package){
		  npm.commands.show([package, 'name'], function(er, rawData){
		  	if (er) console.log(er);
		  	if(rawData){
		  		data = JSON.parse(JSON.stringify(rawData));
		  		if (typeof version1 == 'undefined') {
		  			version1 = Object.keys(data)[0];
		  		}
		  		recursiveGetProperty(data, 'name', function(obj){
		  		    data = fs.readFileSync('package.json', 'utf8');
					pkginfo = JSON.parse(data);
					pkginfo.dependencies[obj] = version1;
					fs.writeFileSync('package.json', JSON.stringify(pkginfo, null, 2));
		  		});

		  	}
		  });
	  })(this.version1, package)	
	}
  });
  if (install == true) _install()

}

var newArgv = [];
for (i = argv.length - 1; i>=0; i-=1) {
  newArgv.push(argv[i].split(' '));
}
if (require.main === module) {
  var install;
  for (i = newArgv.length -1 ; i>=0; i-=1) {
	  if (inArray('-h', newArgv[i]) || inArray('--help', newArgv[i])) {
	  	exit(help)
	  }
	  else if (inArray('-v', newArgv[i]) || inArray ('--version', newArgv[i])) {
	  	exit(version)
	  }
	  else if (inArray('-i', newArgv[i]) || inArray ('--install', newArgv[i])) {
	  	newArgv.splice(newArgv.indexOf(newArgv[i]))
	  	console.log(newArgv)
	  	install = true
	  }
  }
  main(newArgv, install);    
}
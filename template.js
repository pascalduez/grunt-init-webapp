
"use strict";

// Nodejs libs.
var path = require("path");

// Basic template description.
exports.description = "Scaffold a basic WebApp.";

// Template-specific notes to be displayed before question prompts.
exports.notes = "";

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = "*";

// The actual init template.
exports.template = function(grunt, init, done) {

  grunt.util._.extend( init.prompts, {
    // @TODO: Why not using prompts.name exactly ?
    "app_root": {
      message: "WebApp package and root directory.",
      default: function(value, data, done) {
        var name = path.basename(process.cwd());
        name = name.replace(/[^\w\-\.]/g, "");
        done(null, name);
      },
      validator: /^[\w\-\.]+$/,
      warning: "Must be only letters, numbers, dashes, dots or underscores."
    },
    "app_name": {
      message: "WebApp name.",
      default: function(value, data, done) {
        var title = data.app_root || "";
        title = title.replace(/[\W_]+/g, " ");
        title = title.replace(/\w+/g, function(word) {
          return word[0].toUpperCase() + word.slice(1).toLowerCase();
        });
        data.title = title;
        data.title_default = "A human-readable name for the app: " + title;
        done(null, data.title_default);
      },
      validator: /^.{1,128}$/,
      warning: "Maximum length is 128 characters.",
      sanitize: function(value, data, done) {
        done( value === data.title_default ? data.title : value );
      }
    },
    "description": {
      message: "WebApp description.",
      default: "A human-readable description of the app.",
      validator: /^.{1,1024}$/,
      warning: "Maximum length is 1024 characters."
    }
  });

  init.process({}, [
    // Prompt for these values.
    init.prompt("app_root"),
    init.prompt("app_name"),
    init.prompt("description"),
    init.prompt("version", "0.1.0"),
    init.prompt("repository"),
    init.prompt("homepage"),
    init.prompt("author_name"),
    init.prompt("author_url"),
    init.prompt("licenses", "MIT")
  ],
  function(err, props) {

    // Just some semantics.
    props.short_name = props.app_root;

    props.app_root = "/" + props.app_root;

    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Add properly-named license files.
    init.addLicenseFiles(files, props.licenses);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props, {noProcess: "img/*"});

    // Generate package.json file, used by npm and grunt.
    init.writePackageJSON("package.json", {
      name: props.short_name,
      version: props.version,
      node_version: '>= 0.8.0',
      devDependencies: {
        "grunt": "~0.4.1",
        "grunt-open": "~0.2.0",
        "grunt-regarde": "~0.1.1",
        "grunt-contrib-connect": "~0.2.0",
        "grunt-contrib-livereload": "~0.1.2",
        "grunt-contrib-jshint": "~0.4.3"
      }
    });

    // All done!
    done();
  });

};

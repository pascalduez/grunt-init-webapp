"use strict";

var path = require("path");
var lrSnippet = require("grunt-contrib-livereload/lib/utils").livereloadSnippet;
var folderMount = function folderMount( connect, point ) {
  return connect.static( path.resolve(point) );
};

module.exports = function( grunt ) {
  // load all grunt tasks
  require("matchdep").filterDev("grunt-*").forEach( grunt.loadNpmTasks );

  // Project configuration.
  grunt.initConfig({
    connect: {
      options: {
        port: 9000,
        // hostname: "0.0.0.0", // access server from outside
        hostname: "localhost"
      },
      livereload: {
        options: {
          middleware: function( connect ) {
            return [
              lrSnippet,
              folderMount(connect, ".")
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: "http://localhost:<%= connect.options.port %>"
      }
    },
    regarde: {
      fred: {
        files: [
          "*.html",
          "js/*.js",
          "css/*.css",
          "img/*.{png,jpg,jpeg,svg}"
        ],
        tasks: ["livereload"]
      }
    },
    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      all: [
        "Gruntfile.js",
        "js/*.js"
      ]
    }
  });

  grunt.registerTask("default", "jshint");

  grunt.registerTask("server", [
    "livereload-start",
    "open",
    "connect:livereload",
    "regarde"
  ]);

};

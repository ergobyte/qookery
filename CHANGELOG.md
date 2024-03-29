# Changelog

## [0.7.0] - in progress

* Upgraded source code and tooling to the new nodejs-based QX compiler
* New flow control statement <for-each>, helps with component repetitions in forms
* Using objectid module of QX6 for component identifiers
* Support for the embedded version of Google Maps
* More options supported by Ace editor component
* Forms automatically place focus onto the lowest tab-index component 
* Many ESLint errors fixed

## [0.6.0] - 2019-03-03

* New `qookery.IAttributeSet` interface simplifies attribute handling
* New form readiness facility gives XML authors a useful `$.Form.isReady()` to act upon
* The location of external libraries is now configurable by the application author
* New elements `<canvas>`, `<combo-box>`, `<menu-button>`, `<split-button>`
* `<rich-text>`, `<html>`, `<scroll>` and others improved and/or corrected
* Drag'n'drop attributes added
* Code style checking switched to Tern

## [0.5.0] - 2018-07-25

* `<script>` configurable debouncing and recursion prevention
* Support for on-demand dependencies, their resolution happening lazily as needed
* XML namespaces may be freely set at any element with expected results
* Cell editor support by `<table>` component
* Better handling of script errors
* `xml:lang` support for locale-specific markup, making i18n easier
* Compatibility with upcoming Qooxdoo 6 contrib system

## [0.4.0] - 2017-08-24

* Support for most layout managers provided by Qooxdoo
* Support for -possibly named- media queries, in scripts or as if-expressions
* Service resolution can happen anytime after form parsing
* Attributes were added or updated to better match the Qooxdoo API
* CKEditor can be provided with custom configuration
* Pluggable variable providers, read-only and typed variables
* The Qookery Demo application was rewritten in Qookery

## [0.3.0] - 2017-02-05

* Scripts are pre-compiled during parsing
* Configurable dependency injection
* Registry rewrote as a map-of-maps, allowing an unlimited number of partitions
* Flow control elements `<if>`, `<then>`, `<switch>`
* Google Maps extension
* `ValidationError` extends `Error`, as originally intended
* Numnerous bugfixes and improvements to existing components

## [0.2.0] - 2015-09-12

* Moved to Qooxdoo 5.0
* Google maps component and demo
* New library features
* Model connections
* Improvements to API documentation

## [0.1.0] - 2015-07-30

Initial release

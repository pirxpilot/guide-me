PROJECT=tour

all: check compile

check: lint

lint:
	jshint index.js

compile: build/build.js build/build.css

build:
	mkdir -p $@

build/build.js: node_modules index.js | build
	browserify --require ./index.js:$(PROJECT) --outfile $@

.DELETE_ON_ERROR: build/build.js

build/build.css: \
	node_modules/overlay-component/overlay.css \
	node_modules/code42day-confirmation-popover/node_modules/code42day-popover/node_modules/code42day-tip/tip.css \
	node_modules/code42day-confirmation-popover/popover.css \
	| build
	cat $^ > $@

node_modules: package.json
	npm install

clean:
	rm -fr build node_modules

.PHONY: clean lint check all build

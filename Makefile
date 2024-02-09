PROJECT=Tour

all: check compile

compile: build/build.js build/build.css

build:
	mkdir -p $@

build/build.js: node_modules index.js | build
	node_modules/.bin/esbuild \
		--bundle \
		--define:DEBUG="true" \
		--global-name=$(PROJECT) \
		--outfile=$@ \
		index.js

build/build.css: \
	node_modules/@pirxpilot/overlay/overlay.css \
	node_modules/@pirxpilot/confirmation-popover/popover.css \
	node_modules/@pirxpilot/tip/tip.css \
	| build
	cat $^ > $@

node_modules: package.json
	yarn
	touch $@

clean:
	rm -fr build

distclean: clean
	rm -rf node_modules

check: lint

lint:
	./node_modules/.bin/jshint *.js lib

.PHONY: check lint check compile

PROJECT=Tour

all: check compile

compile: build/build.js build/build.css

build:
	mkdir -p $@

build/build.js: index.js | build
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

clean:
	rm -fr build

check: lint

lint:
	./node_modules/.bin/biome ci

format:
	./node_modules/.bin/biome check --fix

.PHONY: all clean check lint format compile

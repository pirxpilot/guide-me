NODE_BIN=./node_modules/.bin

all: check build

check: lint

lint:
	$(NODE_BIN)/jshint index.js

build: components index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components

.PHONY: clean lint check test

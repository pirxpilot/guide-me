NODE_BIN=./node_modules/.bin

check: lint

lint:
	$(NODE_BIN)/jshint index.js test

test:
	$(NODE_BIN)/mocha --require should test

build: components index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components

.PHONY: clean lint check test

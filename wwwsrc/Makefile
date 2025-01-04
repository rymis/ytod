
all: node_modules
	npm run build

clean:
	rm -f dist/index.js dist/styles.css

node_modules:
	npm install

install: all
	cp dist/index.js ../ytod/wwwroot/index.js
	cp dist/index.js.map ../ytod/wwwroot/index.js.map
	cp dist/styles.css ../ytod/wwwroot/index.css

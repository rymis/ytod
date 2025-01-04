
all: node_modules
	npm run build

clean:
	rm -f dist/index.js

node_modules:
	npm install

install: all
	cp dist/index.js ../ytod/wwwroot/index.js


LOCALES = ru cs
PO_FILES = $(foreach loc,$(LOCALES),locales/messages.$(loc).po)
JSMSG_FILES = $(PO_FILES:.po=.json)

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

dev:
	node devserver.mjs

xgettext: src/messages.js

src/messages.js: $(JSMSG_FILES)
	python3 locales/msgcompile.py

%.json: %.po
	npx po2json -f raw $< $@

$(PO_FILES):
	mkdir -p ./locales
	xgettext -L JavaScript -o locales/messages.pot --keyword=t ./src/*.js* ./src/components/*.js*
	for po in $(PO_FILES); do if [ \-f "$$po" ]; then msgmerge --update "$$po" locales/messages.pot; else msginit "$$po" -i locales/messages.pot; fi; done

.PHONY: xgettext dev

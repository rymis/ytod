all:
	@echo Nothing to do

format:
	python3 -m pycodestyle --ignore=E722 --max-line-length=200 ytod/*.py

test: unittest integration_test
	echo "All tests have passed"

unittest:
	./venv/bin/python3 -m unittest ytod/*_test.py

integration_test:
	./venv/bin/python3 ./integration_test/integration_test.py test

.PHONY: format test integration_test unittest

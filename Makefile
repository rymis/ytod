all:
	@echo Nothing to do

format:
	python3 -m pycodestyle --ignore=E722 --max-line-length=200 ytod/*.py

test:
	python3 -m unittest ytod/*_test.py


.PHONY: format test

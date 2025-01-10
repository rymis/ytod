all:
	@echo Nothing to do

format:
	python3 -m pycodestyle --max-line-length=100 ytod/*.py

test:
	python3 -m unittest ytod/*_test.py


.PHONY: format test

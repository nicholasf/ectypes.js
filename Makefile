BIN=./node_modules/.bin

test: install
	NODE_ENV=test ${BIN}/mocha test
	@echo "Unit tests passed!";

# Ensure all npm deps are present
install:
	if [[ "$(PLATFORM)" != "docker" ]]; then \
		npm install ;\
	fi

lint:
	${BIN}/eslint .
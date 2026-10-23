
.PHONY: dev server client install build preview start clean help



dev:
	npm run dev

server:
	npm run dev:server

client:
	npm run dev:client




install:
	npm install

build:
	npm run build

preview:
	npm run preview




start:
	npm start

clean:
	@echo Cleaning up...
	@if exist node_modules rmdir /s /q node_modules
	@if exist dist rmdir /s /q dist
	@echo Done.




help:
	@echo.
	@echo  RBP — Makefile Commands
	@echo  =============================================
	@echo  make dev       Start dev (server + client)
	@echo  make server    Start server only
	@echo  make client    Start client only
	@echo  make install   Install dependencies
	@echo  make build     Build for production
	@echo  make preview   Preview production build
	@echo  make start     Start production server
	@echo  make clean     Remove node_modules and dist
	@echo.

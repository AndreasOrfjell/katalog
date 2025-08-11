.PHONY: up down logs build

up:
	docker compose up --remove-orphans

down:
	docker compose down

logs:
	docker compose logs -f --tail=100

build:
	cd server && npm install
	cd web && npm install

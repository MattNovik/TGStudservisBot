install:
	docker build -t tg_bot .

run:
	docker compose up

run-dev:
	npm run dev

stop: 
	docker stop tg_bot
run:
	docker compose up

run-dev:
	npm run dev

stop: 
	docker stop tg-bot-app

delete:
	docker rm tg-bot-app
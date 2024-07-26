install:
	docker build -t tg_bot .

run:
	docker build -t tg_bot . 
	docker run tg_bot

stop: 
	docker stop tg_bot
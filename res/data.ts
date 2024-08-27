const FROM_TYPES: {
  all: string,
  catBot: string,
  after: string
} = {
  all: 'all',
  catBot: 'catBot',
  after: 'after',
};

const ACTION_SCENE_OUT: Array<string> = [
  '/start',
  '/manager',
  '/create',
  '/state',
  '/cancel'
];

const BOT_COMMANDS: Array<{ command: string, description: string }> = [
  {
    command: 'start',
    description: 'Начало общения',
  },
  {
    command: 'create',
    description: 'Создать заказ',
  },
  {
    command: 'state',
    description: 'Информация по заказу',
  },
  {
    command: 'manager',
    description: 'Общение с менеджером',
  },
  {
    command: 'cancel',
    description: 'Выйти из меню',
  },
]

export { FROM_TYPES, ACTION_SCENE_OUT, BOT_COMMANDS };

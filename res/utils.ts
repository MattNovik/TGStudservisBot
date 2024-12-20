const getRndInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const rebuildDate = (date: string) => {
  const spliteDate: Array<string> = date.split('-');
  const recreatedDate = `${spliteDate[2]}-${(+spliteDate[1] - 1)}-${spliteDate[0]}`;
  return Date.parse(recreatedDate);
};

export { getRndInteger, rebuildDate, regexEmail };

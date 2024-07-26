const getRndInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export { getRndInteger, regexEmail };

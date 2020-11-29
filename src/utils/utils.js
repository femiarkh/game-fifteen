const utils = {
  shuffle: (array) => {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i += -1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    return element;
  },

  padWithZeroes(number) {
    return (number < 10) ? `0${number}` : number.toString();
  },

  formatTime(time) {
    if (time < 60) {
      return this.padWithZeroes(time);
    }
    if (time < 3600) {
      return `${this.padWithZeroes(Math.floor(time / 60))}:${this.padWithZeroes(time % 60)}`;
    }
    const hours = this.padWithZeroes(Math.floor(time / 3600));
    const remainder = time % 3600;
    const minutes = this.padWithZeroes(Math.floor(remainder / 60));
    const seconds = this.padWithZeroes(remainder % 60);
    return `${hours}:${minutes}:${seconds}`;
  },
};

export default utils;

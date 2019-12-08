export default {
  checkNumber(data) {
    data = +data;
    return !isNaN(data) && data === parseInt(data);
  },

  checkByte(data) {
    data = +data;
    if (!this.checkNumber(data)) return 0;
    return 0 <= data && data < 0xff;
  }
};

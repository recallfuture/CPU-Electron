import Utils from "./utils";

/**
 * 存储器类
 */

export default class Memory {
  constructor() {
    // 数据
    this.data = [];
  }

  /**
   * 将不足的部分用0填充
   * @param {number} address 地址
   */
  fillTo(address) {
    for (let i = this.data.length; i <= address; ++i) {
      this.data[i] = [0, 0, 0, 0];
    }
  }

  /**
   * 获取此地址上的数据
   * @param {number} address 地址
   */
  get(address) {
    const index = Math.floor(address / 4);
    const offset = address % 4;
    if (typeof this.data[index] == "undefined") {
      this.fillTo(index);
    }
    return this.data[index][offset];
  }

  /**
   * 修改某地址上的数据
   * @param {number} address 地址
   * @param {number} byte 数据（0-255）
   */
  set(address, byte) {
    const index = Math.floor(address / 4);
    const offset = address % 4;
    if (typeof this.data[index] == "undefined") {
      this.fillTo(index);
    }
    this.data[index][offset] = byte;
  }

  /**
   * 写入字节
   * @param {number} address 地址
   * @param {number} byte 数据（0-255）
   */
  writeByte(address, byte) {
    if (!Utils.checkByte(byte)) {
      throw new Error("写入失败");
    }
    this.set(address, byte);
  }

  /**
   * 读取字节
   * @param {number} address 地址
   */
  readByte(address) {
    return this.get(address);
  }

  /**
   * 写入16位整型数据
   * @param {number} address 地址
   * @param {number} 16位的整型数据
   */
  writeInt(address, int) {
    if (!Utils.checkNumber(int)) {
      throw new Error("写入失败");
    }
    for (var i = 0; i < 4; ++i) {
      this.set(address + i, int & 0xf);
      int >>= 4;
    }
  }

  /**
   * 读取16位整型数据
   * @param {number} address 地址
   */
  readInt(address) {
    return (
      this.get(address + 0) +
      this.get(address + 1) * 0x10 +
      this.get(address + 2) * 0x100 +
      this.get(address + 3) * 0x1000
    );
  }
}

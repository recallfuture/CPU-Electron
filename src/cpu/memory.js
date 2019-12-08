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
      this.data.push([0, 0, 0, 0]);
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
   * @param {number} byte 数据（0-0xff）
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
   * @param {number} byte 数据（0-0xff）
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
  writeShort(address, int) {
    if (!Utils.checkNumber(int)) {
      throw new Error("写入失败");
    }
    for (var i = 0; i < 2; ++i) {
      this.set(address * 2 + i, int & 0xff);
      int >>= 8;
    }
  }

  /**
   * 读取16位整型数据
   * @param {number} address 地址
   */
  readShort(address) {
    return this.get(address * 2 + 0) + (this.get(address * 2 + 1) << 8);
  }

  /**
   * 写入32位整型数据
   * @param {number} address 地址
   * @param {number} 32位的整型数据
   */
  writeInt(address, int) {
    if (!Utils.checkNumber(int)) {
      throw new Error("写入失败");
    }
    for (var i = 0; i < 4; ++i) {
      this.set(address * 4 + i, int & 0xff);
      int >>= 8;
    }
  }

  /**
   * 读取32位整型数据
   * @param {number} address 地址
   */
  readInt(address) {
    return (
      this.get(address * 4 + 0) +
      (this.get(address * 4 + 1) << 8) +
      (this.get(address * 4 + 2) << 16) +
      (this.get(address * 4 + 3) << 24)
    );
  }
}

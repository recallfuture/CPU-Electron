import Constant from "./constant";
import Utils from "./utils";

/**
 * 寄存器类
 */
export default class Register {
  constructor() {
    const register = this;

    // 全部初始化为0
    Constant.REGISTERS.forEach(name => {
      register[Constant[name]] = 0;
    });
  }

  /**
   * 获取寄存器的值
   * @param {string|number} name 寄存器名或者寄存器号
   */
  get(name) {
    if (!Utils.checkNumber(name)) {
      if (typeof this[Constant[name]] === "undefined") {
        throw new Error("不存在的寄存器名：" + name);
      }
      return this[Constant[name]];
    }
    return this[name];
  }

  /**
   * 设置寄存器的值
   * @param {string|number} name 寄存器名或者寄存器好
   * @param {number}} value 值
   */
  set(name, value) {
    if (!Utils.checkNumber(name)) {
      if (typeof Constant[name] !== "undefined" && name !== "R_NONE") {
        this[Constant[name]] = value;
      } else {
        return false;
      }
    }
    if (!(0 <= name && name < 8)) return false;
    this[name] = value;
    return true;
  }
}

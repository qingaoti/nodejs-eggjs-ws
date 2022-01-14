'use strict';

/**
 * 通用的业务常量
 */
module.exports = {
  /**
   * 角色
   */
  ROLES: {
    'admin': {name: '系统管理员', value: 'admin'},
    'appUser': {name: 'app用户', value: 'appUser'},
    'systemUser': {name: '系统用户', value: 'systemUser'},
  },

  /**
   * 时间格式化类型
   */
  MOMENT_TYPE: {
    NORMAL: 'YYYY-MM-DD HH:mm:ss',
    DATE_POINT_TYPE: 'YYYY.MM.DD HH:mm',
    DATE_POINT_DAY: 'YYYY.MM.DD',
    DATE_POINT_HOUR: 'YYYY.MM.DD HH'
  },

  /**
   * 正则表达式
   */
  REG_EXP: {
    //ObjectId 正则
    _ID: /^[0-9a-fA-F]{24}$/,
    //11位手机号码正则
    PHONE: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
    //密码
    PASSWORD: /^.{6,50}$/,
    //邀请码
    INV_CODE: /^[a-zA-Z0-9]{6}$/,
    //名称
    NAME: /^[\u4e00-\u9fa5a-zA-Z]{2,20}$/,
    //身份证
    CARD_NUM: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,


    // //小场景英文名称
    // PROGRAM_EN_NAME: /^[A-Za-z0-9]{1,30}$/,
    // //小场景介绍
    // PROGRAM_INTRO: /^[\s\S]{10,120}$/,
    // //版本介绍
    // PROGRAM_VERSION_INTRO: /^[\s\S]{1,120}$/,
    // //版本号
    // PROGRAM_VERSION: /^[1-9]\.\d\.(\d|[1-9]\d|[1-9]\d{2})$/,

  },

  //设备枚举
  DEVICE_TYPE: {
    Unknow: {val: 0, name: '未定义'},
    ElecCover: {val: 1, name: '电子井盖'},
    Door: {val: 2, name: '门禁'},
    Pdtrend: {val: 3, name: '电缆局放'},
    Circulating: {val: 4, name: '电缆环流'},
    CurrentCarring: {val: 5, name: '电缆载流'},
    CH4: {val: 6, name: '甲烷'},
    O2: {val: 7, name: '氧气'},
    CO: {val: 8, name: '一氧化碳'},
    CO2: {val: 9, name: '二氧化碳'},
    Waterlevel: {val: 10, name: '水位'},
    Pump: {val: 11, name: '水泵'},
    LightAndSoundAlarm: {val: 12, name: '声光报警'},
    JointTemper: {val: 13, name: '接头测温'},
    Temperature: {val: 14, name: '温度'},
    Humidity: {val: 15, name: '湿度'},
    H2S: {val: 16, name: '硫化氢'},
    InfaredBeam: {val: 17, name: '红外对射'},
    CableTemper: {val: 18, name: '光纤测温（电缆本体温度）'},
    Fan: {val: 19, name: '风机'},
    ZSC: {val: 20, name: '零序电流'},
    Video: {val: 21, name: '视频'},
    Cl2: {val: 22, name: '氯气'},
    Grating: {val: 23, name: '光栅测温'},
    Telephone: {val: 24, name: '电话'},
    ThermalLine: {val: 25, name: '热敏线'},
    Extinguisher: {val: 26, name: '灭火器'},
    LightControl: {val: 27, name: '照明控制'},
    PowerControl: {val: 28, name: '电源控制'},
    SmokeDetector: {val: 29, name: '烟感'},
    DielectricLoss: {val: 30, name: '介质损失'},
    CombustibleGas: {val: 31, name: '可燃气体'},
    PoisonousGas: {val: 32, name: '有毒气体'},
    FireAlarm: {val: 33, name: '火灾报警'},
    FireDoor: {val: 34, name: '防火门'},
    LED: {val: 35, name: 'LED显示屏'},
    ManualAlarm: {val: 36, name: '手动报警'},
    StressStrain: {val: 37, name: '应力应变'},
    FireDetection: {val: 38, name: '热成像摄像头'},
    Thermemotry: {val: 39, name: '热成象实时测温'},
    EntranceGuard: {val: 40, name: '人员认证门禁'},
    FaceDetection: {val: 41, name: '人脸识别摄像头'},
    SafetyHelment: {val: 42, name: '安全帽识别摄像头'},
    PeopleCounter: {val: 43, name: '人员进出计数'},
    CurtainDoor: {val: 44, name: '卷帘门'}
  },

  //webSorcket登录，登录的客户端类型  Dispatcher 调度子站 ， WebClient 网页客户端
  CLIENT_TYPE:['Dispatcher','WebClient']

}

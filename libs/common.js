const crypto=require('crypto');

module.exports={
  MD5_SUFFIX: '白日依山尽，黄河入海流',
  md5: function (str){
    var obj=crypto.createHash('md5');

    obj.update(str);

    return obj.digest('hex');
  }
};

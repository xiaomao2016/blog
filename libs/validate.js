exports.checkEmpty=function(param,controlName){
	if (!param) {
		return [controlName+"不能为空！",true];//不能为empty strings (""), null, undefined, false and the numbers 0 and NaN
	};
};
exports.checkLength=function(param,controlName,length){
    if(param.length<length){
        return "至少要输入"+length+"个字符";
    }
};
exports.checkInterval = function (param,controlName, minLength, maxLength) {
    if (param.length < minLength) {
        return [controlName+"少于" + minLength + "个字符",true];
    }
    if(param.length>maxLength){
        return [controlName+"用户名大于" + minLength + "个字符",true];
    }
};

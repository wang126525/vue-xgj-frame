import {fetchGet,fetchPost} from '../config/http'
import {getStore} from '../config/mUtils'



/**
 * 试例
 * 获取手机验证码
 */

export const getCode = params => fetchGet('/v1.0/code', params);



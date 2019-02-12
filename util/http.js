import {
    config
} from '../config.js'
const tips = {
    1: '抱歉，出现了一个错误',
    1005: 'appkey无效',
    3000: '期刊不存在'
}
class HTTP {
    request(params) {
        if (!params) {
            params.method = "GET"
        }
        wx.request({
            // 必需
            url: config.api_base_url + params.url,
            method: params.method,
            data: params.data,
            header: {
                'Content-Type': 'application/json',
                'appkey': config.appkey
            },
            success: (res) => {
                let code = res.statusCode.toString()
                if (code.startsWith('2')) {
                    if (params.success) {
                        params.success(res.data)
                    }
                    //判断是否有回调函数
                } else {
                    let error_code = res.data.error_code
                    this._show_error(error_code)
                }
            },
            fail: (err) => {
                this._show_error(1)
            },
            complete: (res) => {}
        })
    }
    _show_error(error_code) {
        if (!error_code) {
            error_code = 1
        }
        const tip = tips[error_code]
        wx.showToast({
            title: tip ? tip : tips[1],
            icon: 'none', // "success", "loading", "none"
            duration: 2000,
            mask: false,
        })
    }
}
export {
    HTTP
}
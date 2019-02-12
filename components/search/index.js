import {
    KeywordModel
} from '../../models/keyword.js'
import {
    BookModel
} from '../../models/book.js'
import {
    paginationBev
} from '../behaviors/pagination.js'
const keywordModel = new KeywordModel()
const bookModel = new BookModel()
Component({
    /**
     * 组件的属性列表
     */
    behaviors: [paginationBev],
    properties: {
        more: {
            type: String,
            observer: 'loadMore'
            //属性值改变时执行函数
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        historyWords: [],
        hotWords: [],
        searching: false,
        q: '',
        loading: false,
        loadingCenter: false
    },
    attached() {
        const historyWords = keywordModel.getHistory()
        const hotWords = keywordModel.getHot()
        this.setData({
            historyWords: historyWords
        })
        hotWords.then(res => {
            this.setData({
                hotWords: res.hot
            })
        })
    },
    /**
     * 组件的方法列表
     */
    methods: {
        loadMore() {
            if (!this.data.q) {
                return
            }
            if (this.isLocked()) {
                return
            }
            //保证一次只发送一个请求
            if (this.hasMore()) {
                this.locked()
                bookModel.search(this.getCurrentStart(), this.data.q).then(res => {
                    this.setMoreData(res.books)
                    this._unLocked()
                }, () => {
                    this.unLocked()
                    //返回error依然解锁
                })
            }
        },
        onCancel(event) {
            this.triggerEvent('cancel', {}, {})
            this.initialize()
        },
        onDelete(event) {
            this._closeResult()
            this.initialize()
        },
        onConfirm(event) {
            this._showResult()
            this._showLoadingCenter()
            this.initialize()
            const q = event.detail.value || event.detail.text
            //输入文本，点击文本
            this.setData({
                q: q
            })
            bookModel.search(0, q).then(res => {
                this.setMoreData(res.books)
                this.setTotal(res.total)
                keywordModel.addToHistory(q)
                this._hideLoadingCenter()
            })
        },
        _showLoadingCenter() {
            this.setData({
                loadingCenter: true
            })
        },
        _hideLoadingCenter() {
            this.setData({
                loadingCenter: false
            })
        },
        _showResult() {
            this.setData({
                searching: true
            })
        },
        _closeResult() {
            this.setData({
                searching: false,
                q: ''
            })
        }
        // scroll-view | Page onReachBottom 判断页面滑动到底端
    }
})
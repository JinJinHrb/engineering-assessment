import _ from 'lodash'

export default class {
    _limitExecSpeedListObj = {}

    /**
     * 限制同时执行 Promise 方法数量
     * @param {Function} fun Promise 方法
     * @param {Array} args
     * @param {String} taskId
     * @param {Number} limitNumber
     */
    limitExecSpeedPromise = ({ fun, args, taskId, upperLimit = 5 }) => {
        const consumeLimitExecSpeedList = taskId => {
            const { list = [], upperLimit = 5 } = this._limitExecSpeedListObj[taskId]
            let runningNumber = _.get(this._limitExecSpeedListObj, [taskId, 'runningNumber']) ?? 0
            if (runningNumber < 0) {
                console.error(
                    'consumeLimitExecSpeedList #2479 WARNING: runningNumber < 0, runningNumber: ',
                    runningNumber
                )
                runningNumber = 0
            }
            if (list.length < 1) {
                return
            }
            const elem = list.shift() || {}
            const { rsvRoot, rejRoot, _this, fun, args } = elem
            this._limitExecSpeedListObj[taskId]['runningNumber'] = ++runningNumber
            if (runningNumber <= upperLimit) {
                consumeLimitExecSpeedList(taskId)
            }
            new Promise(rsv => {
                fun.apply(_this, args).then(
                    feed => {
                        rsvRoot(feed)
                        rsv(null)
                    },
                    err => {
                        rejRoot(err)
                        rsv(null)
                    }
                )
            }).then(() => {
                let runningNumber2 = _.get(this._limitExecSpeedListObj, [taskId, 'runningNumber']) || 0
                this._limitExecSpeedListObj[taskId]['runningNumber'] = --runningNumber2
                if (runningNumber2 <= upperLimit) {
                    consumeLimitExecSpeedList(taskId)
                }
            })
        }

        return new Promise((rsvRoot, rejRoot) => {
            if (!(fun instanceof Function)) {
                return rejRoot({ code: 110, msg: 'wrong fun' })
            }
            if (!args) {
                return rejRoot({ code: 110, msg: 'args cannot be blank' })
            }
            if (!(args instanceof Array)) {
                args = [args]
            }
            if (!taskId) {
                return rejRoot({ code: 110, msg: 'taskId cannot be blank' })
            }
            if (!_.isNumber(upperLimit)) {
                return rejRoot({ code: 110, msg: `upperLimit is not a number: ${upperLimit}` })
            }
            if (!this._limitExecSpeedListObj[taskId]) {
                this._limitExecSpeedListObj[taskId] = {
                    list: [],
                    upperLimit
                }
            }
            const limitExecSpeedList = this._limitExecSpeedListObj[taskId]['list']
            limitExecSpeedList.push({ rsvRoot, rejRoot, _this: this, fun, args })
            if (limitExecSpeedList.length === 1) {
                consumeLimitExecSpeedList(taskId)
            }
        })
    }

    /**
     * 如果条件满足，走到下一步 options: {recurInterval, maxRetryTimes, overtimeHandler}
     * */
    stepDownIfConditionSatisfiedPromise = (conditionHandler: () => boolean, options) => {
        if (!options) {
            options = {}
        }
        const recurInterval = options.recurInterval || 500
        if (!conditionHandler || !(conditionHandler instanceof Function)) {
            return Promise.resolve(null)
        }
        const recurHandler = function (rsv: (value: unknown) => void, rej: (value: unknown) => void, times?: number) {
            if (!times) {
                times = 0
            }
            times++
            /*if(config.isDevelop){
            console.log(new Date(), 'stepDownIfConditionSatisfiedPromise - #20 times = ' + times);
        }*/
            if (conditionHandler()) {
                return rsv(null)
            }
            if (options.maxRetryTimes && times > options.maxRetryTimes) {
                // console.log(new Date(), 'stepDownIfConditionSatisfiedPromise #24');
                if (options.overtimeHandler) {
                    options.overtimeHandler.call(null, rsv, rej, times)
                } else {
                    rej({
                        error: true,
                        message: 'stepDown retry overtime: ' + options.maxRetryTimes
                    })
                }
            } else {
                return setTimeout(function () {
                    /* if(config.isDevelop){
                    console.log(new Date(), 'stepDownIfConditionSatisfiedPromise - #1673 times = ' + times);
                } */
                    recurHandler(rsv, rej, times)
                }, recurInterval)
            }
        }
        return new Promise(function (rsv, rej) {
            recurHandler(rsv, rej)
        })
    }
}

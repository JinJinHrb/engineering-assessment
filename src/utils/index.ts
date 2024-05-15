import _ from 'lodash'
import { cloneDeep } from 'lodash-es'
import { format } from 'date-fns'

/**
 * setCookie
 *
 * @export
 * @param {string} name
 * @param {string} value
 * @param {number} [expiredays=365]
 */
export function setCookie(name: string, value: string, expiredays = 365) {
    const exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = `${name}=${escape(value)};expires=${exdate.toUTCString()}`
}

/**
 * getCookie
 *
 * @export
 * @param {string} name
 * @returns
 */
export function getCookie(name: string) {
    if (document.cookie.length > 0) {
        let cStart = document.cookie.indexOf(name + '=')
        if (cStart !== -1) {
            cStart = cStart + name.length + 1
            let cEnd = document.cookie.indexOf(';', cStart)
            if (cEnd === -1) {
                cEnd = document.cookie.length
            }
            return unescape(document.cookie.substring(cStart, cEnd))
        }
    }
    return ''
}

/**
 * clearCookie
 *
 * @export
 * @param {string} name
 */
export function clearCookie(name: string) {
    setCookie(name, '')
}

/**
 * 从url获取参数
 *
 * @export
 * @param {string} name
 * @returns {string}
 */
export function queryURL(name: string): string {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
    const result = window.location.search.substr(1).match(reg)
    if (result !== null) {
        return decodeURI(result[2])
    }
    return null
}

/**
 * 数组查询
 *
 * @export
 * @template T
 * @param {any[]} array
 * @param {string} key
 * @param {string} [keyAlias='key']
 * @returns {T}
 */
export function queryArray<T>(array: any[], key: string, keyAlias = 'key'): T {
    if (!(array instanceof Array)) {
        return null
    }
    const item = array.filter(a => a[keyAlias] === key)
    if (item.length) {
        return item[0]
    }
    return null
}

/**
 * 数组格式转树状结构
 *
 * @export
 * @template T
 * @param {any[]} array
 * @param {string} [id='id']
 * @param {string} [pid='pid']
 * @param {string} [children='children']
 * @returns {T[]}
 */
export function arrayToTree<T>(array: any[], id = 'id', pid = 'pid', children = 'children'): T[] {
    const data = cloneDeep(array)
    const result = []
    const hash = {}
    data.forEach((_, index) => {
        hash[data[index][id]] = data[index]
    })
    data.forEach(item => {
        const hashVP = hash[item[pid]]
        if (hashVP) {
            if (!hashVP[children]) {
                hashVP[children] = []
            }
            hashVP[children].push(item)
        } else {
            result.push(item)
        }
    })
    return result
}

export enum FormatType {
    Y4M2D2 = 'yyyy-MM-dd',
    Y4M2D2_H2 = 'yyyy-MM-dd hh',
    Y4M2D2_H2m2 = 'yyyy-MM-dd hh:mm',
    Y4M2D2_H2m2s2 = 'yyyy-MM-dd hh:mm:ss',
    Y4M2D2_H2m2s2S3 = 'yyyy-MM-dd hh:mm:ss.SSS',
    Y4M2D2_h2 = 'yyyy-MM-dd hh',
    Y4M2D2_h2m2 = 'yyyy-MM-dd hh:mm',
    Y4M2D2_h2m2s2 = 'yyyy-MM-dd hh:mm:ss',
    Y4M2D2_h2m2s2S3 = 'yyyy-MM-dd hh:mm:ss.SSS'
}

// 识别 saga 日志的特殊标识
const SAGAS_LOGGER = 'sagas/logger'

/**
 * 本地打印自动带上时间戳
 * @returns
 */
export const XTConsole =
    import.meta.env.VITE_APP_ENV !== 'prod'
        ? (function () {
              const getFn = function (op: string) {
                  return function (...args: any[]) {
                      args = args.map(el => {
                          /* if (Iterable.isIterable(el)) {
                              return el.toJS()
                          } else  */ if (_.isObjectLike(el)) {
                              const elCopy = {}
                              Object.keys(el).forEach(k => {
                                  const val = el[k]
                                  /* if (Iterable.isIterable(val)) {
                                      elCopy[`${k}.toJS()`] = val.toJS()
                                  } else { */
                                  elCopy[k] = val
                                  // }
                              })
                              return elCopy
                          }
                          return el
                      })
                      const dateStr = format(new Date(), FormatType.Y4M2D2_H2m2s2S3)
                      args.unshift(dateStr)
                      if (_.get(args, 1) === SAGAS_LOGGER) {
                          const argSubArr1 = args.slice(0, 4)
                          const argSubArr2 = args.slice(4)
                          argSubArr1.splice(3, 1, `%c${argSubArr1[3]}`)
                          argSubArr1.splice(2, 1, `%c${argSubArr1[2]}`)
                          argSubArr1.splice(1, 1, `%c${argSubArr1[1]}`)
                          args = [argSubArr1.join(' ')]
                          args.push('color: grey')
                          args.push('color: darkBlue')
                          args.push('color: darkGreen')
                          args.push(...argSubArr2)
                      }
                      console[op].apply(null, args)
                  }
              }
              const rtn = {} as typeof console
              Object.keys(console)
                  .filter(k => {
                      const v = _.get(console, k)
                      return _.isFunction(v)
                  })
                  .forEach(op => {
                      rtn[op] = getFn(op)
                  })
              return rtn
          })()
        : (function () {
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              const nilFn = () => {}
              const rtn = {} as typeof console
              Object.keys(console)
                  .filter(k => {
                      const v = _.get(console, k)
                      return _.isFunction(v)
                  })
                  .forEach(op => {
                      if (['log', 'warn'].includes(op)) {
                          rtn[op] = nilFn
                      } else {
                          rtn[op] = console[op]
                      }
                  })
              return rtn
          })()

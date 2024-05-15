/**
 * Created by WangFan on 14/11/10.
 */
import _ from 'lodash'
import { oType } from './stringUtil'
import { Node, NodePath } from '@babel/traverse'
import { Identifier } from '@babel/types'

// 跳过 "type": "TSNonNullExpression" 获取 parentPath
export const getParentPathSkipTSNonNullExpression = (path: NodePath<Node> | NodePath<Identifier>, degree = 1) => {
    if (!path) {
        return path
    }
    if (!_.isNumber(degree) || degree < 1) {
        throw new Error('degree must be number and cannot be less than 1')
    }
    while (degree > 0) {
        if (path.parentPath?.node.type === 'TSNonNullExpression') {
            path = path.parentPath.parentPath
        } else {
            path = path.parentPath
        }
        degree--
    }
    return path
}

export const iterateObject4certainArray = function (obj: any, keyName: string, resultArr: any) {
    if (!_.isObject(obj)) {
        return
    }
    Object.keys(obj).forEach(function (key) {
        const elem = (obj as any)[key]
        if (elem instanceof Array && key === keyName) {
            OUTTER: for (let i = 0; i < elem.length; i++) {
                const subElem = elem[i]
                if (_.isObject(subElem) && (subElem as any)['id']) {
                    for (let j = 0; j < resultArr.length; j++) {
                        if (resultArr[j] && resultArr[j]['id'] && resultArr[j]['id'] === (subElem as any)['id']) {
                            continue OUTTER
                        }
                    }
                } else if (_.isString(subElem) || _.isNumber(subElem)) {
                    if (resultArr.indexOf(subElem) > -1) {
                        continue OUTTER
                    }
                }
                resultArr.push(subElem)
            }
        } else if (_.isObject(elem)) {
            iterateObject4certainArray(elem, keyName, resultArr)
        }
    })
}

export const iterateObject4certainObject = (
    obj: any,
    validateHandler: (key: string, elem: unknown) => boolean,
    resultArr: unknown[]
) => {
    if (oType(obj) !== 'object') {
        return
    }
    Object.keys(obj).forEach(function (key) {
        const elem = obj[key]
        if (oType(elem) === 'object' && !(elem instanceof Array) && validateHandler(key, elem)) {
            resultArr.push(elem)
        } else if (oType(elem) === 'object') {
            iterateObject4certainObject(elem, validateHandler, resultArr)
        }
    })
}

export const iterateObject4certainKeyVals = function ({ obj, keys, resultArr }: any) {
    if (oType(obj) !== 'object') {
        return
    }
    Object.keys(obj).forEach(function (key) {
        if (keys.indexOf(key) > -1 && oType(obj[key]) === 'string') {
            if (resultArr.indexOf(obj[key]) < 0) {
                resultArr.push(obj[key])
            }
        } else if (oType(obj[key]) === 'object') {
            iterateObject4certainKeyVals({ obj: obj[key], keys, resultArr })
        }
    })
}

/** @param converter e.g. {'http://www.baidu.com': 'https://www.google.com'}
 * if options.isReplace === 'Y', recur rawData all over and replace the key of converter with its corresponding value
 * */
export const iterateObject2replaceCertainValue = (rawData: any, converter: any, options: any) => {
    if (_.isEmpty(converter)) {
        return rawData
    }
    if (!options) {
        options = {}
    }
    let data: string | object | string[] | object[]
    if (options.clone === 'Y') {
        data = deepClone(rawData)
    } else {
        data = rawData
    }
    const isReplace = _.trim(options.isReplace)
    const recurHandler = function (elem: any, converter: any) {
        if (oType(elem) !== 'object') {
            return
        }
        const keys = Object.keys(elem)
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const val = elem[key]
            if (oType(val) !== 'object') {
                if (isReplace === 'Y' && oType(val) === 'string') {
                    Object.keys(converter).forEach(k => {
                        elem[key] = val.replace(k, converter[k])
                    })
                } else {
                    const convertVal = converter[val]
                    if (convertVal && oType(val) === oType(convertVal)) {
                        elem[key] = convertVal
                    }
                }
            } else {
                recurHandler(val, converter)
            }
        }
    }
    recurHandler(data, converter)
    return data
}

/** 使用正则表达式递归替换对象的值 */
export const iterateObject2replaceCertainValueByRegex = (rawData: any, regex: any, certainValue: any, options: any) => {
    if (!certainValue) {
        return rawData
    }
    if (oType(regex) !== 'object') {
        return rawData
    }
    if (!options) {
        options = {}
    }
    let data
    if (options.clone === 'Y') {
        data = deepClone(rawData)
    } else {
        data = rawData
    }
    const recurHandler = (elem: object, regex: string | RegExp, certainValue: string) => {
        if (oType(elem) !== 'object') {
            return
        }
        const keys = Object.keys(elem)
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const val = (elem as any)[key]
            if (oType(val) === 'string') {
                ;(elem as any)[key] = val.replace(regex, certainValue)
            } else if (oType(val) === 'object') {
                recurHandler(val, regex, certainValue)
            }
        }
    }
    recurHandler(data, regex, certainValue)
    return data
}

/**
 * 遍历对象，供处理函数修改
 * handler 返回 true，代表可以从递归中退出
 * paths: something like [ 'body', '0' ]
 * */
export const iterateObjectHandler = function itrObj(
    obj: any,
    handler: (obj: any, paths: string[]) => boolean,
    paths: string[] = []
) {
    if (oType(handler) !== 'function') {
        return
    }
    if (['object'].indexOf(oType(obj)) > -1 && !(obj instanceof Date)) {
        const flag = handler(obj, paths)
        if (flag) {
            return
        }
    } else if (['object'].indexOf(oType(obj)) < 0 || obj instanceof Date) {
        return
    }
    const keys = Object.keys(obj)
    for (const key of keys) {
        const copypaths = deepClone(paths) as string[]
        copypaths.push(key)
        obj[key] = itrObj(obj[key], handler, copypaths)
    }
    return obj
}

/**
 * 遍历对象，供处理函数修改
 * iterateObjectHandler(obj, handler)
 * */
export const iterateObjectHandler2 = function itrObj(
    obj: any,
    handler: (obj: any, paths: unknown[]) => unknown,
    paths: string[] = []
) {
    if (oType(handler) !== 'function') {
        return
    }
    if (['object'].indexOf(oType(obj)) < 0 || obj instanceof Date) {
        return handler(obj, paths)
    }
    const keys = Object.keys(obj)
    for (const key of keys) {
        const copypaths = deepClone(paths) as string[]
        copypaths.push(key)
        obj[key] = itrObj(obj[key], handler, copypaths)
    }
    return obj
}

/** 比较两个对象的不同之处 */
export const iterateObject4DiffHandler = function itrObj4Dif(
    obj1: any,
    obj2: any,
    customizer: (obj1: any, obj2: any, paths: string[]) => unknown,
    paths: string[] = []
) {
    if (!customizer || !(customizer instanceof Function)) {
        customizer = function (a, b, c) {
            if (_.isEqual(a, b)) {
                return null
            }
            return c
        }
    }
    const otp1 = oType(obj1)
    const otp2 = oType(obj2)
    if (otp1 !== otp2 || otp1 !== 'object') {
        return customizer(obj1, obj2, paths)
    }
    // must: otp1 === otp2 === 'object'
    const result: unknown[] = []
    for (const key in obj1) {
        const subObj1 = obj1[key]
        const subObj2 = obj2[key]
        const subpaths = deepClone(paths) as string[]
        subpaths.push(key)
        const rst = itrObj4Dif(subObj1, subObj2, customizer, subpaths)
        result.push(rst)
    }
    return result.filter(a => {
        const copyA = _.flattenDeep(deepClone(a as unknown[]) as unknown[])
        return !_.isEmpty(copyA)
    })
}

/**
 * 深度克隆；如果提供了转换方法，可以同时转换日期格式，并存入克隆对象
 * */
export const deepClone = function fnDeepClone(
    obj: any,
    options?: {
        oidHandler?: (k: string) => unknown
        dateHandler?: (d: Date) => unknown
        sortHandler?: Record<string, never> | ((a: any, b: any) => number)
    }
): any {
    if (!_.isObject(obj)) {
        return obj
    }
    if (!options) {
        options = {
            oidHandler: undefined,
            dateHandler: undefined
        }
    }
    const { oidHandler, sortHandler } = options
    const result = (typeof (obj as any)['splice'] === 'function' ? [] : {}) as any
    let key
    if (obj && typeof obj === 'object' && !(obj instanceof RegExp)) {
        const keys = Object.keys(obj)
        if (sortHandler instanceof Function) {
            keys.sort(sortHandler)
        } else if (oType(sortHandler) === 'object') {
            keys.sort()
        }
        // for (key in obj) {
        for (key of keys) {
            if (obj.hasOwnProperty(key)) {
                if ((obj as any)[key] && (obj as any)[key] instanceof Date) {
                    if (options.dateHandler && options.dateHandler instanceof Function) {
                        result[key] = options.dateHandler((obj as any)[key])
                    } else {
                        result[key] = new Date((obj as any)[key])
                    }
                } else if ((obj as any)[key] && typeof (obj as any)[key] === 'object') {
                    result[key] = fnDeepClone((obj as any)[key], options) //如果对象的属性值为object的时候，递归调用deepClone，即再把某个值对象复制一份到新的对象的对应值中
                } else {
                    if (key === '_id') {
                        if (_.isFunction(oidHandler)) {
                            result[key] = oidHandler((obj as any)[key])
                            continue
                        }
                    }
                    result[key] = (obj as any)[key] //如果对象的属性值不为object的时候，直接复制参数对象的每一个键/值到新对象对应的键/值中
                }
            }
        }
        return result
    }
    return obj
}

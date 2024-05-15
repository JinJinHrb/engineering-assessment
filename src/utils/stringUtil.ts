/**
 * Created by WangFan on 14/11/10.
 */
import _ from 'lodash'
import pathUtil from 'path'

/**
 * 获取变量o的数据类型
 * 类型	结构
 * Undefined	"undefined"
 * Null  "null" (原始 typeof 为 "object")
 * 布尔值 "boolean"
 * 数值   "number"
 * 字符串 "string"
 * Symbol (ECMAScript 6 新增)	"symbol"
 * 宿主对象(JS环境提供的，比如浏览器)	Implementation-dependent
 * 函数对象 (implements [[Call]] in ECMA-262 terms)	"function"
 * 任何其他对象	"object"
 * */
export const oType = (o: unknown) => {
    return o === null ? 'null' : typeof o
}

/** 根据文件的绝对路径获取文件夹路径 */
export const getFolderByFilePath = (name: string) => {
    const lastSlashIdx = name.lastIndexOf(pathUtil.sep)
    const folderPath = name.slice(0, lastSlashIdx + 1)
    return folderPath
}

/**
 * 调整 mongodb 中的 UTC 时间为本地时间
 * 或者将本地时间调整为 UTC 时间
 * */
export const utcOffset = function (date: any, offset: any) {
    if (!date || !(date instanceof Date) || isNaN(offset)) {
        return date
    }
    const copiedDate = new Date(date.getTime())
    copiedDate.setHours(copiedDate.getHours() + offset)
    return copiedDate
}

/**
 * 调整 mongodb 中的 UTC 时间为本地时间
 * 或者将本地时间调整为 UTC 时间
 * */
export const minutesOffset = function (date: Date, offset: number) {
    if (!date || !(date instanceof Date) || isNaN(offset)) {
        return date
    }
    const copiedDate = new Date(date.getTime())
    copiedDate.setMinutes(copiedDate.getMinutes() + offset)
    return copiedDate
}

/** 过滤非数字字符 */
export const filterNonNumString = function (str: string) {
    const nonRegex = new RegExp('[^\\d]', 'g') // 替换非数字字符
    return str.replace(nonRegex, '')
}

/** 获取某年某月的总长度 */
export const getDaysInOneMonth = function (year: any, month: any) {
    month = parseInt(month, 10)
    const d = new Date(year, month, 0)
    return d.getDate()
}

export const filterJson = function (data: any, map: any) {
    const json = {}
    for (let i = 0; i < map.length; i++) {
        const key = map[i]
        if (data[key] !== undefined) (json as any)[key] = data[key]
        else (json as any)[key] = ''
    }
    return json
}

/** set initial capital for English String */
export const setInitCap = function (str: any) {
    const type = oType(str)
    if (type != 'string' || !str.length) {
        return str
    }
    let init = str.charAt(0)
    init = init.toUpperCase()
    let lower = str.toLowerCase()
    if (lower.length < 2) {
        return init
    }
    lower = lower.substring(1)
    init = init + lower
    return init
}

/** exclude element empty or filtered in an array
 * @param convert: convert format of element in array
 * */
export const trimArray = function (arr: any, filter: any, convert: any) {
    if (!(arr instanceof Array) || arr.length < 1) {
        return arr
    }
    let i, len, elem
    const rtn: string[] = []
    for (i = 0, len = arr.length; i < len; i++) {
        elem = _.trim(arr[i])
        if (elem === '') {
            continue
        }
        if (filter instanceof Function) {
            if (!filter(elem)) {
                continue
            }
        }
        if (convert instanceof Function) {
            elem = convert(elem)
        }
        rtn.push(elem)
    }
    return rtn
}

export const removeDuplicateInArray = function (passportArr: string[]) {
    if (!passportArr || passportArr.length == 0) {
        return []
    }
    const passportObj = {}
    passportArr.forEach(function (pptElem) {
        pptElem = _.trim(pptElem)
        ;(passportObj as any)[pptElem] = true
    })
    passportArr = Object.keys(passportObj)
    return passportArr
}

/**
 * 获取夹在 from-to 之间的字符串
 * @param array 输出数组
 * */
export const getMultiSubString = (array: string[], src: string, from: string, to: string) => {
    let start = src.indexOf(from)
    if (!~start) {
        return
    }
    start += from.length + 1
    let end = src.indexOf(to, start)
    if (!~end) {
        return
    }
    const middle = _.trim(src.substring(start, end))
    array.push(middle)
    end += to.length + 1
    const nextSrc = src.substring(end)
    getMultiSubString(array, nextSrc, from, to)
}

/*
 * param str 要截取的字符串
 * param L 要截取的字节长度，注意是字节不是字符，一个汉字两个字节
 * return 截取后的字符串
 */
export const cutStr = (str: string, L: number) => {
    let result = ''
    const strlen = str.length, // 字符串长度
        // eslint-disable-next-line no-control-regex
        chrlen = str.replace(/[^\x00-\xff]/g, '**').length // 字节长度

    if (chrlen <= L) {
        return str
    }

    for (let i = 0, j = 0; i < strlen; i++) {
        const chr = str.charAt(i)
        // eslint-disable-next-line no-control-regex
        if (/[\x00-\xff]/.test(chr)) {
            j++ // ascii码为0-255，一个字符就是一个字节的长度
        } else {
            j += 2 // ascii码为0-255以外，一个字符就是两个字节的长度
        }
        if (j <= L) {
            // 当加上当前字符以后，如果总字节长度小于等于L，则将当前字符真实的+在result后
            result += chr
        } else {
            // 反之则说明result已经是不拆分字符的情况下最接近L的值了，直接返回
            return result
        }
    }
}

/**
 * @returns 字符半角长度
 */
export const getAlphabetLength = (str: string) => {
    if (!str) {
        return 0
    }
    // eslint-disable-next-line no-control-regex
    const chrlen = str.replace(/[^\x00-\xff]/g, '**').length
    return chrlen
}

export const stringToInt = function (str: any, defaultVal: any) {
    if (oType(defaultVal) !== 'number') {
        defaultVal = -1
    }
    let limitNum = str
    if (oType(limitNum) === 'string' && _.trim(limitNum) !== '') {
        limitNum = limitNum.replace(/,/g, '')
        limitNum = _.trim(limitNum)
        limitNum = parseInt(limitNum)
        if (isNaN(limitNum)) {
            limitNum = defaultVal
        }
        return limitNum
    } else if (oType(limitNum) === 'number') {
        return limitNum
    }
    return defaultVal
}

export const stringToFloat = function (str: any, defaultVal: any) {
    if (oType(defaultVal) !== 'number') {
        defaultVal = -1
    }
    let limitNum = str
    if (oType(limitNum) === 'string' && _.trim(limitNum) !== '') {
        limitNum = limitNum.replace(/,/g, '')
        limitNum = _.trim(limitNum)
        limitNum = parseFloat(limitNum)
        if (isNaN(limitNum)) {
            limitNum = defaultVal
        }
        return limitNum
    } else if (oType(limitNum) === 'number') {
        return limitNum
    }
    return defaultVal
}

/** 将数组转化为特殊字符 ch 分隔的 自转义字符串 */
export const escapeWithCustomizer = (arr: string[], ch: string) => {
    const escapeChars = ['^', '$']
    if (!arr || arr.length < 1 || oType(ch) !== 'string' || ch.length !== 1) {
        return ''
    }
    const arr2 = arr.map(a => {
        let b = ''
        if (oType(a) === 'object') {
            b = JSON.stringify(a)
        } else if (oType(a) !== 'string') {
            b = String(a)
        } else {
            b = a
        }
        const regex = new RegExp(escape4RegExp(ch), 'g')
        let c = b.replace(regex, `${ch}${ch}`)
        escapeChars.forEach(esch => {
            const regex = new RegExp(escape4RegExp(esch), 'g')
            c = c.replace(regex, `${ch}${esch}`)
        })
        if (!c) {
            c = ' ' // 不能出现空字符串
        }
        return c
    })
    const str = arr2.join(ch)
    return `^${str}$`
}

/**
 * escapeWithCustomizer 逆方法
 * */
export const unescapeCustomizer = function (this: any, str: string, ch: string) {
    const splitEscapeCustomizer = function (this: any, str: string, ch: string, stage?: number) {
        const escapeChars = ['^', '$']
        if (!str || oType(ch) !== 'string' || ch.length !== 1) {
            return []
        }
        const pushSubArr = function (this: any, i: any, ch: any) {
            while (this.length < i + 1) {
                this.push([])
            }
            this[i].push(ch)
        }
        const arr: string[][] = []
        for (let i = 0, j = 0; i < str.length; i++) {
            const ich = str.charAt(i)
            if (stage === 2) {
                if (ich !== ch && escapeChars.indexOf(ich) < 0) {
                    pushSubArr.call(arr, j, ich)
                    continue
                }
            } else {
                if (ich !== ch) {
                    /* && escapeChars.indexOf(ich) < 0 */
                    pushSubArr.call(arr, j, ich)
                    continue
                }
            }
            if (i === str.length - 1) {
                break
            } else {
                if (stage === 2) {
                    const escapeCharIdx = escapeChars.indexOf(ich)
                    if (escapeCharIdx > -1) {
                        if (arr.length > 0) {
                            j++
                        }
                        continue
                    }
                    const i2ch = str.charAt(i + 1)
                    const escapeChar2Idx = escapeChars.indexOf(i2ch)
                    if (escapeChar2Idx > -1) {
                        pushSubArr.call(arr, j, i2ch)
                        i++
                    } else {
                        pushSubArr.call(arr, j, ch)
                    }
                    continue
                } else {
                    const i2ch = str.charAt(i + 1)
                    const escapeChar2Idx = escapeChars.indexOf(i2ch)
                    if (i2ch === ch || escapeChar2Idx > -1) {
                        if (i2ch === ch) {
                            pushSubArr.call(arr, j, ch)
                        } else {
                            pushSubArr.call(arr, j, `${ch}${i2ch}`)
                        }
                        i++
                        continue
                    } else {
                        j++
                    }
                }
            }
        }
        return arr.map(a => a.join(''))
    }

    const arr1 = splitEscapeCustomizer(str, ch)
    const arr2 = _.flatten(arr1.map(a => splitEscapeCustomizer(a, ch, 2))).filter(a => a)
    return arr2
}

export const escape4RegExp = function (str: string) {
    const hdlEscapeArray = {
        '*': 1,
        '.': 1,
        '?': 1,
        '+': 1,
        $: 1,
        '^': 1,
        '[': 1,
        ']': 1,
        '(': 1,
        ')': 1,
        '{': 1,
        '}': 1,
        '|': 1,
        '\\': 1,
        '/': 1
    } as any

    if (_.trim(str) === '') {
        return ''
    }
    const _len = str.length,
        _rtnStrArray: string[] = []
    let _chr: any, _preChr: any
    _chr = _preChr = null
    for (let i = 0; i < _len; i++) {
        if (_chr) {
            _preChr = _chr
        }
        _chr = str[i]
        if (!!hdlEscapeArray[_chr] && _.trim(_preChr) != '\\') {
            _rtnStrArray.push('\\' + _chr)
        } else {
            _rtnStrArray.push(_chr)
        }
    }
    return _rtnStrArray.join('')
}

export const escapeBackSlash = function (str: string) {
    if (_.trim(str) === '') {
        return ''
    }
    const _len = str.length,
        _rtnStrArray: string[] = []
    let _chr
    for (let i = 0; i < _len; i++) {
        _chr = str[i]
        if (_.trim(_chr) === '\\') {
            _rtnStrArray.push('\\' + _chr)
        } else {
            _rtnStrArray.push(_chr)
        }
    }
    return _rtnStrArray.join('')
}

export const extractImgSrc = function (str: string) {
    if (_.trim(str) === '') {
        return null
    }
    const regex = /<img[^<]+[(/>)$]/i,
        _imgStr = str.match(regex)
    //        console.log('imgStr', _imgStr);
    if (!_imgStr || !_imgStr[0]) {
        return null
    }
    const regex2 = /src="[^"]+[(")$]/i
    const _imgStr2 = _imgStr[0].match(regex2)
    let _imgSrc = ''
    //        console.log('imgStr2', _imgStr2);
    if (!!_imgStr2 && !!_imgStr2[0]) {
        const _len = _imgStr2[0].length
        _imgSrc = _imgStr2[0].substring(5, _len - 1)
    }
    //        console.log('imgSrc', _imgSrc);
    return _imgSrc
}

/**
 * 获取字符串中中文字符的位置
 * @param startIdx optional
 * */
export const indexOfChn = function (str: any, startIdx: any) {
    const str2 = oType(startIdx) === 'number' && startIdx > 0 ? str.slice(startIdx) : str
    const matchResult = str2.match(/[\u4e00-\u9fa5]/)?.[0]
    const nextChnCharIdx = matchResult ? str.indexOf(matchResult, startIdx) : -1
    return nextChnCharIdx
}

/**
 * 获取正则表达式对应索引
 * e.g. hdlUtil.regexIndexOf(theProductName, /\d+(分钟|小时|工|日)/)
 */
export const regexIndexOf = function (str: string, regex: RegExp, startpos?: number) {
    const indexOf = _.trim(str)
        .slice(startpos ?? 0)
        .search(regex)
    return indexOf >= 0 ? indexOf + (startpos || 0) : indexOf
}

/**
 * 获取正则表达式对应最后一个索引
 * e.g. hdlUtil.regexLastIndexOf(theProductName, /\d+(分钟|小时|工|日)/)
 * */
export const regexLastIndexOf = function (str: string, regex: RegExp, startpos: number) {
    regex = regex.global
        ? regex
        : new RegExp(regex.source, 'g' + (regex.ignoreCase ? 'i' : '') + (regex.multiline ? 'm' : ''))
    if (typeof startpos === 'undefined') {
        startpos = _.trim(str).length
    } else if (startpos < 0) {
        startpos = 0
    }
    const stringToWorkWith = _.trim(str).slice(0, startpos + 1)
    let lastIndexOf = -1,
        nextStop = 0,
        result: RegExpExecArray | null
    while ((result = regex.exec(stringToWorkWith)) != null) {
        lastIndexOf = result.index
        regex.lastIndex = ++nextStop
    }
    return lastIndexOf
}

/** 将长度大于等于17位的数字变为字符串再转 JSON */
export const parseJsonWithNumber2String = (str: string) => {
    if (!str) {
        // str = "{\"buyer_nick\":\"骸pk云雀\",\"biz_type\":2,\"gmt_created\":\"2019-04-27 15:12:56\",\"seller_id\":3471466586,\"gmt_modified\":\"2019-04-29 23:13:08\",\"item_infos\":\"124770001:565150005922::019001002免机酒3工\",\"order_id\":424892353752564070,\"seller_nick\":\"上海星共国际旅行社专营店\",\"order_status\":4}";
        return null
    }
    let rtn = str
    const regexArr = [new RegExp(':\\d{17,}(,|\\})', 'g'), new RegExp(':\\d+\\.\\d+(,|\\})', 'g')]
    for (let j = 0; j < regexArr.length; j++) {
        const regex = regexArr[j]
        const matches = str.match(regex)
        const matchArr = matches ? Array.prototype.slice.call(matches) : []
        for (let i = 0; i < matchArr.length; i++) {
            const sourceStr = _.trim(matchArr[i])
            let targetStr = sourceStr.replace(':', ':"')
            const tgtStrlen = targetStr.length,
                lastChar = targetStr.slice(-1),
                last2Char = targetStr.slice(-2, -1)
            if (tgtStrlen > 2) {
                if (!/\\d/.test(lastChar) && last2Char !== '"') {
                    targetStr = targetStr.slice(0, -1) + '"' + lastChar
                    // console.log('sourceStr:', sourceStr, 'targetStr:', targetStr, 'j:', j)
                    rtn = rtn.replace(sourceStr, targetStr)
                }
            }
        }
    }
    // console.log(rtn)
    let obj = null
    try {
        obj = JSON.parse(rtn)
    } catch (e) {
        try {
            obj = JSON.parse(str)
        } catch (e1) {
            console.error('util #827 ERROR', e1, '|', str)
        }
    }
    // console.log('parseJsonWithNumber2String ->', obj);
    return obj
}

export const stripHtmlTags = function (str: any) {
    if (oType(str) !== 'string') {
        return String(str)
    }
    return str.replace(/<\/?[^>]+(>|$)/g, '')
}

export const getHashCode = function (str: string) {
    let hash = 0
    if (str.length === 0) return hash
    for (let i = 0; i < str.length; i++) {
        const chr = str.charCodeAt(i)
        hash = (hash << 5) - hash + chr
        hash |= 0 // Convert to 32bit integer
    }
    return hash
}

/**
 * 将 ${var} 以外的部分分割为数组
 * varObj 替换 ${var} 中的内容
 */
export const splitDollarVarTemplate = (template: any, varObj: any = {}) => {
    const shrinks: number[] = []
    for (let i = 0, head = -1, tail = -1; i < template.length; i++) {
        if (
            head < 0 &&
            tail < 0 &&
            template.length - i > 2 &&
            template.charAt(i) === '$' &&
            template.charAt(i + 1) === '{'
        ) {
            head = i
        } else if (head > -1 && tail < 0 && template.charAt(i) === '}') {
            tail = i
            shrinks.push(head, tail)
            head = tail = -1
        }
    }
    const tempArr: string[] = []
    for (let i = 0, j = 0, subArr: string[] = []; i < template.length; i++) {
        if (j % 2 === 0 && i !== shrinks[j]) {
            subArr.push(template[i])
        } else if (j % 2 === 0 && i === shrinks[j]) {
            if (j + 1 < shrinks.length) {
                const varIdx1 = shrinks[j] + 2
                const varIdx2 = shrinks[j + 1]
                if (varIdx1 < varIdx2) {
                    const varKey = template.slice(varIdx1, varIdx2)
                    const valVal = _.trim(varObj[varKey])
                    if (valVal) {
                        subArr.push(valVal)
                    }
                    // console.log('#1701', varKey, '->', valVal);
                }
            }
            tempArr.push(subArr.join(''))
            j++
            subArr = []
        } else if (j % 2 !== 0 && i === shrinks[j]) {
            j++
        }
    }
    if (shrinks.length > 0 && template.length - shrinks.slice(-1)[0] > 1) {
        tempArr.push(template.substring(shrinks.slice(-1)[0] + 1))
    }
    if (tempArr.length < 1) {
        return [template]
    }
    return tempArr.filter(s => {
        return s
    })
}

export const iterateSplitHtmlTagTemplate = function iSplitHtmlTagTemplate(str: string, tag: string, results: string[]) {
    const arr = splitHtmlTagTemplate(str, tag)
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].indexOf('</' + tag + '>') > -1) {
            iSplitHtmlTagTemplate(arr[i], tag, results)
        } else {
            results.push(arr[i])
        }
    }
}

/** 将 <p> ... </p> 以内的部分分割为数组 */
export const splitHtmlTagTemplate = (template: string, tag: string) => {
    const startTag = '<' + tag + '>'
    const startTag2 = '<' + tag + ' '
    const endTag = '</' + tag + '>'
    const shrinks: string[] = []
    for (let i = 0, head = -1, tail = -1, nestedTag = 0; i < template.length; i++) {
        if (template.length - i > 2 && template.slice(i, i + startTag.length) === startTag) {
            if (head < 0 && tail < 0) {
                head = i + startTag.length
            } else if (head > 0 && tail < 0) {
                nestedTag++
            }
            i += startTag.length - 1
        } else if (template.length - i > 2 && template.slice(i, i + startTag2.length) === startTag2) {
            const firstLeftBracket = template.indexOf('>', i + startTag2.length)
            if (head < 0 && tail < 0) {
                head = firstLeftBracket + 1
                // head = i + startTag2.length;
            } else if (head > 0 && tail < 0) {
                nestedTag++
            }
            i += startTag2.length - 1
        } else if (head > -1 && tail < 0 && template.slice(i, i + endTag.length) === endTag) {
            if (nestedTag > 0) {
                nestedTag--
            } else {
                nestedTag = 0
                tail = i
                // shrinks.push(head, tail);
                shrinks.push(template.slice(head, tail))
                head = tail = -1
            }
            i += endTag.length - 1
        }
    }
    return shrinks
}

export const removeHtmlComment = (html: string) => {
    return html.replace(/<!--[\s\S]*?-->/g, '')
}

/** 读取 cookie 中的 random_refund */
export const parseCookies = (cookie: string) => {
    return cookie.split(';').reduce(function (prev: any, curr: any) {
        const m = / *([^=]+)=(.*)/.exec(curr)
        if (!m) {
            return prev
        }
        const key = m[1]
        const value = decodeURIComponent(m[2])
        prev[key] = value
        return prev
    }, {})
}

/** 判断字符串是否包含关键字列表中的某一项 */
export const hasKeyWords = (str: string, arr: string[]) => {
    if (!str) {
        return ''
    }
    if (!(arr instanceof Array)) {
        return ''
    }
    arr = arr.filter(a => oType(a) === 'string')
    if (arr.length < 1) {
        return ''
    }
    for (let i = 0; i < arr.length; i++) {
        const keyWord = arr[i]
        if (str.indexOf(keyWord) > -1) {
            return keyWord
        }
    }
    return ''
}

export const encodeUnicode = (str: string) => {
    const res: string[] = []
    for (let i = 0; i < str.length; i++) {
        res.push(('00' + str.charCodeAt(i).toString(16)).slice(-4))
    }
    return '\\u' + res.join('\\u')
}

export const decodeUnicode = (str: any) => {
    str = str.replace(/\\/g, '%')
    return decodeURIComponent(str)
}

export interface IStringDifference {
    cursor: number
    offset: number
    diff: string
}

/** 获取两个字符串的差异部分 */
export const getStringDifference = function (a: string, b: string) {
    if (a.length < b.length) {
        const tmp = a
        a = b
        b = tmp
    }
    const arrA = a.split('')
    const arrB = b.split('')
    const cursorArr: IStringDifference[] = []
    let cursor = -1
    let offset = 0
    let offset2 = 0
    for (let i = 0; i < arrA.length; i++) {
        const strA = arrA[i]
        const strB = arrB[i - offset]
        if (strA !== strB) {
            if (cursor < 0) {
                cursor = i
            } else {
                offset++
                offset2++
            }
        } else if (cursor > -1) {
            const diff = a.slice(cursor, cursor + offset2)
            cursorArr.push({ cursor, offset, diff })
            cursor = -1
            offset2 = 0
        }
    }
    return cursorArr
}

import { logError, isNumber, isString, isElement } from './utils'

function typeJudgment (matrix:any[], ...args:number[]) {
  if (!Array.isArray(matrix)) logError('Matrix', `[ Matrix array ] must be a "array", but now is [ ${matrix} ]`, true)
  if (matrix.length < 7) {
		logError(
				'Matrix',
				`[ Matrix array ] must be a "matrix 3d array", but the current [ matrix length ] is less than 7, you can use "getElmentMatrix" method get matrix 3d array`,
				true,
		)
	}

  for (const arg of args) {
    if (!isNumber(arg)) {
      logError('Matrix', `[ ${arg} ] must be a "number" and must be "0" or "1", but now is [ ${typeof arg} ]`, true)
    }
  }
}

export function getElmentMatrix (el?:HTMLElement) {
	const initMatrix = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)'
	if (!el) return initMatrix

  let matrix = <any>getComputedStyle(el).transform
  matrix === 'none' && (matrix = initMatrix)
	// 后行断言 es6 才有
	// matrix = matrix.match(/(?<=\w+\()[^\)]+/g)[0].split(',').map(v => Number(v))
	matrix = (<any>/(\w+\()([^\)]+)/g.exec(matrix))[2].split(',').map(v => Number(v))
	// 2d和3d的兼容处理
	if(matrix.length < 7) {
		matrix = [matrix[0], matrix[1], 0, 0, matrix[2], matrix[3], 0, 0, 0, 0, 1, 0, matrix[4], matrix[5], 0, 1]
	}

	return matrix
}

export function createElementMatrix (arr:number[]) {
  typeJudgment(arr)
	let newMatrix = 'matrix3d('
	for (let i = 0; i < arr.length; i++) {
		newMatrix += i != arr.length - 1
			? arr[i] + ','
			: arr[i]
	}
	return newMatrix += ')'
}

export function rotate3d (matrix:any[], x:number, y:number, z:number, deg:number) {
	typeJudgment(matrix, x, y, z, deg)

	const agl = Math.PI * deg / 180
	const numSqrt = Math.sqrt(x * x + y * y + z * z)
	const cos = Math.cos(agl)
	const sin = Math.sin(agl)
	const ux = x / numSqrt
	const uy = y / numSqrt
  const uz = z / numSqrt
  const negative = 1 - cos

	const r0 = ux * ux * negative + cos,
				r1 = ux * uy * negative + uz * sin,
				r2 = ux * uz * negative - uy * sin,
				r4 = ux * uy * negative - uz * sin,
				r5 = uy * uy * negative + cos,
				r6 = uz * uy * negative + ux * sin,
				r8 = ux * uz * negative + uy * sin,
				r9 = uy * uz * negative - ux * sin,
				r10 = uz * uz * negative + cos

	const d0 = matrix[0] * r0 + matrix[4] * r1 + matrix[8] * r2,
				d1 = matrix[1] * r0 + matrix[5] * r1 + matrix[9] * r2,
				d2 = matrix[2] * r0 + matrix[6] * r1 + matrix[10] * r2,
				d3 = matrix[3] * r0 + matrix[7] * r1 + matrix[11] * r2,
				d4 = matrix[0] * r4 + matrix[4] * r5 + matrix[8] * r6,
				d5 = matrix[1] * r4 + matrix[5] * r5 + matrix[9] * r6,
				d6 = matrix[2] * r4 + matrix[6] * r5 + matrix[10] * r6,
				d7 = matrix[3] * r4 + matrix[7] * r5 + matrix[11] * r6,
				d8 = matrix[0] * r8 + matrix[4] * r9 + matrix[8] * r10,
				d9 = matrix[1] * r8 + matrix[5] * r9 + matrix[9] * r10,
				d10 = matrix[2] * r8 + matrix[6] * r9 + matrix[10] * r10,
				d11 = matrix[3] * r8 + matrix[7] * r9 + matrix[11] * r10

  return [d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, matrix[12], matrix[13], matrix[14], matrix[15]]
}

export function rotateX (matrix, deg) {
	return rotate3d(matrix, 1, 0, 0, deg)
}
export function rotateY (matrix, deg) {
	return rotate3d(matrix, 0, 1, 0, deg)
}
export function rotateZ (matrix, deg) {
	return rotate3d(matrix, 0, 0, 1, deg)
}
export function rotate (matrix, deg) {
	return rotate3d(matrix, 0, 0, 1, deg)
}

export function translate3d (matrix, x, y, z) {
	typeJudgment(matrix, x, y, z)

	const c12 = x * matrix[0] + y * matrix[4] + z * matrix[8] + matrix[12],
				c13 = x * matrix[1] + y * matrix[5] + z * matrix[9] + matrix[13],
				c14 = x * matrix[2] + y * matrix[6] + z * matrix[10] + matrix[14],
				c15 = x * matrix[3] + y * matrix[7] + z * matrix[11] + matrix[15]

	return [matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5], matrix[6], matrix[7], matrix[8], matrix[9], matrix[10], matrix[11], c12, c13, c14, c15]
}
export function translateX (matrix, x) {
	return translate3d(matrix, x, 0, 0)
}
export function translateY (matrix, y) {
	return translate3d(matrix, 0, y, 0)
}
export function translateZ (matrix, z) {
	return translate3d(matrix, 0, 0, z)
}
export function translate (matrix, x, y) {
	return translate3d(matrix, x, y, 0)
}

export function scale3d (matrix, x, y, z) {
	typeJudgment(matrix, x, y, z)

	const s0 = matrix[0] * x, s4 = matrix[4] * y, s8 = matrix[8] * z,
				s1 = matrix[1] * x, s5 = matrix[5] * y, s9 = matrix[9] * z,
				s2 = matrix[2] * x,	s6 = matrix[6] * y, s10 = matrix[10] * z,
				s3 = matrix[3] * x, s7 = matrix[7] * y, s11 = matrix[11] * z

	return [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, matrix[12], matrix[13], matrix[14], matrix[15]]
}

export function scaleX (matrix, x) {
	return scale3d(matrix, x, 1, 1)
}
export function scaleY (matrix, y) {
	return scale3d(matrix, 1, y, 1)
}
export function scaleZ (matrix, z) {
	return scale3d(matrix, 1, 1, z)
}
export function scale (matrix, x, y) {
	return scale3d(matrix, x, y, 1)
}

export function skew (matrix, x, y) {
	typeJudgment(matrix, x, y)

	const	xtan = Math.tan(Math.PI * x / 180)
	const	ytan = Math.tan(Math.PI * y / 180)

	const f0 = matrix[0] + matrix[4] * ytan,
				f1 = matrix[1] + matrix[5] * ytan,
				f2 = matrix[2] + matrix[6] * ytan,
				f3 = matrix[3] + matrix[7] * ytan,
				f4 = matrix[0] * xtan + matrix[4],
				f5 = matrix[1] * xtan + matrix[5],
				f6 = matrix[2] * xtan + matrix[6],
				f7 = matrix[3] * xtan + matrix[7]

	return [f0, f1, f2, f3, f4, f5, f6, f7, matrix[8], matrix[9], matrix[10], matrix[11], matrix[12], matrix[13], matrix[14], matrix[15]]
}
export function skewX (matrix, x) {
	return skew(matrix, x, 0)
}
export function skewY (matrix, y) {
	return skew(matrix, 0, y)
}

export function getAttrTransforms (str:HTMLElement | string) {
	if (!str) return []
	if (!isElement(str) && !isString(str)) {
		logError('Matrix', `[ ${str} ] must be "HTMLElement" or "string"`, true)
	}

	!isString(str) && (str = (<HTMLElement>str).outerHTML.replace((<HTMLElement>str).innerHTML, ''))
	const reg = /(['"\s])(\w+\([^)]+\))/g
	const match:string[] = []
  let res

  while (res = reg.exec(<string>str)) {
    match.push(res[2])
  }

  return match
}

export function mergeTransforms (arr:string[]) {
	if (!Array.isArray(arr)) logError('Matrix', `[ arr ] must be a "array", but now is ${typeof arr}`, true)

	return arr.join(' ')
}

export function setSvgTransform (element:HTMLElement, attrs:string[] | string) {
	if (!element || !element.nodeType || element.nodeType !== 1) {
		logError('Matrix', `[ element ] must be a "HTMLElement", but now is [ ${
			<any>element === document
				? 'document'
				: typeof element
		} ]`, true)
	}

	let originTransforms = getAttrTransforms(element)

	Array.isArray(attrs)
		? (originTransforms = originTransforms.concat(attrs))
		: originTransforms.push(attrs)

	element.setAttribute('transform', originTransforms.join(' '))
}

class MatrixElement {
	private element: HTMLElement
	private matrixArr: number[]

	public constructor (element:HTMLElement) {
		this.element = element
		this.matrixArr = getElmentMatrix(element)
	}

	public rotate3d (x:number, y:number, z:number, deg:number) : MatrixElement {
		this.matrixArr = rotate3d(this.matrixArr, x, y, z, deg)
		this.element.style.transform = createElementMatrix(this.matrixArr)

		return this
	}

	public rotate (deg:number) : MatrixElement {
		this.matrixArr = rotate3d(this.matrixArr, 0, 0, 1, deg)
		this.element.style.transform = createElementMatrix(this.matrixArr)

		return this
	}

	public rotateX (deg:number) : MatrixElement {
		this.matrixArr = rotate3d(this.matrixArr, 1, 0, 0, deg)
		this.element.style.transform = createElementMatrix(this.matrixArr)

		return this
	}

	public rotateY (deg:number) : MatrixElement {
		this.matrixArr = rotate3d(this.matrixArr, 0, 1, 0, deg)
		this.element.style.transform = createElementMatrix(this.matrixArr)

		return this
	}

	public rotateZ (deg:number) : MatrixElement {
		this.matrixArr = rotate3d(this.matrixArr, 0, 0, 1, deg)
		this.element.style.transform = createElementMatrix(this.matrixArr)

		return this
	}

	public translate3d (x:number, y:number, z:number) : MatrixElement {
		this.matrixArr = translate3d(this.matrixArr, x, y, z)
		this.element.style.transform = createElementMatrix(this.matrixArr)

		return this
	}

	public translate (x:number, y:number) : MatrixElement {
		this.matrixArr = translate3d(this.matrixArr, x, y, 0)
		this.element.style.transform = createElementMatrix(this.matrixArr)

		return this
	}

	public translateX (x:number) : MatrixElement {
		this.matrixArr = translate3d(this.matrixArr, x, 0, 0)
		this.element.style.transform = createElementMatrix(this.matrixArr)

		return this
	}

	public translateY (y:number) : MatrixElement {
		this.matrixArr = translate3d(this.matrixArr, 0, y, 0)
		this.element.style.transform = createElementMatrix(this.matrixArr)

		return this
	}

	public translateZ (z:number) : MatrixElement {
		this.matrixArr = translate3d(this.matrixArr, 0, 0, z)
		this.element.style.transform = createElementMatrix(this.matrixArr)

		return this
	}

	public scale3d (x:number, y:number, z:number) : MatrixElement {
		this.matrixArr = scale3d(this.matrixArr, x, y, z)
		this.element.style.transform = createElementMatrix(this.matrixArr)

		return this
	}

	public scale (x:number, y:number) : MatrixElement {
		this.matrixArr = scale3d(this.matrixArr, x, y, 1)
		this.element.style.transform = createElementMatrix(this.matrixArr)

		return this
	}

	public scaleX (x:number) : MatrixElement {
		this.matrixArr = scale3d(this.matrixArr, x, 1, 1)
		this.element.style.transform = createElementMatrix(this.matrixArr)

		return this
	}

	public scaleY (y:number) : MatrixElement {
		this.matrixArr = scale3d(this.matrixArr, 1, y, 1)
		this.element.style.transform = createElementMatrix(this.matrixArr)

		return this
	}

	public scaleZ (z:number) : MatrixElement {
		this.matrixArr = scale3d(this.matrixArr, 1, 1, z)
		this.element.style.transform = createElementMatrix(this.matrixArr)

		return this
	}

	// 'skew,skewX,skewY'
	public skew (x:number, y:number) : MatrixElement {
		this.matrixArr = skew(this.matrixArr, x, y)
		this.element.style.transform = createElementMatrix(this.matrixArr)

		return this
	}

	public skewX (x:number) : MatrixElement {
		this.matrixArr = skew(this.matrixArr, x, 0)
		this.element.style.transform = createElementMatrix(this.matrixArr)

		return this
	}

	public skewY (y:number) : MatrixElement {
		this.matrixArr = skew(this.matrixArr, 0, y)
		this.element.style.transform = createElementMatrix(this.matrixArr)

		return this
	}
}

export function element (element:HTMLElement) : any {
	if (!element || !element.nodeType || element.nodeType !== 1) {
		logError('Matrix', `[ element ] must be a "HTMLElement", but now is [ ${
			<any>element === document
				? 'document'
				: typeof element
		} ]`, true)
	}

	return new MatrixElement(element)
}
/**
* @author       Adam Kucharik
* @copyright    2016-present, Adam Kucharik, All rights reserved.
* @license      https://github.com/akucharik/oculo/blob/master/LICENSE.md
*/

'use strict';

import isArrayLike from 'lodash/isArrayLike';

/**
* Create 2x2 matrix from a series of values.
* 
* Represented like:
* 
* | e11 | e12 |
* | e21 | e22 |
*
* @class Oculo.Matrix2
* @constructor
* @param {number} e11=1 - The value of row 1, column 1
* @param {number} e12=0 - The value of row 1, column 2
* @param {number} e21=0 - The value of row 2, column 1
* @param {number} e22=1 - The value of row 2, column 2
*/
class Matrix2 {
    constructor (e11, e12, e21, e22) {
        /**
        * @property {number} e11
        * @default
        */
        this.e11 = 1;
        
        /**
        * @property {number} e12
        * @default
        */
        this.e12 = 0;
        
        /**
        * @property {number} e21
        * @default
        */
        this.e21 = 0;
        
        /**
        * @property {number} e22
        * @default
        */
        this.e22 = 1;
        
        if (arguments.length === 4) {
            this.set(e11, e12, e21, e22);
        }
        else if (isArrayLike(e11) && e11.length === 4) {
            this.setFromArray(e11);
        }
    }
    
    /**
    * Clones the matrix.
    * {Matrix2} m - The matrix to clone.
    * @return {Matrix2} A new identical matrix.
    */
    static clone (m) {
        return new Matrix2(Matrix2.toArray(m));
    }
    
    /**
    * Clones the matrix.
    * @return {Matrix2} A new identical matrix.
    */
    clone () {
        return this.constructor.clone(this);
    }
    
    /**
    * Copies the values from the provided matrix into this matrix.
    * {Matrix2} m - The matrix to copy.
    * @return {this} self
    */
    copy (m) {
        return this.set(m.e11, m.e12, m.e21, m.e22);
    }
    
    /**
    * Gets the determinant.
    * {Matrix2} m - The matrix to get the determinant.
    * @return {number} The determinant.
    */
    static getDeterminant (m) {
        return m.e11 * m.e22 - m.e12 * m.e21;
    }
    
    /**
    * Gets the determinant.
    * @return {number} The determinant.
    */
    getDeterminant () {
        return this.constructor.getDeterminant(this);
    }
    
    /**
    * Gets the inverse.
    * {Matrix2} m - The matrix to get the inverse.
    * @return {Matrix2} The inverse matrix.
    */
    static getInverse (m) {
        return Matrix2.multiplyScalar(new Matrix2(m.e22, -m.e12, -m.e21, m.e11), 1 / Matrix2.getDeterminant(m));
    }
    
    /**
    * Gets the inverse.
    * @return {Matrix2} The inverse matrix.
    */
    getInverse () {
        return this.constructor.getInverse(this);
    }
    
    /**
    * Multiplies two matrices.
    * @param {Matrix2} a - A matrix.
    * @param {Matrix2} b - Another matrix.
    * @return {Matrix2} A new matrix that is the product of the provided matrices.
    *//**
    * Multiplies a list of matrices.
    * @param {Array} m - A list of matrices.
    * @return {Matrix2} A new matrix that is the product of the provided matrices.
    */
    static multiplyMatrices (a, b) {
        if (a.cols === b.rows) {
            let n11, n12, n21, n22;
         
            n11 = a.e11 * b.e11 + a.e12 * b.e21;
            n12 = a.e11 * b.e12 + a.e12 * b.e22;
            n21 = a.e21 * b.e11 + a.e22 * b.e21;
            n22 = a.e21 * b.e12 + a.e22 * b.e22;
        
            return new Matrix2(n11, n12, n21, n22);
        }
        else {
            throw new Error('Cannot multiply incompatible matrices');
        }
    }
    
    /**
    * Multiplies the matrix by another matrix.
    * @param {Matrix2|Matrix2D} m - A matrix.
    * @return {this} self
    */
    multiplyMatrices (m) {
        if (this.cols === m.rows) {
            let n11, n12, n21, n22;
            
            n11 = this.e11 * m.e11 + this.e12 * m.e21;
            n12 = this.e11 * m.e12 + this.e12 * m.e22;
            n21 = this.e21 * m.e11 + this.e22 * m.e21;
            n22 = this.e21 * m.e12 + this.e22 * m.e22;
            
            this.set(n11, n12, n21, n22);
        }
        else {
            throw new Error('Cannot multiply incompatible matrices');
        }
        
        return this;
    }
    
    /**
    * Multiplies a matrix by a scalar.
    * @param {Matrix2} m - The matrix.
    * @param {number} s - The scalar.
    * @return {Matrix2} A new scaled matrix.
    */
    static multiplyScalar (m, s) {
        var e11 = m.e11 * s;
        var e12 = m.e12 * s;
        var e21 = m.e21 * s;
        var e22 = m.e22 * s;

        return new Matrix2(e11, e12, e21, e22);
    }
    
    /**
    * Multiplies the matrix by a scalar.
    * @param {number} s - The scalar.
    * @return {this} self
    */
    multiplyScalar (s) {
        this.e11 *= s;
        this.e12 *= s;
        this.e21 *= s;
        this.e22 *= s;

        return this;
    }
    
    /**
    * Applies a rotation to a matrix.
    * @param {Matrix2} m - The matrix.
    * @param {number} angle - The angle in radians.
    * @return {Matrix2} A new rotated matrix.
    */
    static rotate (m, angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var rotationMatrix = new Matrix2(cos, -sin, sin, cos);
        
        return Matrix2.multiplyMatrices(m, rotationMatrix);
    }
    
    /**
    * Rotates the matrix.
    * @param {number} angle - The angle in radians.
    * @return {this} self
    */
    rotate (angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var rotationMatrix = new Matrix2(cos, -sin, sin, cos);
        this.multiplyMatrices(rotationMatrix);
        
        return this;
    }
    
    /**
    * Applies a scale transformation to a matrix.
    * @param {Matrix2} m - The matrix.
    * @param {number} x - The amount to scale on the X axis.
    * @param {number} y - The amount to scale on the Y axis.
    * @return {Matrix2} A new scaled matrix.
    */
    static scale (m, x, y) {
        return Matrix2.multiplyMatrices(m, new Matrix2(x, 0, 0, y));
    }
    
    /**
    * Scales the matrix.
    * @param {number} x - The amount to scale on the X axis.
    * @param {number} y - The amount to scale on the Y axis.
    * @return {this} self
    */
    scale (x, y) {
        this.multiplyMatrices(new Matrix2(x, 0, 0, y));
        
        return this;
    }
    
    /**
    * Sets the matrix values.
    * @param {number} e11
    * @param {number} e12
    * @param {number} e21
    * @param {number} e22
    * @return {this} self
    */
    set (e11, e12, e21, e22) {
        this.e11 = e11;
        this.e12 = e12;
        this.e21 = e21;
        this.e22 = e22;
        
        return this;
    }
    
    /**
    * Sets the matrix from an array.
    * @param {Array} a - The array of matrix values.
    * @return {this} self
    */
    setFromArray (a) {
        this.set(a[0], a[1], a[2], a[3]);

        return this;
    }
    
    /**
    * Sets the matrix to the identity.
    * @return {this} self
    */
    setToIdentity () {
        this.set(1, 0, 0, 1);
        
        return this;
    }
    
    /**
    * Sets the values from the matrix into a new array.
    * @param {Matrix2} m - The matrix.
    * @return {Array} The array containing the matrix values.
    */
    static toArray (m) {
        var a = new Array(4);
        
        a[0] = m.e11;
        a[1] = m.e12;
        a[2] = m.e21;
        a[3] = m.e22;
        
        return a;
    }
    
    /**
    * Sets the values from the matrix into a new array.
    * @return {Array} The array containing the matrix values.
    */
    toArray () {
        return this.constructor.toArray(this);
    }
    
    /**
    * Sets the values from the matrix into a new Float32Array.
    * @param {Matrix2} m - The matrix.
    * @return {Float32Array} The array containing the matrix values.
    */
    static toFloat32Array (m) {
        var a = new Float32Array(4);
        
        a[0] = m.e11;
        a[1] = m.e12;
        a[2] = m.e21;
        a[3] = m.e22;
        
        return a;
    }
    
    /**
    * Sets the values from the matrix into a new Float32Array.
    * @return {Float32Array} The array containing the matrix values.
    */
    toFloat32Array () {
        return this.constructor.toFloat32Array(this);
    }
}

/**
* The number of columns.
* @name Matrix2#cols
*/
Object.defineProperty(Matrix2.prototype, 'cols', {
    enumerable: true,
    value: 2
});

/**
* The number of rows.
* @name Matrix2#rows
*/
Object.defineProperty(Matrix2.prototype, 'rows', {
    enumerable: true,
    value: 2
});

export default Matrix2;
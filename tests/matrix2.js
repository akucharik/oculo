'use strict';

import { 
    beforeEach, 
    describe as test, 
    it as assert } from 'mocha';
import { expect }  from 'chai';
import Matrix2     from '../src/scripts/math/matrix2';
    
test('Matrix2', function() {
    var m;

    beforeEach('Instantiate a new matrix', function() {
        m = new Matrix2();
    });

    test('Matrix2.clone', function() {
        assert('should return a duplicate matrix', function() {
            var m2 = Matrix2.clone(m);
            expect(m).to.deep.equal(m2);
        });
    });

    test('Matrix2.getDeterminant', function() {
        assert('should get the determinant', function() {
            m.set(1,2,3,1);
            expect(Matrix2.getDeterminant(m)).to.equal(-5);
        });
    });

    test('Matrix2.getInverse', function() {
        assert('should calculate and return the inverse', function() {
            m.set(1,2,3,1);
            var i = Matrix2.getInverse(m);
            expect(i.e11).to.equal(-0.2);
            expect(i.e12).to.equal(0.4);
            expect(i.e21).to.equal(0.6000000000000001);
            expect(i.e22).to.equal(-0.2);
        });
    });

    test('Matrix2.multiplyMatrices', function() {
        assert('should return the product of two matrices', function() {
            m.set(1,2,3,1);
            var m2 = new Matrix2(2,3,4,2);
            var m3 = Matrix2.multiplyMatrices(m, m2);
            expect(m3.e11).to.equal(10);
            expect(m3.e12).to.equal(7);
            expect(m3.e21).to.equal(10);
            expect(m3.e22).to.equal(11);
        });
    });

    test('Matrix2.multiplyScalar', function() {
        assert('should multiply matrix values by the provided scalar', function() {
            m.set(1,2,3,1);
            var m1 = Matrix2.multiplyScalar(m, 2);
            expect(m1.e11).to.equal(2);
            expect(m1.e12).to.equal(4);
            expect(m1.e21).to.equal(6);
            expect(m1.e22).to.equal(2);
        });
    });
    
    test('Matrix2.rotate', function() {
        assert('should apply a rotation to the provided matrix', function() {
            m.set(1,0,0,1);
            var m1 = Matrix2.rotate(m, 0.35);
            expect(m1.e11).to.equal(0.9393727128473789);
            expect(m1.e12).to.equal(-0.34289780745545134);
            expect(m1.e21).to.equal(0.34289780745545134);
            expect(m1.e22).to.equal(0.9393727128473789);
        });
    });
    
    test('Matrix2.scale', function() {
        assert('should apply a scale to the provided matrix', function() {
            m.set(1,0,0,1);
            var m1 = Matrix2.scale(m, 3, 3);
            expect(m1.e11).to.equal(3);
            expect(m1.e12).to.equal(0);
            expect(m1.e21).to.equal(0);
            expect(m1.e22).to.equal(3);
        });
    });

    test('Matrix2.toArray', function() {
        assert('should return an Array', function() {
            var a = Matrix2.toArray(m);
            expect(a).to.be.a('Array');
        });
        assert('should return something with length of 4', function() {
            var a = Matrix2.toArray(m);
            expect(a).to.have.lengthOf(4);
        });
        assert('should return a new array containing matrix values', function() {
            m.set(1,2,3,1);
            var a = Matrix2.toArray(m);
            expect(a[0]).to.equal(1);
            expect(a[1]).to.equal(2);
            expect(a[2]).to.equal(3);
            expect(a[3]).to.equal(1);
        });
    });

    test('Matrix2.toFloat32Array', function() {
        assert('should return a Float32Array', function() {
            var a = Matrix2.toFloat32Array(m);
            expect(a).to.be.a('Float32Array');
        });
        assert('should return something with length of 4', function() {
            var a = Matrix2.toFloat32Array(m);
            expect(a).to.have.lengthOf(4);
        });
        assert('should return a new Float32Array containing matrix values', function() {
            m.set(1,2,3,1);
            var a = Matrix2.toFloat32Array(m);
            expect(a[0]).to.equal(1);
            expect(a[1]).to.equal(2);
            expect(a[2]).to.equal(3);
            expect(a[3]).to.equal(1);
        });
    });

    test('constructor', function() {
        assert('should set its values to the provided parameters', function() {
            var m = new Matrix2(1,2,3,1);
            expect(m.e11).to.equal(1);
            expect(m.e12).to.equal(2);
            expect(m.e21).to.equal(3);
            expect(m.e22).to.equal(1);
        });
        assert('should set its values to the provided array', function() {
            var m = new Matrix2([1,2,3,1]);
            expect(m.e11).to.equal(1);
            expect(m.e12).to.equal(2);
            expect(m.e21).to.equal(3);
            expect(m.e22).to.equal(1);
        });
        assert('should set its values to the identity if no parameters are provided', function() {
            var m = new Matrix2();
            expect(m.e11).to.equal(1);
            expect(m.e12).to.equal(0);
            expect(m.e21).to.equal(0);
            expect(m.e22).to.equal(1);
        });
        assert('should set its values to the identity if the provided parameters are incompatible', function() {
            var m = new Matrix2(1,2,3);
            expect(m.e11).to.equal(1);
            expect(m.e12).to.equal(0);
            expect(m.e21).to.equal(0);
            expect(m.e22).to.equal(1);
        });
        assert('should set its values to the identity if the provided array is incompatible', function() {
            var m = new Matrix2([1,2,3,4,5]);
            expect(m.e11).to.equal(1);
            expect(m.e12).to.equal(0);
            expect(m.e21).to.equal(0);
            expect(m.e22).to.equal(1);
        });
    });

    test('cols', function() {
        assert('should be 2', function() {
            expect(m.cols).to.equal(2);
        });
    });

    test('rows', function() {
        assert('should be 2', function() {
            expect(m.rows).to.equal(2);
        });
    });

    test('clone', function() {
        assert('should return a duplicate matrix', function() {
            var m2 = m.clone();
            expect(m).to.deep.equal(m2);
        });
    });
    
    test('copy', function() {
        assert('should copy the values from the provided matrix into this matrix', function() {
            m.set(1,2,3,1);
            var m2 = new Matrix2(2,3,4,2);
            m.copy(m2);
            expect(m).to.deep.equal(m2);
        });
    });

    test('getDeterminant', function() {
        assert('should get the determinant', function() {
            m.set(1,2,3,1);
            expect(m.getDeterminant()).to.equal(-5);
        });
    });

    test('getInverse', function() {
        assert('should calculate and return the inverse', function() {
            m.set(1,2,3,1);
            var i = m.getInverse();
            expect(i.e11).to.equal(-0.2);
            expect(i.e12).to.equal(0.4);
            expect(i.e21).to.equal(0.6000000000000001);
            expect(i.e22).to.equal(-0.2);
        });
    });

    test('multiplyMatrices', function() {
        assert('should multiply itself by the provided matrix', function() {
            m.set(1,2,3,1);
            m.multiplyMatrices(new Matrix2(2,3,4,2));
            expect(m.e11).to.equal(10);
            expect(m.e12).to.equal(7);
            expect(m.e21).to.equal(10);
            expect(m.e22).to.equal(11);
        });
        assert('should multiply itself by the provided matrix', function() {
            m.set(1,2,3,1);
            m.multiplyMatrices(new Matrix2(2,3,4,2));
            expect(m.e11).to.equal(10);
            expect(m.e12).to.equal(7);
            expect(m.e21).to.equal(10);
            expect(m.e22).to.equal(11);
        });
    });

    test('multiplyScalar', function() {
        assert('should multiply its values by the provided value', function() {
            m.set(1,2,3,1);
            m.multiplyScalar(2);
            expect(m.e11).to.equal(2);
            expect(m.e12).to.equal(4);
            expect(m.e21).to.equal(6);
            expect(m.e22).to.equal(2);
        });
    });

    test('rotate', function() {
        assert('should rotate the matrix by the provided angle', function() {
            m.set(1,0,0,1);
            m.rotate(0.35);
            expect(m.e11).to.equal(0.9393727128473789);
            expect(m.e12).to.equal(-0.34289780745545134);
            expect(m.e21).to.equal(0.34289780745545134);
            expect(m.e22).to.equal(0.9393727128473789);
        });
    });
    
    test('scale', function() {
        assert('should scale the matrix by the provided factors', function() {
            m.set(1,0,0,1);
            m.scale(3,3);
            expect(m.e11).to.equal(3);
            expect(m.e12).to.equal(0);
            expect(m.e21).to.equal(0);
            expect(m.e22).to.equal(3);
        });
    });
    
    test('set', function() {
        assert('should set its values to the provided values', function() {
            m.set(1,2,3,1);
            expect(m.e11).to.equal(1);
            expect(m.e12).to.equal(2);
            expect(m.e21).to.equal(3);
            expect(m.e22).to.equal(1);
        });
    });

    test('setFromArray', function() {
        assert('should set its values by the provided array', function() {
            m.setFromArray([1,2,3,1]);
            expect(m.e11).to.equal(1);
            expect(m.e12).to.equal(2);
            expect(m.e21).to.equal(3);
            expect(m.e22).to.equal(1);
        });
    });

    test('setToIdentity', function() {
        assert('should set its values to the identity', function() {
            m.set(1,2,3,1);
            m.setToIdentity();
            expect(m.e11).to.equal(1);
            expect(m.e12).to.equal(0);
            expect(m.e21).to.equal(0);
            expect(m.e22).to.equal(1);
        });
    });

    test('toArray', function() {
        assert('should return an array', function() {
            var a = m.toArray();
            expect(a).to.be.a('Array');
        });
    });

    test('toFloat32Array', function() {
        assert('should return a Float32Array', function() {
            var a = m.toFloat32Array();
            expect(a).to.be.a('Float32Array');
        });
    });
});
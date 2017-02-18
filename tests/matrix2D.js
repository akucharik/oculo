'use strict';

import { 
    beforeEach, 
    describe as test, 
    it as assert 
} from 'mocha';
import { expect } from 'chai';
import Matrix2D from '../src/scripts/math/matrix2D';

test('Matrix2D', function() {
    var m;

    beforeEach('Instantiate a new matrix', function() {
        m = new Matrix2D();
    });

    test('Matrix2D.clone', function() {
        assert('should return a duplicate matrix', function() {
            var m2 = Matrix2D.clone(m);
            expect(m).to.deep.equal(m2);
        });
    });

    test('Matrix2D.getDeterminant', function() {
        assert('should get the determinant', function() {
            m.set(1,2,3,1,10,20);
            expect(Matrix2D.getDeterminant(m)).to.equal(-5);
        });
    });

    test('Matrix2D.getInverse', function() {
        assert('should calculate and return the inverse', function() {
            m.set(1,2,3,1,10,20);
            var i = Matrix2D.getInverse(m);
            expect(i.e11).to.equal(-0.2);
            expect(i.e12).to.equal(-0.4);
            expect(i.e21).to.equal(-0.6000000000000001);
            expect(i.e22).to.equal(-0.2);
            expect(i.tx).to.equal(-10);
            expect(i.ty).to.equal(-20);
        });
    });

    test('Matrix2D.multiplyMatrices', function() {
        assert('should return the product of two matrices', function() {
            m.set(1,2,3,1,10,20);
            var m2 = new Matrix2D(2,3,4,2,30,40);
            var m3 = Matrix2D.multiplyMatrices(m, m2);
            expect(m3.e11).to.equal(10);
            expect(m3.e12).to.equal(7);
            expect(m3.e21).to.equal(10);
            expect(m3.e22).to.equal(11);
            expect(m3.tx).to.equal(40);
            expect(m3.ty).to.equal(60);
        });
        assert('should return the product of any array of matrices', function() {
            m.set(1,2,3,1,10,20);
            var m2 = new Matrix2D(2,3,4,2,30,40);
            var m3 = new Matrix2D(2,0,0,2,50,60);
            var m4 = Matrix2D.multiplyMatrices([m, m2, m3]);
            expect(m4.e11).to.equal(20);
            expect(m4.e12).to.equal(14);
            expect(m4.e21).to.equal(20);
            expect(m4.e22).to.equal(22);
            expect(m4.tx).to.equal(90);
            expect(m4.ty).to.equal(120);
        });
    });

    test('Matrix2D.multiplyScalar', function() {
        assert('should multiply matrix values by the provided scalar', function() {
            m.set(1,2,3,1,10,20);
            var m1 = Matrix2D.multiplyScalar(m, 2);
            expect(m1.e11).to.equal(2);
            expect(m1.e12).to.equal(4);
            expect(m1.e21).to.equal(6);
            expect(m1.e22).to.equal(2);
            expect(m1.tx).to.equal(10);
            expect(m1.ty).to.equal(20);
        });
    });

    test('Matrix2D.toArray', function() {
        assert('should return an Array', function() {
            var a = Matrix2D.toArray(m);
            expect(a).to.be.a('Array');
        });
        assert('should return something with length of 6', function() {
            var a = Matrix2D.toArray(m);
            expect(a).to.have.lengthOf(6);
        });
        assert('should return a new array containing matrix values', function() {
            m.set(1,2,3,1,10,20);
            var a = Matrix2D.toArray(m);
            expect(a[0]).to.equal(1);
            expect(a[1]).to.equal(2);
            expect(a[2]).to.equal(3);
            expect(a[3]).to.equal(1);
            expect(a[4]).to.equal(10);
            expect(a[5]).to.equal(20);
        });
    });

    test('Matrix2D.toFloat32Array', function() {
        assert('should return a Float32Array', function() {
            var a = Matrix2D.toFloat32Array(m);
            expect(a).to.be.a('Float32Array');
        });
        assert('should return something with length of 6', function() {
            var a = Matrix2D.toFloat32Array(m);
            expect(a).to.have.lengthOf(6);
        });
        assert('should return a new Float32Array containing matrix values', function() {
            m.set(1,2,3,1,10,20);
            var a = Matrix2D.toFloat32Array(m);
            expect(a[0]).to.equal(1);
            expect(a[1]).to.equal(2);
            expect(a[2]).to.equal(3);
            expect(a[3]).to.equal(1);
            expect(a[4]).to.equal(10);
            expect(a[5]).to.equal(20);
        });
    });

    test('constructor', function() {
        assert('should set its values to the provided parameters', function() {
            var m = new Matrix2D(1,2,3,1,10,20);
            expect(m.e11).to.equal(1);
            expect(m.e12).to.equal(2);
            expect(m.e21).to.equal(3);
            expect(m.e22).to.equal(1);
            expect(m.tx).to.equal(10);
            expect(m.ty).to.equal(20);
        });
        assert('should set its values to the provided array', function() {
            var m = new Matrix2D([1,2,3,1,10,20]);
            expect(m.e11).to.equal(1);
            expect(m.e12).to.equal(2);
            expect(m.e21).to.equal(3);
            expect(m.e22).to.equal(1);
            expect(m.tx).to.equal(10);
            expect(m.ty).to.equal(20);
        });
        assert('should set its values to the identity if no parameters are provided', function() {
            var m = new Matrix2D();
            expect(m.e11).to.equal(1);
            expect(m.e12).to.equal(0);
            expect(m.e21).to.equal(0);
            expect(m.e22).to.equal(1);
            expect(m.tx).to.equal(0);
            expect(m.ty).to.equal(0);
        });
        assert('should set its values to the identity if the provided parameters are incompatible', function() {
            var m = new Matrix2D(1,2,3);
            expect(m.e11).to.equal(1);
            expect(m.e12).to.equal(0);
            expect(m.e21).to.equal(0);
            expect(m.e22).to.equal(1);
            expect(m.tx).to.equal(0);
            expect(m.ty).to.equal(0);
        });
        assert('should set its values to the identity if the provided array is incompatible', function() {
            var m = new Matrix2D([1,2,3,4,5]);
            expect(m.e11).to.equal(1);
            expect(m.e12).to.equal(0);
            expect(m.e21).to.equal(0);
            expect(m.e22).to.equal(1);
            expect(m.tx).to.equal(0);
            expect(m.ty).to.equal(0);
        });
    });

    test('cols', function() {
        assert('should be 2', function() {
            expect(m.cols).to.equal(2);
        });
    });

    test('rows', function() {
        assert('should be 3', function() {
            expect(m.rows).to.equal(2);
        });
    });

    test('clone', function() {
        assert('should return a duplicate matrix', function() {
            var m2 = m.clone();
            expect(m).to.deep.equal(m2);
        });
    });

    test('getDeterminant', function() {
        assert('should get the determinant', function() {
            m.set(1,2,3,1,10,20);
            expect(m.getDeterminant()).to.equal(-5);
        });
    });

    test('getInverse', function() {
        assert('should calculate and return the inverse', function() {
            m.set(1,2,3,1,10,20);
            var i = m.getInverse();
            expect(i.e11).to.equal(-0.2);
            expect(i.e12).to.equal(-0.4);
            expect(i.e21).to.equal(-0.6000000000000001);
            expect(i.e22).to.equal(-0.2);
            expect(i.tx).to.equal(-10);
            expect(i.ty).to.equal(-20);
        });
    });

    test('multiplyMatrices', function() {
        assert('should multiply itself by the provided matrix', function() {
            m.set(1,2,3,1,10,20);
            m.multiplyMatrices(new Matrix2D(2,3,4,2,30,40));
            expect(m.e11).to.equal(10);
            expect(m.e12).to.equal(7);
            expect(m.e21).to.equal(10);
            expect(m.e22).to.equal(11);
            expect(m.tx).to.equal(40);
            expect(m.ty).to.equal(60);
        });
        assert('should multiply itself by the provided matrices', function() {
            m.set(1,2,3,1,10,20);
            m.multiplyMatrices([new Matrix2D(2,3,4,2,30,40), new Matrix2D(2,0,0,2,50,60)]);
            expect(m.e11).to.equal(20);
            expect(m.e12).to.equal(14);
            expect(m.e21).to.equal(20);
            expect(m.e22).to.equal(22);
            expect(m.tx).to.equal(90);
            expect(m.ty).to.equal(120);
        });
    });

    test('multiplyScalar', function() {
        assert('should multiply its values by the provided value', function() {
            m.set(1,2,3,1,10,20);
            m.multiplyScalar(2);
            expect(m.e11).to.equal(2);
            expect(m.e12).to.equal(4);
            expect(m.e21).to.equal(6);
            expect(m.e22).to.equal(2);
            expect(m.tx).to.equal(10);
            expect(m.ty).to.equal(20);
        });
    });

    test('set', function() {
        assert('should set its values to the provided values', function() {
            m.set(1,2,3,1,10,20);
            expect(m.e11).to.equal(1);
            expect(m.e12).to.equal(2);
            expect(m.e21).to.equal(3);
            expect(m.e22).to.equal(1);
            expect(m.tx).to.equal(10);
            expect(m.ty).to.equal(20);
        });
    });

    test('setFromArray', function() {
        assert('should set its values by the provided array of 4 values', function() {
            m.setFromArray([1,2,3,1]);
            expect(m.e11).to.equal(1);
            expect(m.e12).to.equal(2);
            expect(m.e21).to.equal(3);
            expect(m.e22).to.equal(1);
            expect(m.tx).to.equal(0);
            expect(m.ty).to.equal(0);
        });
        assert('should set its values by the provided array of 6 values', function() {
            m.setFromArray([1,2,3,1,10,20]);
            expect(m.e11).to.equal(1);
            expect(m.e12).to.equal(2);
            expect(m.e21).to.equal(3);
            expect(m.e22).to.equal(1);
            expect(m.tx).to.equal(10);
            expect(m.ty).to.equal(20);
        });
    });

    test('setToIdentity', function() {
        assert('should set its values to the identity', function() {
            m.set(1,2,3,1,10,20);
            m.setToIdentity();
            expect(m.e11).to.equal(1);
            expect(m.e12).to.equal(0);
            expect(m.e21).to.equal(0);
            expect(m.e22).to.equal(1);
            expect(m.tx).to.equal(0);
            expect(m.ty).to.equal(0);
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
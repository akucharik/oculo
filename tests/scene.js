'use strict';

import { 
    beforeEach, 
    describe as test, 
    it as assert } from 'mocha';
import { expect }  from 'chai';

var Oculo = require('../dist/oculo');
var Scene = Oculo.Scene

test('Scene', function() {
    var scene;

    beforeEach('Instantiate a new scene', function() {
        scene = new Scene(null, 1000, 500);
    });
    
    afterEach('Clean up scene', function() {
        scene.destroy();
    });
    
    test('destroy', function() {
        assert('view should be null', function() {
            scene.destroy()
            expect(scene.view).to.be.null;
        });
    });
    
    test('width', function() {
        assert('should be a number', function() {
            scene.width = 400;
            expect(scene.width).to.equal(400);
        });
        
        assert('"auto" should be 0 without a view', function() {
            scene.view = null;
            scene.width = 'auto';
            expect(scene.width).to.equal(0);
        });
    });
    
    test('height', function() {
        assert('should be a number', function() {
            scene.height = 200;
            expect(scene.height).to.equal(200);
        });
        
        assert('"auto" should be 0 without a view', function() {
            scene.view = null;
            scene.height = 'auto';
            expect(scene.height).to.equal(0);
        });
    });
});
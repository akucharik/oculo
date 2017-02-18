'use strict';

import { 
    beforeEach, 
    describe as test, 
    it as assert }  from 'mocha';
import { expect }   from 'chai';
import { TweenMax } from 'gsap';

var Oculo = require('../dist/oculo');
var Animation = Oculo.Animation;
var Camera = Oculo.Camera;
var Scene = Oculo.Scene;
var Vector2 = Oculo.Vector2;

test('Animation', function() {
    var a;
    var c;

    beforeEach('Instantiate a new animation', function() {
        c = new Camera().addScene('scene1', new Scene(null, 1000, 500)).setScene('scene1');
        a = new Oculo.Animation(c);
    });
    
    afterEach('Clean up animation', function() {
        a.destroy();
        c.destroy();
    });
    
    test('_parseProps', function() {
        assert('should evaluate rotation when provided as a function', function() {
            var random = Math.random();
            var props = {
                rotation: function () {
                    return 360 * random;
                }
            };
            
            var parsed = a._parseProps(props);
            expect(parsed.rotation).to.equal(360 * random);
        });
        
        assert('should evaluate zoom when provided as a function', function() {
            var random = Math.random();
            var props = {
                zoom: function () {
                    return 1 + random;
                }
            };
            
            var parsed = a._parseProps(props);
            expect(parsed.zoom).to.equal(1 + random);
        });
    });
    
//    test('_parseCoreProps', function() {
//        assert('should parse the core animation properties', function() {
//            var expected, parsed, origin, position, rotation, zoom;
//            
//            origin = undefined;
//            position = undefined;
//            rotation = undefined;
//            zoom = undefined;
//            expected = {
//                parsedOrigin: null,
//                parsedPosition: null,
//                parsedRotation: null,
//                parsedZoom: null
//            };
//            parsed = a._parseCoreProps(origin, position, rotation, zoom, c);
//            expect(parsed).to.deep.equal(expected);
//            
//            origin = { x: 200, y: 200 };
//            position = undefined;
//            rotation = -20;
//            zoom = 2;
//            expected = {
//                parsedOrigin: { x: 200, y: 200 },
//                parsedPosition: null,
//                parsedRotation: -20,
//                parsedZoom: 2
//            };
//            parsed = a._parseCoreProps(origin, position, rotation, zoom, c);
//            expect(parsed).to.deep.equal(expected);
//            
//            origin = undefined;
//            position = '#box100';
//            rotation = undefined;
//            zoom = undefined;
//            expected = {
//                parsedOrigin: null,
//                parsedPosition: { x: 50, y: 50 },
//                parsedRotation: null,
//                parsedZoom: null
//            };
//            parsed = a._parseCoreProps(origin, position, rotation, zoom, c);
//            expect(parsed).to.deep.equal(expected);
//        });
//    });
//            
//    test('_calculateEndProps', function() {
//        assert('should return the animation\'s end properties', function() {
//            var expected, parsedOrigin, parsedPosition, parsedRotation, parsedZoom, endProps;
//            
//            // position, rotation, zoom
//            parsedOrigin = null;
//            parsedPosition = { x: 200, y: 200 };
//            parsedRotation = -20;
//            parsedZoom = 1.5;
//            expected = {
//                isMoving: true,
//                isRotating: true,
//                isZooming: true,
//                endOffset: new Vector2(179, 385),
//                endOrigin: null,
//                endRotation: -20,
//                endZoom: 1.5
//            };
//            endProps = a._calculateEndProps(parsedOrigin, parsedPosition, parsedRotation, parsedZoom, c);
//            endProps.endOffset.x = Math.round(endProps.endOffset.x);
//            endProps.endOffset.y = Math.round(endProps.endOffset.y);
//            expect(endProps).to.deep.equal(expected);
//            
//            // rotation
//            parsedOrigin = null;
//            parsedPosition = null;
//            parsedRotation = -20;
//            parsedZoom = null;
//            expected = {
//                isMoving: false,
//                isRotating: true,
//                isZooming: false,
//                endOffset: null,
//                endOrigin: c.viewportCenter.clone(),
//                endRotation: -20,
//                endZoom: null
//            };
//            endProps = a._calculateEndProps(parsedOrigin, parsedPosition, parsedRotation, parsedZoom, c);
//            expect(endProps).to.deep.equal(expected);
//            
//            // origin, zoom
//            parsedOrigin = { x: 200, y: 200 };
//            parsedPosition = null;
//            parsedRotation = null;
//            parsedZoom = 2;
//            expected = {
//                isMoving: false,
//                isRotating: false,
//                isZooming: true,
//                endOffset: null,
//                endOrigin: new Vector2(200, 200),
//                endRotation: null,
//                endZoom: 2
//            };
//            endProps = a._calculateEndProps(parsedOrigin, parsedPosition, parsedRotation, parsedZoom, c);
//            expect(endProps).to.deep.equal(expected);
//        });
//    });
});
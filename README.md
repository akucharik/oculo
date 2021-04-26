# Oculo

Oculo is a simple and intuitive JavaScript 2D virtual camera for animating HTML within a frame.

<p>
  <img src="https://img.shields.io/github/package-json/v/akucharik/oculo?style=flat-square">
</p>

## Dependencies
Oculo requires [GreenSock Animation Platform](https://greensock.com/gsap) (GSAP), TweenMax to be specific, and uses it to handle tweening and rendering.

## Demo, Code Examples, and Documentation
Check out [Oculo's website](https://akucharik.github.io/oculo) to play with the demo, learn how to get started, and read the detailed documentation.

## Features
- Pan
- Zoom
- Rotate
- Shake
- Fade
- Drag to move
- Wheel to zoom
- Resize
- Bounds
- Play controls
- and more...

## Getting started
### 1. [Download Oculo](https://github.com/akucharik/oculo/archive/master.zip) and add it and its dependencies to your page.

```html
<script type="text/javascript" src="oculo/dist/TweenMax.min.js"></script>
<script type="text/javascript" src="oculo/dist/Draggable.min.js"></script>
<script type="text/javascript" src="oculo/dist/oculo.min.js"></script>
```

### 2. Set up your HTML

```html
<div id="camera"></div>
<div id="scene" style="width: 800px; height: 400px; background-color: gray;">
    <div>My first scene...</div>
</div>
```

### 3. Initialize your camera

```javascript
var myCamera = new Oculo.Camera({
    view: '#camera',
    width: 500,
    height: 250,
    dragToMove: true,
    wheelToZoom: true
}).addScene('scene1', '#scene').render();
```

## Reusable animations
Create reusable animations when your page initially loads:

```javascript
myCamera.addAnimation('zoomInOut', {
  keyframes: [{ 
      duration: 2,
      zoom: 2,
      options: { 
          ease: Power2.easeIn 
      }
  }, {
      duration: 2,
      zoom: 1,
      options: {
          ease: Power2.easeOut
      }
  }]
});

// Play your animation in the future: myCamera.play('zoomInOut');
```
## On-the-fly animations
Create on-the-fly animations when needed:

```javascript
myCamera.zoomTo(2, 1, { ease: Power2.easeOut });
```

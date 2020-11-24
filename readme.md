
# Rive Web Component: Create and use beautiful animations

With this package you can bring the power of Rive / Flare to the browser and enhance your users experience with beautiful animations.

  

![enter image description here](https://s8.gifyu.com/images/Trim2.gif)

[Animation](https://rive.app/a/pollux/files/flare/trim/preview)

  

## Install

### NPM

Get the package with

> npm i rive-web-component

  

and check your frameworks documentation on how to use Web Components

### CDN

  

## How to use

  

<rive-actor file="./assets/Trim.flr" animation="Play" />

  

### Attributes

All Attributes that the HTMLElement accepts:

- file: string

- animation: string | undefined

- color: string | undefined

- artboard: string | undefined

- bounds-node: string | undefined

- antialias: boolean | undefined

- snap-to-end: boolean | undefined

- should-clip: boolean | undefined

- paused: boolean | undefined

- on-animation-end: function | undefined

- on-ready: function | undefined

### Properties

All Properties the HTMLElement has (Changing those will update the HTMLElement):

- playing: string | undefined // currently playing animation

- paused: boolean

- antialias: boolean

- color: string| undefined

- artboard: string | undefined

- boundsNode: string | undefined

- snapToEnd: boolean

- shouldClip: boolean

### Methods

All Methods the HTMLElement has:

- play(animation?: string): Promise< void >

  

> will resume the animation if paused or will play the animation given by the first parameter and return a promise which resolves when the animation ended (when the current animations gets override the promise will get rejected!!)

  

- pause(): void

  

> will pause the animation

  

- changeAnimation(animation?: string): Promise< void >

  

> will change (override) the currently playing animation and return a promise which resolves when the animation ended (when the current animations gets override the promise will get rejected!!)


  

### Events

  

- on-ready

  

> will fire when the Element is ready to play animations
Wait until this Event has been fired before calling methods or changing Properties

  

- animation-end

  

> gets fired when the currently animation ends.
Will never fire on looped animations

  

## How dose it work?

This package is based on the [flare_flutter](https://pub.dev/packages/flare_flutter) package from [rive.app](https://pub.dev/publishers/rive.app/packages)

Thanks to Flutter Web its possible to compile Flutter Apps for Web.

### Why?

Because the available [package](https://www.npmjs.com/package/@2dimensions/flare-js) from 2dimensions to use rive/flare animations in web is not well maintained and documented and hard to setup

  

## Whats missing / Problems

  

- Unit/Integration/e2e Tests (zero tests currently)

- Very big bundle size thanks to Flutter

  

## Problems?

Because this package is based on [flare_flutter](https://pub.dev/packages/flare_flutter) it's possible that by studding the documentation of that package your problem could be solved.
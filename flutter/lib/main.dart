import 'dart:async';

import 'package:flare_flutter/flare.dart';
import 'package:flare_flutter/flare_actor.dart';
import 'package:flare_flutter/flare_controls.dart';

import 'dart:js' as js;

import 'package:flutter/material.dart';

class AnimationState {
  String file;
  String animation;
  String actualAnimation;
  bool isPause;
  bool antialias;
  String color;
  String artboard;
  String boundsNode;
  bool snapToEnd;
  bool shouldClip;

  AnimationState() {
    this.file = js.context["file"];
    this.animation = js.context["animation"];
    this.antialias =
        js.context["antialias"] != null ? js.context["antialias"] : false;
    this.color = js.context["color"];
    this.artboard = js.context["artboard"];
    this.boundsNode = js.context["boundsNode"];
    this.snapToEnd =
        js.context["snapToEnd"] != null ? js.context["snapToEnd"] : false;
    this.shouldClip =
        js.context["shouldClip"] != null ? js.context["shouldClip"] : false;
    this.isPause =
        js.context["isPause"] != null ? js.context["isPause"] : false;
  }
}

AnimationState _animationState = new AnimationState();
StreamController stateController = StreamController<AnimationState>();
CustomFlareControls _controls = new CustomFlareControls();

class CustomFlareControls extends FlareControls {
  @override
  bool advance(FlutterActorArtboard artboard, double elapsed) {
    super.advance(artboard, elapsed);
    return true;
  }

  @override
  void onCompleted(String name) {
    super.onCompleted(name);
    js.context["callback"] != null
        ? js.context.callMethod("callback", [name])
        : null;
  }
}

class HexColor extends Color {
  static int _getColorFromHex(String hexColor) {
    hexColor = hexColor.toUpperCase().replaceAll("#", "");
    if (hexColor.length == 6) {
      hexColor = "FF" + hexColor;
    }
    return int.parse(hexColor, radix: 16);
  }

  HexColor(final String hexColor) : super(_getColorFromHex(hexColor));
}

void main() {
  js.context["changeAnimation"] = js.allowInterop(changeAnimation);
  // js.context["changeFile"] = changeFile;
  js.context["changeAntialias"] = js.allowInterop(changeAntialias);
  js.context["changeColor"] = js.allowInterop(changeColor);
  js.context["changeArtboard"] = js.allowInterop(changeArtboard);
  js.context["changeBoundsNode"] = js.allowInterop(changeBoundsNode);
  js.context["changeSnapToEnd"] = js.allowInterop(changeSnapToEnd);
  js.context["changeShouldClip"] = js.allowInterop(changeShouldClip);
  js.context["changeCallback"] = js.allowInterop(changeCallback);
  js.context["pause"] = js.allowInterop(pause);
  js.context["play"] = js.allowInterop(play);

  _animationState = new AnimationState();

  runApp(MyApp());
}

void changeAnimation(String animation) {
  if (animation != null) {
    _animationState.animation = animation;
    stateController.sink.add(_animationState);
  }
}

void pause() {
  _animationState.isPause = true;
  stateController.sink.add(_animationState);
}

void play([String animation]) {
  if (animation != null) {
    _controls.play(animation);
  }
  _animationState.isPause = false;
  stateController.sink.add(_animationState);
}

void changeAntialias(bool antialias) {
  _animationState.antialias = antialias;
  stateController.sink.add(_animationState);
}

void changeColor(String color) {
  _animationState.color = color;
  stateController.sink.add(_animationState);
}

void changeArtboard(String artboard) {
  _animationState.artboard = artboard;
  stateController.sink.add(_animationState);
}

void changeBoundsNode(String boundsNode) {
  _animationState.boundsNode = boundsNode;
  stateController.sink.add(_animationState);
}

void changeSnapToEnd(bool snapToEnd) {
  _animationState.snapToEnd = snapToEnd;
  stateController.sink.add(_animationState);
}

void changeShouldClip(bool shouldClip) {
  _animationState.shouldClip = shouldClip;
  stateController.sink.add(_animationState);
}

void changeCallback(Function(String) callback) {
  js.context["callback"] = callback;
}

class MyApp extends StatefulWidget {
  // This widget is the root of your application.
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  @override
  void initState() {
    super.initState();
    stateController.sink.add(_animationState);
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      child: StreamBuilder<AnimationState>(
        stream: stateController.stream,
        builder: (context, snapshot) {
          return FlareActor(
            snapshot.data.file,
            alignment: Alignment.center,
            fit: BoxFit.contain,
            sizeFromArtboard: true,
            animation: snapshot.data.animation,
            antialias: snapshot.data.antialias,
            isPaused: snapshot.data.isPause,
            artboard: snapshot.data.artboard,
            boundsNode: snapshot.data.boundsNode,
            snapToEnd: snapshot.data.snapToEnd,
            shouldClip: snapshot.data.shouldClip,
            controller: _controls,
            // callback: (String s) => snapshot.data.callback(s),
            callback: (String s) {
              js.context["callback"] != null
                  ? js.context.callMethod("callback", [s])
                  : null;
            },
            color: snapshot.data.color != null
                ? HexColor(snapshot.data.color)
                : null,
          );
        },
      ),
    );
  }
}

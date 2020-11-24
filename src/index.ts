import animationPlayer from "./flutter"



export class RiveActor extends HTMLElement {


  private isReady = false;
  private iframe: HTMLIFrameElement;
  private styleElement: HTMLStyleElement;

  private __playing: {animation: string, resolve: () => void, reject: () => void}[] = [];

  public play(animation?: string){
    return new Promise((resolve, reject) => {
      if(this.isReady){
        if(animation){

          this.__playing.push({
            animation,
            resolve,
            reject
          });

          //@ts-ignore
          this.iframe.contentWindow.play(animation);
          this["__paused"] = false;
        }else{
          //@ts-ignore
          this.iframe.contentWindow.play();
          resolve();
          this["__paused"] = false;
        }
      }
    })
  }

  public pause(){
    
    if(this.isReady){
      //@ts-ignore
      this.iframe.contentWindow.pause();
      this["__paused"] = true;
    }
  }

  public changeAnimation(animation?: string){
    return new Promise((resolve, reject) => {
      if(this.isReady){
        if(animation){
          this.__playing.forEach(ani => ani.reject())
          this.__playing = [{
            animation,
            reject: reject,
            resolve: resolve
          }];
          //@ts-ignore
          this.iframe.contentWindow.changeAnimation(animation);
        }
      }
    })
  }

  private callback(animation: string){
    this.__playing = this.__playing.filter(ani => {
      if(ani.animation !== animation){
        return true;
      }else{
        console.log(ani.animation);
        
        ani.resolve();
        return false;
      }
    })
  }

  
  public get playing() : string|undefined {
    return this.__playing.length === 0? undefined: this.__playing[this.__playing.length - 1]?.animation;
  }

  public set playing(animation : string) {
    this.attributeChangedCallback("animation", this["__animation"], animation);
  }

  public get paused() : boolean {
    return this["__paused"] || false;
  }

  public set paused(isPaused: boolean) {
    this.attributeChangedCallback("paused", this["__paused"], isPaused);
  }

  public get antialias() : boolean {
    return this["__antialias"] || false;
  }

  public set antialias(antialias: boolean) {
    this.attributeChangedCallback("antialias", this["__antialias"], antialias);
  }

  public get color() : string|undefined {
    return this["__color"] || undefined;
  }

  public set color(color: string) {
    this.attributeChangedCallback("color", this["__color"], color);
  }

  public get artboard() : string|undefined {
    return this["__artboard"] || undefined;
  }

  public set artboard(artboard: string) {
    this.attributeChangedCallback("artboard", this["__artboard"], artboard);
  }

  public get boundsNode() : string|undefined {
    return this["__bounds-node"] || undefined;
  }

  public set boundsNode(boundsNode: string) {
    this.attributeChangedCallback("bounds-node", this["__bounds-node"], boundsNode);
  }

  public get snapToEnd() : boolean {
    return this["__snap-to-end"] || undefined;
  }

  public set snapToEnd(snapToEnd: boolean) {
    this.attributeChangedCallback("snap-to-end", this["__snap-to-end"], snapToEnd);
  }

  public get shouldClip() : boolean {
    return this["__should-clip"] || undefined;
  }

  public set shouldClip(shouldClip: boolean) {
    this.attributeChangedCallback("should-clip", this["__should-clip"], shouldClip);
  }

  public get onAnimationEnd(): (animation: string) => void {
    return this["__on-animation-end"] || undefined;
  }

  public set onAnimationEnd(onAnimationEnd: (animation: string) => void) {
    this.attributeChangedCallback("on-animation-end", this["__on-animation-end"], onAnimationEnd);
  }

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.iframe = document.createElement("iframe");
    // this.iframe.setAttribute("loading", "lazy");
    // this.iframe.setAttribute("src", "");
    this.iframe.srcdoc = animationPlayer;
    this.styleElement = document.createElement("style");

    this.styleElement.innerText = `
      :host {
        display: block;
        pointer-events: none;
      }
      iframe {
        border-width: unset;
        border-style: unset;
        border-color: unset;
        border-image: unset;
        height: 100%;
        width: 100%;
        pointer-events: none;
      }
    `;

    this.iframe.onload = this.__checkReady.bind(this);

    this.shadowRoot.appendChild(this.styleElement);
    this.shadowRoot.appendChild(this.iframe);
  }

  private __checkReady() {
    
    let interval = setInterval( (() => {
      //@ts-ignore
      if(this.iframe.contentWindow.play !== undefined){
        clearInterval(interval);
        setTimeout((() => {
          this.isReady = true;
          this.dispatchEvent(new CustomEvent('on-ready'));
          eval(this['__on-ready']);
        }).bind(this), 100)

      }
    }).bind(this))


  };

  private static get observedAttributes() {
    return ['file', 'animation', 'antialias', 'color', 'artboard', 'bounds-node', 'snap-to-end', 'should-clip', 'on-animation-end', 'paused', "on-ready"];
  }

  private attributeChangedCallback(name, oldValue, newValue) {
    if(name === "file"){
      this[`__${name}`] = "../" + newValue;
    }else{
      this[`__${name}`] = newValue;
    }

    if(this.isReady){
      if(oldValue !== newValue){
        switch (name) {
          case "animation":
            this.changeAnimation(newValue);
            break;
          case "antialias":
            //@ts-ignore
            this.iframe.contentWindow.changeAntialias(newValue !== null);
            break;
          case "color":
            //@ts-ignore
            this.iframe.contentWindow.changeColor(newValue);
            break;
          case "artboard":
            //@ts-ignore
            this.iframe.contentWindow.changeArtboard(newValue);
            break;
          case "bounds-node":
            //@ts-ignore
            this.iframe.contentWindow.changeBoundsNode(newValue);
            break;
          case "snap-to-end":
            //@ts-ignore
            this.iframe.contentWindow.changeSnapToEnd(newValue !== null);
            break;
          case "should-clip":
            //@ts-ignore
            this.iframe.contentWindow.changeShouldClip(newValue);
            break;
          case "paused":
            if((newValue !== null && newValue !== false) || newValue === true){
              //@ts-ignore
              this.iframe.contentWindow.pause();
            }else{
              //@ts-ignore
              this.iframe.contentWindow.play();
            }
            break;
        
          default:
            break;
        }
      }
    }
  }

  private connectedCallback(){

    //@ts-ignore
    this.iframe.contentWindow.file = this["__file"] || "";
    //@ts-ignore
    this.iframe.contentWindow.animation = this['__animation'];
    //@ts-ignore
    this.iframe.contentWindow.antialias = this["__antialias"];
    //@ts-ignore
    this.iframe.contentWindow.color = this["__color"];
    //@ts-ignore
    this.iframe.contentWindow.artboard = this["__artboard"];
    //@ts-ignore
    this.iframe.contentWindow.boundsNode = this['__bounds-node'];
    //@ts-ignore
    this.iframe.contentWindow.snapToEnd = this['__snap-to-end'];
    //@ts-ignore
    this.iframe.contentWindow.shouldClip = this['__should-clip'];
    //@ts-ignore
    this.iframe.contentWindow.isPause = this['__paused'];
    //@ts-ignore
    this.iframe.contentWindow.callback = (str: string) => {
      this.callback(str);
      this.dispatchEvent(new CustomEvent('animation-end', {detail: {animation: str}}));
      eval(this['__on-animation-end']);
    };


    
  }
}
  
customElements.define('rive-actor', RiveActor);
  
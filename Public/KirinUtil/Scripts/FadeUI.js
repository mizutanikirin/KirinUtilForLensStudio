var init = false;
var Util;
var alpha;
var rootObj;

const coroutineModule = require('Coroutine');
const CoroutineManager = coroutineModule.CoroutineManager;
//const waitForEndOfFrame = coroutineModule.waitForEndOfFrame;
const waitForSeconds = coroutineModule.waitForSeconds;
const coroutineManager = new CoroutineManager(script);
var fadeInCoroutine;
var fadeOutCoroutine;

var images = [];
var texts = [];

//----------------------------------
//  Init
//----------------------------------
function Start(){
    if(!init) Init();
}
Start();

function Init(){
    init = true;
    Util = global.KirinUtil;
    rootObj = script.getSceneObject();
}


//----------------------------------
//  Alpha変更
//----------------------------------
// 指定したobjectのアルファ値をalphaにする
function SetAlphaObj(object, alpha){
    if(!init) Init();

    var renderers = object.getComponents("Component.Image");
    for (var i = 0; i < renderers.length; i++) {
        var material = renderers[i].getMaterial(0);
        if (material) {
            var color = material.mainPass.baseColor;
            color.w = alpha; // アルファ値を変更
            material.mainPass.baseColor = color;
        }
    }
}
script.api.SetAlphaObj = SetAlphaObj;

// 指定したobjectとその子すべてのアルファ値をalphaにする
function SetAlphaChildren(parentObj, alpha){
    if(!init) Init();

    var objs = Util.media.GetAllObjs(parentObj);
    if(objs === null) return;

    for(var i = 0; i < objs.length;i++){
        SetAlphaObj(objs[i], alpha);
    }
}
script.api.SetAlphaChildren = SetAlphaChildren;


//----------------------------------
//  フェードイン
//----------------------------------
function FadeInUI(obj, time, delay){
    if(!init) Init();

    FadeInit(obj);
    obj.enabled = true;
    SetFadeChildren(0);
    fadeInCoroutine = coroutineManager.startCoroutine(FadeInUIWait, time, delay, obj);
}
script.api.FadeInUI = FadeInUI;

function* FadeInUIWait(time, delay, obj){
    if(delay > 0) yield* waitForSeconds(delay);

    obj.enabled = true;
    var loopCountMax = Math.ceil(time / 0.1);
    var oneAlpha = 1 / loopCountMax;
    alpha = 0;
    for(var i = 0; i < loopCountMax;i++){
        alpha += oneAlpha;
        var endFade = false;
        if(alpha >= 1){
            endFade = true;
            alpha = 1;
        } 
        SetFadeChildren(alpha);

        if(endFade) break;
        yield* waitForSeconds(0.1);
    }
}


//----------------------------------
//  フェードアウト
//----------------------------------
function FadeOutUI(obj, time, delay){
    if(!init) Init();
    FadeInit(obj);
    fadeOutCoroutine = coroutineManager.startCoroutine(FadeOutUIWait, obj, time, delay);
}
script.api.FadeOutUI = FadeOutUI;

function* FadeOutUIWait(obj, time, delay){
    if(delay > 0) yield* waitForSeconds(delay);

    var loopCountMax = Math.ceil(time / 0.1);
    var oneAlpha = 1 / loopCountMax;
    alpha = 1;
    for(var i = 0; i < loopCountMax;i++){
        alpha -= oneAlpha;
        var endFade = false;
        if(alpha <= 0) {
            endFade = true;
            alpha = 0;
        }
        SetFadeChildren(alpha, true);

        if(endFade) break;
        yield* waitForSeconds(0.1);
    }
    
    obj.enabled = false;
}


//----------------------------------
//  Common (フェード時)
//----------------------------------
function FadeInit(obj){
    var objs = Util.media.GetAllObjs(obj);

    ImagesPush(obj);
    TextsPush(obj);
    
    for(var i = 0; i < objs.length;i++){
        ImagesPush(objs[i]);
        TextsPush(objs[i]);
    }
}

function ImagesPush(obj){
    var thisImages = obj.getComponents("Component.Image");
    if(thisImages != null){
        for (var j = 0; j < thisImages.length; j++) {
            images.push(thisImages[j]);
        }
    }
}
function TextsPush(obj){
    var thisTexts = obj.getComponents("Component.Text");
    if(thisTexts != null){
        for (var j = 0; j < thisTexts.length; j++) {
            print(thisTexts[j].getSceneObject().name);
            texts.push(thisTexts[j]);
        }
    }
}

function SetFadeChildren(alpha){
    if(images != null){
        for (var i = 0; i < images.length; i++) {
            SetFadeImage(images[i], alpha);
        }
    }

    if(texts != null){
        for (var i = 0; i < texts.length; i++) {
            SetFadeText(texts[i], alpha);
        }
    }
}

function SetFadeImage(image, alpha){
    var material = image.getMaterial(0);
    if (material) {
        var color = material.mainPass.baseColor;
        color.w = alpha; // アルファ値を変更
        material.mainPass.baseColor = color;
    }
}
function SetFadeText(text, alpha){
    var textColor = text.textFill.color;
    textColor.w = alpha; // アルファ値を変更
    text.textFill.color = textColor;
}
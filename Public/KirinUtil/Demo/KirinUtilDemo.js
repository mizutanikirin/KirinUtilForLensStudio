// @input SceneObject cubeObj
// @input Asset.ObjectPrefab prefabObj
// @input SceneObject parentObj
// @input SceneObject structureObj
// @input SceneObject deleteObj
// @input SceneObject pathObj
// @input SceneObject fadeUI
// @input Component.AudioComponent demoAudio

var Util;
var count = 0;
var timer;

function Start(){
    Util = global.KirinUtil;

    // Rotation
    Util.LocalRotation(script.cubeObj, new vec3(0,45,0));

    // Create Obj from prefab
    var obj = Util.media.CreateLocalObj(
        script.prefabObj, script.parentObj, "testObj", 
        new vec3(0,0,0), new vec3(0,0,0), new vec3(1,1,1)
    );
    print("CreateLocalObj: " + obj.name);

    // Get the SceneObject named [test]
    var objs = Util.media.GetAllObjs(script.structureObj, "test");
    for(var i = 0; i < objs.length;i++){
        print(objs[i].name);
    }

    // Simple coroutine (Execute CoroutineTest0 function after 1 second. Pass 2 arguments)
    Util.Coroutine(CoroutineTest0, 1, "test1", "test2");

    // Delete the children of the specified SceneObject
    print("delete obj count [pre]: " + script.deleteObj.getChildrenCount());
    Util.media.DeleteAllObjs(script.deleteObj, false);
    print("delete obj count [after]: " + script.deleteObj.getChildrenCount());

    // Get the pass
    print(Util.media.GetObjPath(script.pathObj));

    // How to use Timer
    // #1: First set the timer
    // #2: Update timer with timer.Update in Update event
    // Timer (#1)
    timer = new KirinUtil.Timer(5);

    // UI (Image, Text) fade
    // To use it, please import "Coroutine Module by Snap Inc." from Asset Library.
    // FadeUI.js must be attached to targetObj
    Util.media.FadeOutUI(script.fadeUI, 3, 5);

    // Audio (sample1)
    // [Note] Please try setting audio to script.demoAudio.
    //Util.media.AudioFadeInPlay(script.demoAudio, 0.5, 2, true);
}

function Update(e){
    // Timer (#2)
    if(!timer.Completed()){
        //print("timer: " + timer.CurrentTime());
        if (timer.Update(e.getDeltaTime())) print("Time end1");
    }
}

//----------------------------------
//  Coroutine code
//----------------------------------
function CoroutineTest0(str0, str1){
    print("Coroutine[0]: " + count+ ", " + str0 + ", " + str1);
    count++;
    Util.Coroutine(CoroutineTest1, 1);
}
function CoroutineTest1(){
    print("Coroutine[1]: " + count);
    count++;
    Util.Coroutine(CoroutineTest2, 3);
}
function CoroutineTest2(){
    print("Coroutine[2]: " + count);
    count++;

    // Audio (sample2)
    // [Note] Please try setting audio to script.demoAudio.
    //Util.media.AudioFadeOutStop(script.demoAudio, 2);
}

//----------------------------------
//  Common
//----------------------------------
Start();
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(Update);
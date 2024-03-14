// @input SceneObject cubeObj
// @input Asset.ObjectPrefab prefabObj
// @input SceneObject parentObj
// @input SceneObject structureObj
// @input SceneObject deleteObj
// @input SceneObject pathObj
// @input SceneObject fadeUI

var count = 0;
var timer;

function Start(){
    // Rotation
    global.KirinUtil.LocalRotation(script.cubeObj, new vec3(0,45,0));

    // Create Obj from prefab
    var obj = global.KirinUtil.media.CreateLocalObj(
        script.prefabObj, script.parentObj, "testObj", 
        new vec3(0,0,0), new vec3(0,0,0), new vec3(1,1,1)
    );
    print("CreateLocalObj: " + obj.name);

    // Get the SceneObject named [test]
    var objs = global.KirinUtil.media.GetAllObjs(script.structureObj, "test");
    for(var i = 0; i < objs.length;i++){
        print(objs[i].name);
    }

    // Simple coroutine (Execute CoroutineTest0 function after 1 second. Pass 2 arguments)
    global.KirinUtil.Coroutine(CoroutineTest0, 1, "test1", "test2");

    // Delete the children of the specified SceneObject
    print("delete obj count [pre]: " + script.deleteObj.getChildrenCount());
    global.KirinUtil.media.DeleteAllObjs(script.deleteObj, false);
    print("delete obj count [after]: " + script.deleteObj.getChildrenCount());

    // Get the pass
    print(global.KirinUtil.media.GetObjPath(script.pathObj));

    // Timer
    timer = new KirinUtil.Timer(5);

    // UI (Image, Text) fade
    // To use it, please import "Coroutine Module by Snap Inc." from Asset Library.
    // FadeUI.js must be attached to targetObj
    global.KirinUtil.media.FadeOutUI(script.fadeUI, 3, 5);
}

function Update(e){
    // タイマーのアップデート
    if(!timer.Completed()){
        //print("timer: " + timer.CurrentTime());
        if (timer.Update(e.getDeltaTime())) print("Time end1");
    }
}

//----------------------------------
//  コルーチン関連コード
//----------------------------------
function CoroutineTest0(str0, str1){
    print("Coroutine[0]: " + count+ ", " + str0 + ", " + str1);
    count++;
    global.KirinUtil.Coroutine(CoroutineTest1, 1);
}
function CoroutineTest1(){
    print("Coroutine[1]: " + count);
    count++;
    global.KirinUtil.Coroutine(CoroutineTest2, 3);
}
function CoroutineTest2(){
    print("Coroutine[2]: " + count);
    count++;
}

//----------------------------------
//  Common
//----------------------------------
Start();
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(Update);
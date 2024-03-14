var KirinUtil = {

    //----------------------------------
    //  Position
    //----------------------------------
    // #region Position
    // Position(SceneObject, vec3)
    Position: function(object, pos){
        object.getTransform().setWorldPosition(pos);
    },

    // LocalPosition(SceneObject, vec3)
    LocalPosition: function(object, pos){
        object.getTransform().setLocalPosition(pos);
    },

    // GetPosition(SceneObject)
    GetPosition: function(object){
        return object.getTransform().getWorldPosition();
    },

    // GetLocalPosition(SceneObject)
    GetLocalPosition: function(object){
        return object.getTransform().getLocalPosition();
    },
    // #endregion


    //----------------------------------
    //  Rotation
    //----------------------------------
    // #region Rotation
    // Rotation(SceneObject, vec3)
    Rotation: function(object, angle){
        object.getTransform().setWorldRotation(this.Deg2Quat(angle));
    },

    // LocalRotation(SceneObject, vec3)
    LocalRotation: function(object, angle){
        object.getTransform().setLocalRotation(this.Deg2Quat(angle));
    },

    // GetRotation(SceneObject)
    GetRotation: function(object){
        var qua = object.getTransform().getWorldRotation();
        return this.Quat2Deg(qua);
    },

    // GetLocalRotation(SceneObject)
    GetLocalRotation: function(object){
        var qua = object.getTransform().getLocalRotation();
        return this.Quat2Deg(qua);
    },
    // #endregion


    //----------------------------------
    //  Scale
    //----------------------------------
    // #region Scale
    // Scale(SceneObject, vec3)
    Scale: function(object, scale){
        object.getTransform().setWorldScale(scale);
    },

    // Scale(SceneObject, vec3)
    LocalScale: function(object, scale){
        object.getTransform().setLocalScale(scale);
    },

    // GetScale(SceneObject)
    GetScale: function(object){
        return object.getTransform().getWorldScale();
    },

    // GetLocalScale(SceneObject)
    GetLocalScale: function(object){
        return object.getTransform().getLocalScale();
    },
    // #endregion


    //----------------------------------
    //  Angle conversion
    //----------------------------------
    // #region Angle conversion

    // Convert Angle to Quaternion
    // Deg2Quat(vec3)
    Deg2Quat: function(angle){
        var radians = this.Deg2Rad(angle);
        var quaternion = quat.fromEulerAngles(radians.x, radians.y, radians.z);

        return quaternion;
    },

    // Convert Quaternion to Angle
    // [Note] The conversion from quaternions to Euler angles may not be unique, 
    // and can be inaccurate in certain situations due to an issue called gimbal lock.
    // Quat2Deg(Quaternion)
    Quat2Deg: function(quat) {
        var sinr_cosp = 2 * (quat.w * quat.x + quat.y * quat.z);
        var cosr_cosp = 1 - 2 * (quat.x * quat.x + quat.y * quat.y);
        var roll = Math.atan2(sinr_cosp, cosr_cosp);
    
        var sinp = 2 * (quat.w * quat.y - quat.z * quat.x);
        var pitch;
        if (Math.abs(sinp) >= 1) {
            pitch = Math.copySign(Math.PI / 2, sinp); // use 90 degrees if out of range
        } else {
            pitch = Math.asin(sinp);
        }
    
        var siny_cosp = 2 * (quat.w * quat.z + quat.x * quat.y);
        var cosy_cosp = 1 - 2 * (quat.y * quat.y + quat.z * quat.z);
        var yaw = Math.atan2(siny_cosp, cosy_cosp);

        var radian = new vec3(roll, pitch, yaw);
    
        return this.Rad2Deg(radian);
    },

    // Convert Angle(Deg) to Radian
    // Deg2Rad(vec3/float/int)
    Deg2Rad: function(degAngle){
        if (typeof degAngle === "number") {
            // For numbers
            return degAngle * (Math.PI / 180);
        } else if (degAngle instanceof vec3) {
            // For vec3, convert each component
            return degAngle.uniformScale(Math.PI / 180);
        } else {
            // For unexpected types
            console.error("Invalid type for degAngle.");
            return null;
        }
    },

    // Convert Radian to Angle(Deg)
    // Deg2Rad(vec3/float/int)
    Rad2Deg: function(radian){
        if (typeof radian === "number") {
            // For numbers
            return radian * (180 / Math.PI);
        } else if (radian instanceof vec3) {
            // For vec3, convert each component
            return new vec3(
                radian.x * (180 / Math.PI),
                radian.y * (180 / Math.PI),
                radian.z * (180 / Math.PI)
            );
        } else {
            // For unexpected types
            console.error("Invalid type for radian.");
            return null;
        }
    },
    // #endregion


    //----------------------------------
    //  Random
    //----------------------------------
    // #region Random
    // RandomRangeInt(int, int)
    RandomRangeInt: function(min, max){
        return Math.floor(Math.random() * (max - min) + min);
    },
    
    // RandomRangeInt(float, float)
    RandomRangeFloat: function(min, max){
        return Math.random() * (max - min) + min;
    },
    // #endregion


    //----------------------------------
    //  String search
    //----------------------------------
    // ExistStr(String, String)
    // orgStr:    Search source string
    // searchStr: string you want to search for
    ExistStr: function(orgStr, searchStr) {
        return orgStr.includes(searchStr);
    },


    //----------------------------------
    //  simple coroutine
    //----------------------------------
    // Coroutine(Action, float)
    // action: specify the function
    // time:   Specify time [seconds]
    // arg:    Argument [any type is fine]
    Coroutine: function(action, time, ...arg){

        var delayedEvent = script.createEvent("DelayedCallbackEvent");
        delayedEvent.bind(function() {
            action(...arg);
        });
        delayedEvent.reset(time);
    },


    //----------------------------------
    //  LookAt
    //----------------------------------
    //#region LookAt
    // LookAt(SceneObject, SceneObject)
    // myObj faces targetObj
    LookAt: function(targetObj, myObj){
        var targetPosition = targetObj.getTransform().getWorldPosition();
        var objectPosition = myObj.getTransform().getWorldPosition();
    
        // Rotate the object to face the targetPosition
        var direction = targetPosition.sub(objectPosition);
        var lookAtRotation = quat.lookAt(direction, vec3.up());
        myObj.getTransform().setWorldRotation(lookAtRotation);
    },
    GetLookAt: function(targetObj, myObj){
        var targetPosition = targetObj.getTransform().getWorldPosition();
        var objectPosition = myObj.getTransform().getWorldPosition();
    
        // Rotate the object to face the targetPosition
        var direction = targetPosition.sub(objectPosition);
        var lookAtRotation = quat.lookAt(direction, vec3.up());

        return this.Quat2Deg(lookAtRotation);
    },

    // LookAt(SceneObject, vec3)
    // myObj faces targetObj
    LookAtVec3: function(myObj, targetPos){
        var objectPosition = myObj.getTransform().getWorldPosition();
    
        // Rotate the object to face the targetPosition
        var direction = targetPos.sub(objectPosition);
        var lookAtRotation = quat.lookAt(direction, vec3.up());
        myObj.getTransform().setWorldRotation(lookAtRotation);
    },
    GetLookAtVec3: function(myObj, targetPos){
        var objectPosition = myObj.getTransform().getWorldPosition();
    
        // Rotate the object to face the targetPosition
        var direction = targetPos.sub(objectPosition);
        var lookAtRotation = quat.lookAt(direction, vec3.up());

        return this.Quat2Deg(lookAtRotation);
    },
    //#endregion


    //----------------------------------
    //  Distance
    //----------------------------------
    Vec3Distance: function(vec3a, vec3b) {
        var dx = vec3a.x - vec3b.x;
        var dy = vec3a.y - vec3b.y;
        var dz = vec3a.z - vec3b.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    },
    Obj3Distance: function(objA, objB) {
        var vec3a = this.GetPosition(objA);
        var vec3b = this.GetPosition(objB);

        return this.Vec3Distance(vec3a, vec3b);
    },

    Vec2Distance: function(vec2a, vec2b) {
        var dx = vec2a.x - vec2b.x;
        var dy = vec2a.y - vec2b.y;
        return Math.sqrt(dx * dx + dy * dy);
    },
    Obj2Distance: function(objA, objB) {
        var vec3a = this.GetPosition(objA);
        var vec3b = this.GetPosition(objB);
        var vec2a = new vec2(vec3a.x, vec3a.z);
        var vec2b = new vec2(vec3b.x, vec3b.z);

        return this.Vec2Distance(vec2a, vec2b);
    },


    //----------------------------------
    //  Clamp
    //----------------------------------
    Clamp: function(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },
}

// Add to global scope
global.KirinUtil = KirinUtil;
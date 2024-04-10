var KirinUtil = global.KirinUtil || {};

KirinUtil.KRNMedia = {

    //----------------------------------
    //  CreateObj
    //----------------------------------
    // #region CreateObj

    // CreateObj(SceneObject(Prefab), SceneObject(Scene), string, vec3, vec3(Angle), vec3))
    CreateObj: function(prefab, parentObj, name, pos, rotate, scale){
        var obj = prefab.instantiate(parentObj);
        obj.name = name;
        global.KirinUtil.Position(obj, pos);
        global.KirinUtil.Rotation(obj, rotate);
        global.KirinUtil.Scale(obj, scale);

        return obj;
    },

    // CreateLocalObj(SceneObject(Prefab), SceneObject(Scene), string, vec3, vec3(Angle), vec3))
    CreateLocalObj: function(prefab, parentObj, name, pos, rotate, scale){
        var obj = prefab.instantiate(parentObj);
        obj.name = name;
        global.KirinUtil.LocalPosition(obj, pos);
        global.KirinUtil.LocalRotation(obj, rotate);
        global.KirinUtil.LocalScale(obj, scale);

        return obj;
    },
    // #endregion


    //----------------------------------
    //  GetObjects
    //----------------------------------
    // #region GetObjects

    // Get all GameObjects under parent GameObject
    // If there is a searchStr, get all objects containing the specified name
    // GetAllObjs(SceneObject)
    // GetAllObjs(SceneObject, String)
    GetAllObjs: function(parentObj, searchStr) {
        var allChildren = [];
        GetChildren(parentObj, allChildren);

        // Get child element and add to array
        function　GetChildren(obj, allChildren) {
            var childrenCount = obj.getChildrenCount();
            // Ends if there are no child elements
            if (childrenCount == 0) {
                return;
            }
            for (var i = 0; i < childrenCount; i++) {
                var child = obj.getChild(i);

                if (searchStr === undefined){
                    allChildren.push(child);
                }else{
                    if(global.KirinUtil.ExistStr(child.name, searchStr)) 
                        allChildren.push(child);
                }
                GetChildren(child, allChildren); // Get child elements recursively
            }
        }
        return allChildren;
    },
    

    // Get only the Object directly under parentObj
    // If searchStr exists, get the Object containing the specified name
    // GetChildObjs(SceneObject)
    // GetChildObjs(SceneObject, String)
    GetChildObjs: function(parentObj, searchStr){
        var objs = [];

        for(var i = 0; i < parentObj.getChildrenCount();i++){
            var child = parentObj.getChild(i);

            if(searchStr === undefined){
                objs.push(child);
            }else{
                if(global.KirinUtil.ExistStr(child.name, searchStr)) 
                    objs.push(child);
            }
        }
        return objs;
    },

    // #endregion
    

    //----------------------------------
    //  Delete all Objects under the 
    //  parent GameObject
    //----------------------------------
    // #region Delete all Objects under the parent GameObject
    DeleteAllObjs: function(parentObj, delParent) {
        var objs = this.GetChildObjs(parentObj);
        for(var i = 0; i < objs.length;i++){
            objs[i].destroy();
        }

        if(delParent) parentObj.destroy();
    },
    // #endregion

    //----------------------------------
    //  Returns the path of the Object
    //----------------------------------
    // GetObjPath(SceneObject)
    GetObjPath: function(targetObj) {
        var path = targetObj.name;
        var parentObj = targetObj.getParent();
    
        while (parentObj !== null) {
            path = parentObj.name + "/" + path;
            parentObj = parentObj.getParent();
        }
    
        return path;
    },


    //----------------------------------
    //  Alpha
    //----------------------------------
    // UI alpha settings
    // [Condition] FadeUI.js must be attached to targetObj
    // SetAlphaUI(SceneObject, float)
    // targetObj: Specify the object whose alpha value you want to change
    // alpha: Alpha value (0~1)
    SetAlphaUI: function(targetObj, alpha){
        var fadeUI = targetObj.getComponent("Component.ScriptComponent");
        if(fadeUI && fadeUI.api.SetAlphaChildren){
            SetAlphaChildren(targetObj, alpha);
        }
    },


    //----------------------------------
    //  Fade
    //----------------------------------
    // #region UI fade in
    // [Condition] FadeUI.js must be attached to targetObj
    // FadeInUI(SceneObject, float, float)
    // targetObj: Specify the object whose alpha value you want to change
    // time: fade time
    // delay: Wait time before fading
    FadeInUI: function(targetObj, time, delay){
        var scripts = targetObj.getComponents("Component.ScriptComponent");

        for(var i = 0; i < scripts.length;i++){
            targetObj.enabled = true;
            if (scripts[i] && scripts[i].api.FadeInUI) {
                scripts[i].api.FadeInUI(targetObj, time, delay);
                break;
            }
        }
    },

    // UI fade out
    // [Condition] FadeUI.js must be attached to targetObj
    // FadeOutUI(SceneObject, float, float)
    // targetObj: Specify the object whose alpha value you want to change
    // time: fade time
    // delay: Wait time before fading
    FadeOutUI: function(targetObj, time, delay){
        var scripts = targetObj.getComponents("Component.ScriptComponent");
        for(var i = 0; i < scripts.length;i++){
            if (scripts[i] && scripts[i].api.FadeOutUI) {
                scripts[i].api.FadeOutUI(targetObj, time, delay);
                break;
            }
        }
    },
    // #endregion

    //----------------------------------
    //  HSV conversion
    //----------------------------------
    // #region Conversion from RGB to HSV
    Rgb2Hsv: function(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, v = max;

        let d = max - min;
        s = max == 0 ? 0 : d / max;

        if (max == min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [h, s, v];
    },

    // HSV to RGB conversion
    Hsv2Rgb:function(h, s, v) {
        let r, g, b;

        let i = Math.floor(h * 6);
        let f = h * 6 - i;
        let p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }

        return [r * 255, g * 255, b * 255];
    },
    // #endregion

    //----------------------------------
    //  Audio
    //----------------------------------
    // #region Audio
    // AudioPlay(Component.AudioComponent, float, bool)
    AudioPlay: function(audio, volume, isLoop){
        if(audio === null) return;

        if(volume != null) {
            if(volume < 0) volume = 0;
            audio.volume = volume;
        }

        if(isLoop != null){
            if(isLoop) audio.play(-1);
            else audio.play(1);
        }else{
            audio.play(1);
        }
    },

    // AudioFadeInPlay(Component.AudioComponent, float, float, bool)
    AudioFadeInPlay(audio, lastVolume, fadeTime, isLoop){
        if(audio === null) return;

        audio.fadeInTime = fadeTime;
        this.AudioPlay(audio, lastVolume, isLoop);
    },

    // AudioFadeOutStop(Component.AudioComponent, float)
    AudioFadeOutStop(audio, fadeTime){
        if(audio === null) return;
        audio.fadeOutTime = fadeTime;
        audio.stop(true);
    },
    // #endregion

};

// KRNMediaをKirinUtil.mediaに割り当て
KirinUtil.media = KirinUtil.KRNMedia;
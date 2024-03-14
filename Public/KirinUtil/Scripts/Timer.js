var KirinUtil = global.KirinUtil || {};

KirinUtil.Timer = function(limitTime) {
    this.limitTime = limitTime;
    this.currentTime = limitTime;
    this.isCompleted = false;
};

KirinUtil.Timer.prototype.Update = function(deltaTime) {
    if (this.isCompleted) return false;

    this.currentTime -= deltaTime;
    if (this.currentTime <= 0) {
        this.currentTime = 0;
        this.isCompleted = true;

        return true;
    }

    return false;
};

KirinUtil.Timer.prototype.CurrentTime = function() {
    return this.currentTime;
};

KirinUtil.Timer.prototype.Completed = function() {
    return this.isCompleted;
};

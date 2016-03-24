function Boss(level, position){
    AI_Entity.call(this, level, position, 90, 170);

    this.setRenderBox(160 * platformer.scale, 128 * platformer.scale);

    this.setColor('#D9828C');
    this.setCanDropCoin(false);

    this.setDeathParticle(Bone);
    this.setBloodRatio(0);

    this.setIdle(false);
    this.setHostile(true);
}

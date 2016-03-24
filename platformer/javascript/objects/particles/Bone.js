function Bone(level, position, direction){
    Blood.call(this, level, position, direction);

    this.setColor('#e3e1c7');
    this.setDimension(randomInt(12, 18), 6);
}

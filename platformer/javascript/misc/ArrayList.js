function ArrayList(){
    var index = 0;
    var list = {};

    this.add = function(item){
        list[index] = item;
        length++;
        index++;
    }

    this.delete = function(i){
        delete list[i];
    }

    this.getList = function(){
        return list;
    }

    this.getLength = function(){
        return Object.keys(list).length;
    }

    this.clean = function(){
        for(var k in list){
            if(list[k].dirty){
                delete list[k];
            }
        }
    }
}

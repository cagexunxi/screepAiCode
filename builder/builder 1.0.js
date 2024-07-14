var roleBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');  
            // 当 creep 是 building 状态（意味着在建造），但是没有能量时，转换为非建造状态，并设置为采集能量的行为
        }

        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {     
            creep.memory.building = true;                                                               
            creep.say('🚧 build');
            // 当 creep 不是 building 状态（意味着在采集能量），但是背包满格能量时，转换为建造状态
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) { 
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#778899' } });
                    // 如果有建造任务，则朝着第一个建造目标移动并尝试建造
                }
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                // 如果没有建造任务，就去采集能量（这里指的是第二个资源源头）
            }
        }
    }
};

module.exports = roleBuilder;

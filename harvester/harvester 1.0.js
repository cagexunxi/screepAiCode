var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var highestPriorityStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) ||
                        (structure.structureType === STRUCTURE_SPAWN &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) ||
                        (structure.structureType === STRUCTURE_TOWER &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) ||
                        (structure.structureType === STRUCTURE_STORAGE &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                }
            });

            if (highestPriorityStructure) {
                if (creep.transfer(highestPriorityStructure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(highestPriorityStructure, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }

    }
};

module.exports = roleHarvester;
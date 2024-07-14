var roleRestorer = {
    run: function (creep) {
        if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
        }

        if (!creep.memory.repairing && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.repairing = true;
            creep.say('🔧 repair');
        }

        if (creep.memory.repairing) {
            var rampartsToRepair = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_RAMPART && structure.hits < structure.hitsMax;
                }
            });

            var wallsToRepair = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_WALL && structure.hits < structure.hitsMax;
                }
            });

            var repairTarget = null;

            if (rampartsToRepair.length > 0) {
                repairTarget = creep.pos.findClosestByRange(rampartsToRepair);
            } else if (wallsToRepair.length > 0) {
                repairTarget = creep.pos.findClosestByRange(wallsToRepair);
            }

            if (repairTarget) {
                if (repairTarget.hits > 3000) {
                    var otherTargets = repairTarget.structureType == STRUCTURE_RAMPART ? rampartsToRepair : wallsToRepair;
                    var minHitTarget = _.min(otherTargets, 'hits');

                    if (minHitTarget.hits < repairTarget.hits) {
                        repairTarget = minHitTarget;
                    }
                }


                if (creep.repair(repairTarget) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairTarget, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                console.log('No repair target found.');
            }
        } else {
            // 获取能量的逻辑，移动到资源点的右下角
            var sources = creep.room.find(FIND_SOURCES);
            var secondSource = sources[1];

            if (secondSource && secondSource.energy > 0) {
                var harvestPosition = new RoomPosition(secondSource.pos.x + 1, secondSource.pos.y + 1, secondSource.room.name);
                if (creep.harvest(secondSource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(harvestPosition, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        }
    }
};

module.exports = roleRestorer;

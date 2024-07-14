var rolePorter = {
    /** @param {Creep} creep **/
    run: function (creep) {
        // 检查是否有任务分配给当前creep
        if (!creep.memory.task) {
            // 寻找最近的 container
            var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER &&
                        structure.store[RESOURCE_ENERGY] > 0;
                }
            });

            if (container) {
                creep.memory.task = {
                    targetId: container.id,
                    taskType: 'withdraw'
                };
            }
        }

        if (creep.memory.task) {
            var target = Game.getObjectById(creep.memory.task.targetId);
            if (target) {
                if (creep.memory.task.taskType === 'withdraw') {
                    if (creep.store[RESOURCE_ENERGY] === 0) {
                        if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                        }
                    } else {
                        var deliveryTargets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_EXTENSION ||
                                    structure.structureType == STRUCTURE_SPAWN ||
                                    structure.structureType == STRUCTURE_TOWER ||
                                    structure.structureType == STRUCTURE_STORAGE) &&
                                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                            }
                        });

                        if (deliveryTargets) {
                            if (creep.transfer(deliveryTargets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(deliveryTargets, { visualizePathStyle: { stroke: '#ffffff' } });
                            }
                        }
                    }
                }
            } else {
                creep.memory.task = null; // 重置任务状态，允许creep寻找新任务
            }
        }
    }
};

module.exports = rolePorter;

var rolePorter = {
    /** @param {Creep} creep **/
    run: function (creep) {
        // 检查是否有任务分配给当前 creep
        if (!creep.memory.task) {
            // 寻找离 creep 最近的 source
            var source = creep.pos.findClosestByRange(FIND_SOURCES);

            if (source) {
                // 寻找离 source 周围1格范围内的 container
                var container = source.pos.findInRange(FIND_STRUCTURES, 1, {
                    filter: (structure) => {
                        return structure.structureType === STRUCTURE_CONTAINER &&
                            structure.store[RESOURCE_ENERGY] > 0;
                    }
                })[0];

                // 如果找到 container，设置为任务
                if (container) {
                    creep.memory.task = {
                        targetId: container.id,
                        taskType: 'withdraw'
                    };
                }
            }
        }

        if (creep.memory.task) {
            var target = Game.getObjectById(creep.memory.task.targetId);
            if (target) {
                if (creep.memory.task.taskType === 'withdraw') {
                    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                        if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                        }
                    } else {
                        // 在这里进行能量传递
                        // 寻找优先级最高的建筑
                        var highestPriorityStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType === STRUCTURE_EXTENSION &&
                                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) ||
                                    (structure.structureType === STRUCTURE_SPAWN &&                                 
                                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) ||
                                    (structure.structureType === STRUCTURE_STORAGE &&
                                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                            }
                        });

                        if (highestPriorityStructure) {
                            if (creep.transfer(highestPriorityStructure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(highestPriorityStructure, { visualizePathStyle: { stroke: '#ffffff' } });
                            }
                        } else {
                            // 如果没有找到上述建筑，寻找其他 container
                            var otherContainers = creep.pos.findInRange(FIND_STRUCTURES, 1, {
                                filter: (structure) => {
                                    return structure.structureType === STRUCTURE_CONTAINER &&
                                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
                                        structure.id !== target.id; // 排除之前选中的 container
                                }
                            });

                            if (otherContainers.length > 0) {
                                if (creep.transfer(otherContainers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(otherContainers[0], { visualizePathStyle: { stroke: '#ffffff' } });
                                }
                            }
                        }
                    }
                }
            } else {
                creep.memory.task = null; // 重置任务状态，允许 creep 寻找新任务
            }
        }
    }
};

module.exports = rolePorter;

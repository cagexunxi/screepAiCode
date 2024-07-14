var roleGuardian = {
    /** @param {Creep} creep **/
    run: function(creep) {
        // 检查房间是否有 rampart 这类建筑
        var ramparts = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_RAMPART;
            }
        });

        // 选择一个可用的 rampart
        var availableRampart = this.findAvailableRampart(creep, ramparts);

        if (availableRampart) {
            // 如果周围有敌人，则攻击血量最低的敌人
            var enemies = availableRampart.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
            if (enemies.length > 0) {
                var targetEnemy = this.findWeakestEnemy(enemies);
                creep.attack(targetEnemy);
            } else {
                // 如果周围没有敌人，则待在 rampart 上
                if (!creep.pos.isEqualTo(availableRampart.pos)) {
                    creep.moveTo(availableRampart, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    },

    // 找到一个可用的 rampart，如果没有可用的则返回 null
    findAvailableRampart: function(creep, ramparts) {
        for (var i = 0; i < ramparts.length; i++) {
            // 检查 rampart 是否已经有 guard 驻守
            var guardingCreep = _.filter(Game.creeps, (c) => c.memory.role === 'guardian' && c.memory.targetRampart === ramparts[i].id);
            if (guardingCreep.length === 0) {
                // 没有 guard 驻守，返回该 rampart
                creep.memory.targetRampart = ramparts[i].id;
                return ramparts[i];
            }
        }
        // 没有可用的 rampart
        return null;
    },

    // 找到血量最低的敌人
    findWeakestEnemy: function(enemies) {
        var weakestEnemy = enemies[0];
        for (var i = 1; i < enemies.length; i++) {
            if (enemies[i].hits < weakestEnemy.hits) {
                weakestEnemy = enemies[i];
            }
        }
        return weakestEnemy;
    }
};

module.exports = roleGuardian;

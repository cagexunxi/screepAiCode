// 在 main 模块中引入各个角色模块
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleGuardian = require('role.guardian');
var rolePoter = require('role.poter');
var roleRestorer = require('role.restorer');
var roleTower = require('role.tower');  // 请替换为你实际的 tower 模块

module.exports.loop = function () {
    // 清理内存中不存在的 creep
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // 检查房间内是否有带有 ATTACK 身体部件的敌人
    var hostileAttackers = Game.spawns['Spawn1'].room.find(FIND_HOSTILE_CREEPS, {
        filter: (creep) => creep.getActiveBodyparts(ATTACK) > 0
    });

    // 定义各角色类型的身体部件
    var roleBodyParts = {
        'harvester': [WORK, CARRY, MOVE],
        'builder': [WORK, CARRY, MOVE],
        'upgrader': [WORK, CARRY, MOVE],
        'guardian': [TOUGH, ATTACK, MOVE], // 适量调整身体部件
        'poter': [CARRY, MOVE],             // 适量调整身体部件
        'restorer': [HEAL, MOVE]            // 适量调整身体部件
    };

    // 定义各角色类型的数量
    var roleCounts = {
        'harvester': 2,
        'builder': 1,
        'upgrader': 3,
        'guardian': 0, // 适量调整数量
        'poter': 0,    // 适量调整数量
        'restorer': 0  // 适量调整数量
    };

    // 如果有带有 ATTACK 身体部件的敌人，则生成相应数量的 guardian
    if (hostileAttackers.length > 0) {
        roleCounts['guardian'] = Math.min(hostileAttackers.length, roleCounts['guardian']);
    }

    // 优先保证 harvester 的数量
    var harvesterCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
    if (harvesterCount < roleCounts['harvester']) {
        var newName = 'Harvester' + Game.time;
        Game.spawns['Spawn1'].spawnCreep(roleBodyParts['harvester'], newName,
            { memory: { role: 'harvester' } });
    } else {
        // 生成其他角色
        for (var roleName in roleCounts) {
            var roleCount = _.filter(Game.creeps, (creep) => creep.memory.role == roleName).length;
            if (roleCount < roleCounts[roleName] && roleName !== 'harvester') {
                var newName = roleName.charAt(0).toUpperCase() + roleName.slice(1) + Game.time;
                Game.spawns['Spawn1'].spawnCreep(roleBodyParts[roleName], newName,
                    { memory: { role: roleName } });
            }
        }
    }

    // 如果 Spawn1 正在孵化，则在 Spawn 上显示正在孵化的角色角色
    if (Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            { align: 'left', opacity: 0.8 });
    }

    // 运行每个 creep 的角色模块
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        switch (creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'guardian':
                roleGuardian.run(creep);
                break;
            case 'poter':
                rolePoter.run(creep);
                break;
            case 'restorer':
                roleRestorer.run(creep);
                break;
            // 添加其他角色类型的处理
        }
    }

    // 检查房间内的 tower，并运行 roleTower 模块
    var towers = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_TOWER }
    });

    for (var i = 0; i < towers.length; i++) {
        roleTower.run(towers[i]);
    }
}

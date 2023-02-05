import Color = JVM.java$.awt$.Color;
import File = JVM.java$.io$.File;
import JavaBoolean = JVM.java$.lang$.Boolean;
import JavaFloat = JVM.java$.lang$.Float;
import JavaInteger = JVM.java$.lang$.Integer;
import JavaLong = JVM.java$.lang$.Long;
import JavaString = JVM.java$.lang$.String;
import System = JVM.java$.lang$.System;
import Thread = JVM.java$.lang$.Thread;
import StandardCharsets = JVM.java$.nio$.charset$.StandardCharsets;
import Files = JVM.java$.nio$.file$.Files;
import Paths = JVM.java$.nio$.file$.Paths;
import StandardOpenOption = JVM.java$.nio$.file$.StandardOpenOption;
import ArrayList = JVM.java$.util$.ArrayList;
import HashSet = JVM.java$.util$.HashSet;
import StringJoiner = JVM.java$.util$.StringJoiner;
import LiquidBounce = JVM.net$.ccbluex$.liquidbounce$.LiquidBounce;
import AttackEvent = JVM.net$.ccbluex$.liquidbounce$.event$.AttackEvent;
import EventState = JVM.net$.ccbluex$.liquidbounce$.event$.EventState;
import MotionEvent = JVM.net$.ccbluex$.liquidbounce$.event$.MotionEvent;
import PacketEvent = JVM.net$.ccbluex$.liquidbounce$.event$.PacketEvent;
import Render3DEvent = JVM.net$.ccbluex$.liquidbounce$.event$.Render3DEvent;
import WorldEvent = JVM.net$.ccbluex$.liquidbounce$.event$.WorldEvent;
import Command = JVM.net$.ccbluex$.liquidbounce$.features$.command$.Command;
import Module = JVM.net$.ccbluex$.liquidbounce$.features$.module$.Module;
import NoFriends = JVM.net$.ccbluex$.liquidbounce$.features$.module$.modules$.combat$.NoFriends;
import AntiBot = JVM.net$.ccbluex$.liquidbounce$.features$.module$.modules$.misc$.AntiBot;
import Teams = JVM.net$.ccbluex$.liquidbounce$.features$.module$.modules$.misc$.Teams;
import Script = JVM.net$.ccbluex$.liquidbounce$.script$.Script;
import ScriptModule = JVM.net$.ccbluex$.liquidbounce$.script$.api$.ScriptModule;
import EntityUtils = JVM.net$.ccbluex$.liquidbounce$.utils$.EntityUtils;
import Rotation = JVM.net$.ccbluex$.liquidbounce$.utils$.Rotation;
import RotationUtils = JVM.net$.ccbluex$.liquidbounce$.utils$.RotationUtils;
import ColorUtils = JVM.net$.ccbluex$.liquidbounce$.utils$.render$.ColorUtils;
import RenderUtils = JVM.net$.ccbluex$.liquidbounce$.utils$.render$.RenderUtils;
import MSTimer = JVM.net$.ccbluex$.liquidbounce$.utils$.timer$.MSTimer;
import BoolValue = JVM.net$.ccbluex$.liquidbounce$.value$.BoolValue;
import FloatValue = JVM.net$.ccbluex$.liquidbounce$.value$.FloatValue;
import IntegerValue = JVM.net$.ccbluex$.liquidbounce$.value$.IntegerValue;
import ListValue = JVM.net$.ccbluex$.liquidbounce$.value$.ListValue;
import TextValue = JVM.net$.ccbluex$.liquidbounce$.value$.TextValue;
import ItemRenderer = JVM.net$.minecraft$.client$.renderer$.ItemRenderer;
import GameSettings = JVM.net$.minecraft$.client$.settings$.GameSettings;
import KeyBinding = JVM.net$.minecraft$.client$.settings$.KeyBinding;
import Entity = JVM.net$.minecraft$.entity$.Entity;
import EntityLivingBase = JVM.net$.minecraft$.entity$.EntityLivingBase;
import EntityDragon = JVM.net$.minecraft$.entity$.boss$.EntityDragon;
import EntityGhast = JVM.net$.minecraft$.entity$.monster$.EntityGhast;
import EntityGolem = JVM.net$.minecraft$.entity$.monster$.EntityGolem;
import EntityMob = JVM.net$.minecraft$.entity$.monster$.EntityMob;
import EntitySlime = JVM.net$.minecraft$.entity$.monster$.EntitySlime;
import EntityAnimal = JVM.net$.minecraft$.entity$.passive$.EntityAnimal;
import EntityBat = JVM.net$.minecraft$.entity$.passive$.EntityBat;
import EntitySquid = JVM.net$.minecraft$.entity$.passive$.EntitySquid;
import EntityVillager = JVM.net$.minecraft$.entity$.passive$.EntityVillager;
import EntityPlayer = JVM.net$.minecraft$.entity$.player$.EntityPlayer;
import EntityLargeFireball = JVM.net$.minecraft$.entity$.projectile$.EntityLargeFireball;
import ItemSword = JVM.net$.minecraft$.item$.ItemSword;
import C02PacketUseEntity = JVM.net$.minecraft$.network$.play$.client$.C02PacketUseEntity;
import C03PacketPlayer = JVM.net$.minecraft$.network$.play$.client$.C03PacketPlayer;
import C07PacketPlayerDigging = JVM.net$.minecraft$.network$.play$.client$.C07PacketPlayerDigging;
import C08PacketPlayerBlockPlacement = JVM.net$.minecraft$.network$.play$.client$.C08PacketPlayerBlockPlacement;
import S03PacketTimeUpdate = JVM.net$.minecraft$.network$.play$.server$.S03PacketTimeUpdate;
import S14PacketEntity = JVM.net$.minecraft$.network$.play$.server$.S14PacketEntity;
import AxisAlignedBB = JVM.net$.minecraft$.util$.AxisAlignedBB;
import BlockPos = JVM.net$.minecraft$.util$.BlockPos;
import EnumFacing = JVM.net$.minecraft$.util$.EnumFacing;
import Vec3 = JVM.net$.minecraft$.util$.Vec3;

const scriptName = "mumyHackAura";
const scriptVersion = 0.4;
const scriptAuthor = "mumy++";

class mumyHackAura {

    public readonly valuesContainer = new mumyHackAura.ValuesContainer();

    private readonly setting = {
        float: (name: string, def: number, min: number, max: number, object: object = {}) => {
            return new _AdaptedValue<number, JavaFloat>(new (Java.extend(FloatValue, object))(name, def, min, max));
        },
        integer: (name: string, def: number, min: number, max: number, object: object = {}) => {
            return new _AdaptedValue<number, JavaInteger>(new (Java.extend(IntegerValue, object))(name, def, min, max));
        },
        boolean: (name: string, def: boolean, object: object = {}) => {
            return new _AdaptedValue<boolean, JavaBoolean>(new (Java.extend(BoolValue, object))(name, def));
        },
        list: (name: string, values: string[], def: string, object: object = {}) => {
            return new _AdaptedValue<string, JavaString>(new (Java.extend(ListValue, object))(name, values, def));
        },
        text: (name: string, def: string, object: object = {}) => {
            return new _AdaptedValue<string, JavaString>(new (Java.extend(TextValue, object))(name, def));
        }
    };

    private readonly settings = {
        maxDelay: this.setting.float("MaxDelay", 80, 0, 1000, {
            onChanged: (oldValue: number, newValue: number) => {
                const v = this.settings.minDelay.get();
                if (newValue < v) {
                    this.settings.maxDelay.set(v);
                }
            }
        }),
        minDelay: this.setting.float("MinDelay", 50, 0, 1000, {
            onChanged: (oldValue: number, newValue: number) => {
                const v = this.settings.maxDelay.get();
                if (newValue > v) {
                    this.settings.minDelay.set(v);
                }
            }
        }),
        hurtTime: this.setting.integer("HurtTime", 20, 0, 20),
        range: this.setting.float("Range", 6, 0, 20, {
            onChanged: (oldValue: number, newValue: number) => {
                const v = this.settings.throughWallsRange.get();
                if (newValue < v) {
                    this.settings.range.set(v);
                }
            }
        }),
        blockRange: this.setting.float("BlockRange", 8, 0, 20, {
            onChanged: (oldValue: number, newValue: number) => {
                const v = this.settings.range.get();
                if (newValue < v) {
                    this.settings.blockRange.set(v);
                }
            }
        }),
        throughWallsRange: this.setting.float("ThroughWallsRange", 3, 0, 20, {
            onChanged: (oldValue: number, newValue: number) => {
                const v = this.settings.range.get();
                if (newValue > v) {
                    this.settings.throughWallsRange.set(v);
                }
            }
        }),
        targetMode: this.setting.list("TargetMode", ["Single", "Switch", "Multi"], "Single"),
        priority: this.setting.list("Priority", ["Armor", "Direction", "Distance", "Health", "HurtTime", "LivingTime"], "HurtTime"),
        limitedTargets: this.setting.integer("LimitedTargets", 3, 0, 100),
        switchDelay: this.setting.integer("SwitchDelay", 500, 0, 1000),
        attackTiming: this.setting.integer("AttackTiming", 2, 1, 15),
        attackPackets: this.setting.integer("AttackPackets", 1, 1, 50),
        autoBlock: this.setting.list("AutoBlock", ["Off", "Vanilla", "Packet"], "Packet"),
        predictSize: this.setting.float("PredictSize", 1, 0, 5),
        limitedPredictPing: this.setting.integer("LimitedPredictPing", 200, 0, 1000, {
            onChanged: (oldValue: number, newValue: number) => {
                const v = this.settings.limitedPredictPing.get();
                if (newValue > v) {
                    this.settings.limitedPredictPing.set(v);
                }
            }
        }),
        referencePredictPing: this.setting.float("ReferencePredictPing", 50, 0, 1000),
        limitedNetworkPing: this.setting.integer("LimitedNetworkPing", 150, 0, 1000),
        hitFireball: this.setting.boolean("HitFireball", false),
        rotation: this.setting.list("Rotation", ["Off", "Angle", "Distance"], "Angle"),
        hitBoxHorizontally: this.setting.float("HitBoxHorizontally", 1, 0, 1),
        hitBoxVertically: this.setting.float("HitBoxVertically", 1, 0, 1),
        silentRotation: this.setting.boolean("SilentRotation", true),
        rotationAnimation: this.setting.boolean("RotationAnimation", true)
    };

    private readonly prevTargetSet = new HashSet<JavaInteger>();
    private targetList = <Entity[]>[];
    private target = <Entity | null>null;

    private readonly switchTimer = new MSTimer();

    private readonly attackTimer = new mumyHackAura.NanoTimer();
    private attackDelay = 0;

    private readonly serverPacketsTimer = new MSTimer();

    private readonly waitStateColor = new Color(126, 126, 126, 70);
    private readonly attackStateColor = new Color(37, 126, 255, 70);

    private readonly autoBlock = new mumyHackAura.AutoBlock();

    public getName() {
        return "mumyHackAura";
    }

    public getDescription() {
        return "mumyHackAura-Module, By-mumy";
    }

    public getCategory() {
        return "Misc";
    }

    public onEnable() {
        this.prevTargetSet.clear();
        this.targetList = [];
        this.target = null;
    }

    public onDisable() {
        this.autoBlock.reset();
        this.onEnable();
    }

    public onUpdate() {
        const riding = mc.thePlayer!.isRiding();
        if (riding) {
            this.update();
        } if (riding || (this.settings.attackTiming.get() & 4) !== 0) {
            this.runAttack();
        }
    }

    public onMotion(event: MotionEvent) {
        const eventState = event.getEventState();
        if (eventState === EventState.PRE) {
            this.update();
        } if ((this.settings.attackTiming.get() & (eventState === EventState.PRE ? 1 : 2)) !== 0) {
            this.runAttack();
        }
    }

    public onRender3D(event: Render3DEvent) {
        if ((this.settings.attackTiming.get() & 8) !== 0) {
            this.runAttack();
        } if (this.targetList.length !== 0) {
            if (this.settings.targetMode.get() === "Multi") {
                let count = 0;
                const limit = this.settings.limitedTargets.get();
                const range = this.settings.range.get();
                const hurtTime = this.settings.hurtTime.get();
                for (let entity of this.targetList) {
                    RenderUtils.drawPlatform(entity, !(entity.hurtResistantTime > hurtTime) && this.getDistanceToHitEntity(entity) < range && !(limit > 0 && ++count > limit) ? this.attackStateColor : this.waitStateColor);
                }
            } else {
                for (let entity of this.targetList) {
                    RenderUtils.drawPlatform(entity, entity === this.target && !(entity.hurtResistantTime > this.settings.hurtTime.get()) ? this.attackStateColor : this.waitStateColor);
                }
            }
        }
    }

    public onPacket(event: PacketEvent) {
        const packet = event.getPacket();
        if (packet instanceof S14PacketEntity) {
            this.serverPacketsTimer.reset();
        } else if (packet instanceof C03PacketPlayer && this.settings.rotationAnimation.get()) {
            const player = mc.thePlayer!;
            const rotationYaw = RotationUtils.serverRotation?.getYaw() ?? 0;
            if (rotationYaw !== player.rotationYaw) {
                player.rotationYawHead = rotationYaw;
            }
        }
    }

    public onWorld(event: WorldEvent) {
        moduleManager.getModule(this.getName())!.setState(false);
    }

    public addValues(values: _ValueAdapter) {
        const settings = <{ [key: string]: _AdaptedValue<unknown, unknown> }>this.settings;
        this.valuesContainer.init(settings);
        for (let i in settings) {
            values.add(settings[i]);
        }
    }

    private update() {
        this.updateTarget();
        if (this.targetList.length === 0) {
            this.autoBlock.reset();
            return;
        } if (this.target == null && this.settings.autoBlock.get() !== "Off") {
            this.autoBlock.checkAndStart();
        }
        this.autoBlock.checkAndUpdate();
    }

    private updateTarget() {
        const prevTarget = this.target;
        this.targetList = [];
        this.target = null;
        const limitedTargets = this.settings.limitedTargets.get();
        if (limitedTargets > 0 && !(this.prevTargetSet.size() < limitedTargets)) {
            this.prevTargetSet.clear();
        }
        const limitedNetworkPing = this.settings.limitedNetworkPing.get();
        if (limitedNetworkPing > 0 && this.serverPacketsTimer.hasTimePassed(limitedNetworkPing)) {
            return;
        }
        const player = mc.thePlayer!;
        const entityList = <Entity[]>Java.from(mc.theWorld!.loadedEntityList!);
        const switchMode = this.settings.targetMode.get() === "Switch";
        const hurtTime = this.settings.hurtTime.get();
        const range = this.settings.range.get();
        const blockRange = this.settings.blockRange.get();
        const throughWallsRange = this.settings.throughWallsRange.get();
        const maxRange = Math.max(range, blockRange);
        for (let entity of entityList) {
            if (this.isEnemy(entity) && !(switchMode && this.prevTargetSet.contains(JavaInteger.valueOf(entity.getEntityId()))) && this.getDistanceToHitEntity(entity) < (player.canEntityBeSeen(entity) ? maxRange : throughWallsRange)) {
                this.targetList.push(entity);
            }
        } if (this.targetList.length === 0) {
            if (switchMode && !this.prevTargetSet.isEmpty()) {
                this.prevTargetSet.clear();
                this.updateTarget();
            }
            return;
        }
        this.targetList.sort((a, b) => this.getDistanceToHitEntity(a) - this.getDistanceToHitEntity(b));
        switch (this.settings.priority.get()) {
            case "Armor":
                this.targetList.sort((a, b) => a instanceof EntityLivingBase && b instanceof EntityLivingBase ? a.getTotalArmorValue() - b.getTotalArmorValue() : 0);
                break;
            case "Direction":
                this.targetList.sort((a, b) => RotationUtils.getRotationDifference(a) - RotationUtils.getRotationDifference(b));
                break;
            case "Health":
                this.targetList.sort((a, b) => a instanceof EntityLivingBase && b instanceof EntityLivingBase ? a.getHealth() - b.getHealth() : 0);
                break;
            case "HurtTime":
                this.targetList.sort((a, b) => a.hurtResistantTime - b.hurtResistantTime);
                break;
            case "LivingTime":
                this.targetList.sort((a, b) => b.ticksExisted - a.ticksExisted);
                break;
        } if (prevTarget != null && switchMode && this.targetList.indexOf(prevTarget) !== -1 && this.getDistanceToHitEntity(prevTarget) < range) {
            this.target = prevTarget;
            this.updateRotation(this.getHitEntity(prevTarget));
            return;
        } for (let ignoreHurtTime = false;;) {
            for (let entity of this.targetList) {
                if ((ignoreHurtTime || !(entity.hurtResistantTime > hurtTime)) && this.getDistanceToHitEntity(entity) < range) {
                    this.target = entity;
                    this.updateRotation(this.getHitEntity(entity));
                    return;
                }
            } if (ignoreHurtTime) {
                break;
            }
            ignoreHurtTime = true;
        } if (switchMode && !this.prevTargetSet.isEmpty()) {
            this.prevTargetSet.clear();
            this.updateTarget();
        }
    }

    private isEnemy(entity: Entity) {

        if (this.settings.hitFireball.get() && entity instanceof EntityLargeFireball) {
            return true;
        } if (entity instanceof EntityLivingBase && (EntityUtils.targetDead || entity.isEntityAlive() && entity.getHealth() > 0) && entity !== mc.thePlayer) {
            if (!EntityUtils.targetInvisible && entity.isInvisible()) {
                return false
            } if (EntityUtils.targetPlayer && entity instanceof EntityPlayer) {
                if (entity.isSpectator() || AntiBot.isBot(entity)) {
                    return false
                } if (isFriend(entity) && !LiquidBounce.moduleManager!.getModule(NoFriends.class)!.getState()) {
                    return false;
                }
                const teams = <Teams>LiquidBounce.moduleManager!.getModule(Teams.class)!;
                return !teams.getState() || !teams.isInYourTeam(entity);
            }
            return EntityUtils.targetMobs && isMob(entity) || EntityUtils.targetAnimals && isAnimal(entity);
        }
        return false;

        function isAnimal(entity: Entity) {
            return entity instanceof EntityAnimal || entity instanceof EntitySquid || entity instanceof EntityGolem || entity instanceof EntityBat;
        }

        function isFriend(entity: Entity) {
            return entity instanceof EntityPlayer && entity.getName() != null && LiquidBounce.fileManager!.friendsConfig!.isFriend(ColorUtils.stripColor(entity.getName()));
        }

        function isMob(entity: Entity) {
            return entity instanceof EntityMob || entity instanceof EntityVillager || entity instanceof EntitySlime || entity instanceof EntityGhast || entity instanceof EntityDragon;
        }

    }

    private runAttack() {
        if (this.target == null || !this.attackTimer.hasTimePassed(this.attackDelay) || this.target.hurtResistantTime > this.settings.hurtTime.get()) {
            return;
        } if (this.settings.autoBlock.get() !== "Vanilla") {
            this.autoBlock.checkAndStop();
        }
        const mode = this.settings.targetMode.get();
        if (mode === "Multi") {
            let count = 0;
            const limit = this.settings.limitedTargets.get();
            const range = this.settings.range.get();
            const hurtTime = this.settings.hurtTime.get();
            for (let entity of this.targetList) {
                if (entity.hurtResistantTime > hurtTime && this.getDistanceToHitEntity(entity) < range) {
                    this.attackEntity(entity);
                    if (limit > 0 && !(++count < limit)) {
                        break;
                    }
                }
            }
        } else {
            this.attackEntity(this.target);
            if (mode === "Switch" && this.switchTimer.hasTimePassed(this.settings.switchDelay.get())) {
                this.prevTargetSet.add(JavaInteger.valueOf(this.target.getEntityId()));
                this.switchTimer.reset();
            }
        } if (this.settings.autoBlock.get() !== "Off" || this.autoBlock.isPlayerBlocking()) {
            this.autoBlock.checkAndStart();
        }
        this.attackTimer.reset();
        const maxDelay = this.settings.maxDelay.get();
        const minDelay = this.settings.minDelay.get();
        this.attackDelay = 1000000 * (minDelay + (maxDelay - minDelay) * Math.random()); //2023.2.2[start]: 100days~
    }

    private attackEntity(entity: Entity) {
        LiquidBounce.eventManager!.callEvent(new AttackEvent(entity));
        mc.thePlayer!.swingItem();
        const packets = this.settings.attackPackets.get();
        for (let i = 0; i < packets; ++i) {
            mc.getNetHandler()!.addToSendQueue(new C02PacketUseEntity(this.getHitEntity(entity), C02PacketUseEntity.Action.ATTACK));
        }
    }

    private getHitEntity(entity: Entity) {
        let lastEntity = <Entity | null>null;
        if (entity instanceof EntityDragon) {
            let lastDistance = 0;
            for (let part of entity.getParts()!) {
                const distance = this.getDistanceToEntity(part);
                if (lastEntity == null || distance < lastDistance) {
                    lastEntity = part;
                    lastDistance = distance;
                }
            }
        }
        return lastEntity ?? entity;
    }

    private updateRotation(entity: Entity) {
        if (this.settings.rotation.get() === "Off") {
            return;
        }
        const collisionBorderSize = entity.getCollisionBorderSize() * 0.95;
        let bb = entity.getEntityBoundingBox()!.expand(collisionBorderSize, collisionBorderSize, collisionBorderSize)!;
        const horizontally = Math.max(0, Math.min(this.settings.hitBoxHorizontally.get(), 1));
        const vertically = Math.max(0, Math.min(this.settings.hitBoxVertically.get(), 1));
        if (horizontally !== 1 || vertically !== 1) {
            const [xHalf, yHalf, zHalf] = [(bb.maxX - bb.minX) / 2, (bb.maxY - bb.minY) / 2, (bb.maxZ - bb.minZ) / 2];
            const yCenter = (bb.maxY + bb.minY) / 2;
            bb = new AxisAlignedBB(entity.posX - xHalf * horizontally, yCenter - yHalf * vertically, entity.posZ - zHalf * horizontally, entity.posX + xHalf * horizontally, yCenter + yHalf * vertically, entity.posZ + zHalf * horizontally);
        }
        let finalRotation = <Rotation | null>null;
        switch (this.settings.rotation.get()) {
            case "Angle": {
                let lastDifference = 0;
                for (let sX = 0; sX < 8; ++sX) {
                    for (let sY = 0; sY < 10; ++sY) {
                        for (let sZ = 0; sZ < 8; ++sZ) {
                            const vec = new Vec3(bb.minX + (bb.maxX - bb.minX) * sX / 7, bb.minY + (bb.maxY - bb.minY) * sY / 9, bb.minZ + (bb.maxZ - bb.minZ) * sZ / 7);
                            const rotation = RotationUtils.toRotation(vec, false)!;
                            const difference = RotationUtils.getRotationDifference(rotation);
                            if (finalRotation == null || difference < lastDifference) {
                                finalRotation = rotation;
                                lastDifference = difference;
                            }
                        }
                    }
                }
                break;
            }
            case "Distance": {
                const player = mc.thePlayer!;
                let [xCenter, yCenter, zCenter] = [Math.max(bb.minX, Math.min(player.posX, bb.maxX)), Math.max(bb.minY, Math.min(player.posY + player.getEyeHeight(), bb.maxY)), Math.max(bb.minZ, Math.min(player.posZ, bb.maxZ))];
                if (xCenter === player.posX && zCenter === player.posZ) {
                    xCenter = entity.posX;
                    zCenter = entity.posZ;
                }
                finalRotation = RotationUtils.toRotation(new Vec3(xCenter, yCenter, zCenter), false)!;
                break;
            }
        } if (finalRotation != null) {
            this.smoothRotation(finalRotation);
        }
    }

    private smoothRotation(rotation: Rotation) {
        const mouseSensitivity = mc.gameSettings!.mouseSensitivity;
        const limitedRotation = RotationUtils.limitAngleChange(RotationUtils.serverRotation, rotation, 180)!;
        mc.gameSettings!.mouseSensitivity = -0.33333329;
        if (this.settings.silentRotation.get()) {
            RotationUtils.setTargetRotation(limitedRotation, 0);
        } else {
            limitedRotation.toPlayer(mc.thePlayer);
        }
        mc.gameSettings!.mouseSensitivity = mouseSensitivity;
    }

    private getDistanceToEntity(entity: Entity) {
        const player = mc.thePlayer!;
        const netHandler = mc.getNetHandler()!;
        const { posX: playerPosX, posY: playerPosY, posZ: playerPosZ } = player;
        const { posX: entityPosX, posY: entityPosY, posZ: entityPosZ } = entity;
        const { prevPosX: playerPrevPosX, prevPosY: playerPrevPosY, prevPosZ: playerPrevPosZ } = player;
        const { prevPosX: entityPrevPosX, prevPosY: entityPrevPosY, prevPosZ: entityPrevPosZ } = entity;
        const predictValue = Math.max(0, this.settings.predictSize.get() / 2);
        let playerPredictValue = predictValue;
        let entityPredictValue = predictValue;
        const referencePredictPing = this.settings.referencePredictPing.get();
        if (referencePredictPing > 0) {
            const playerPing = Math.max(0, Math.min(netHandler.getPlayerInfo(mc.thePlayer!.getUniqueID())?.getResponseTime() ?? 0, this.settings.limitedPredictPing.get()));
            if (playerPing > 0) {
                playerPredictValue *= playerPing / referencePredictPing;
            } if (entity instanceof EntityPlayer) {
                const entityPing = Math.max(0, Math.min(netHandler.getPlayerInfo(entity.getUniqueID())?.getResponseTime() ?? 0, this.settings.limitedPredictPing.get()));
                if (entityPing > 0) {
                    entityPredictValue *= entityPing / referencePredictPing;
                }
            }
        }
        const playerMoveVec = new Vec3(playerPosX - playerPrevPosX, playerPosY - playerPrevPosY, playerPosZ - playerPrevPosZ);
        const entityMoveVec = new Vec3(entityPosX - entityPrevPosX, entityPosY - entityPrevPosY, entityPosZ - entityPrevPosZ);
        const playerMoveSpeed = Math.sqrt(playerMoveVec.xCoord ** 2 + playerMoveVec.yCoord ** 2 + playerMoveVec.zCoord ** 2) * playerPredictValue;
        const entityMoveSpeed = Math.sqrt(entityMoveVec.xCoord ** 2 + entityMoveVec.yCoord ** 2 + entityMoveVec.zCoord ** 2) * entityPredictValue;
        const playerPredictVec = new Vec3(player.posX + playerMoveVec.xCoord * playerPredictValue, player.posY + playerMoveVec.yCoord * playerPredictValue, player.posZ + playerMoveVec.zCoord * playerPredictValue);
        const entityPredictVec = new Vec3(entity.posX + entityMoveVec.xCoord * entityPredictValue, entity.posY + entityMoveVec.yCoord * entityPredictValue, entity.posZ + entityMoveVec.zCoord * entityPredictValue);
        const predictDistance = Math.sqrt((entityPredictVec.xCoord - playerPredictVec.xCoord) ** 2 + (entityPredictVec.yCoord - playerPredictVec.yCoord) ** 2 + (entityPredictVec.zCoord - playerPredictVec.zCoord) ** 2);
        return Math.max(0, predictDistance - entityMoveSpeed - playerMoveSpeed);
    }

    private getDistanceToHitEntity(entity: Entity) {
        if (entity instanceof EntityDragon) {
            let lastEntity = <Entity | null>null;
            let lastDistance = 0;
            for (let part of entity.getParts()!) {
                const distance = this.getDistanceToEntity(part);
                if (lastEntity == null || distance < lastDistance) {
                    lastEntity = part;
                    lastDistance = distance;
                }
            } if (lastEntity != null) {
                return lastDistance;
            }
        }
        return this.getDistanceToEntity(entity);
    }

    private static AutoBlock = class AutoBlock {

        private static readonly blockPos = new BlockPos(-1, -1, -1);
        public change = false;
        public status = false;

        public start() {
            this.change = true;
            this.status = true;
            const player = mc.thePlayer!;
            player.setItemInUse(player.inventory!.getCurrentItem(), 51213);
            mc.getNetHandler()!.addToSendQueue(new C08PacketPlayerBlockPlacement(AutoBlock.blockPos, 255, player.inventory?.getCurrentItem(), 0, 0, 0));
            KeyBinding.setKeyBindState(mc.gameSettings!.keyBindUseItem!.getKeyCode(), true);
        }

        public stop() {
            this.change = true;
            this.status = false;
            mc.getNetHandler()!.addToSendQueue(new C07PacketPlayerDigging(C07PacketPlayerDigging.Action.RELEASE_USE_ITEM, AutoBlock.blockPos, EnumFacing.DOWN));
            mc.thePlayer!.stopUsingItem();
            KeyBinding.setKeyBindState(mc.gameSettings!.keyBindUseItem!.getKeyCode(), false);
        }

        public checkAndStart() {
            if (!mc.thePlayer!.isBlocking() && AutoBlock.itemIsSword()) {
                this.start();
            }
        }

        public checkAndStop() {
            if (mc.thePlayer!.isBlocking()) {
                this.stop();
            }
        }

        public checkAndUpdate() {
            if (this.status && !AutoBlock.itemIsSword() && !GameSettings.isKeyDown(mc.gameSettings!.keyBindUseItem)) {
                this.stop();
            }
        }

        public reset() {
            if (this.change && this.status && !GameSettings.isKeyDown(mc.gameSettings!.keyBindUseItem)) {
                this.checkAndStop();
            }
        }

        public isPlayerBlocking() {
            return GameSettings.isKeyDown(mc.gameSettings!.keyBindUseItem) && AutoBlock.itemIsSword();
        }

        private static itemIsSword() {
            return mc.thePlayer?.getHeldItem()?.getItem() instanceof ItemSword;
        }

    }

    public static ValuesContainer = class ValuesContainer {

        private static readonly directory = new File(LiquidBounce.fileManager!.dir, `scripts\\lib\\mumyScript\\${scriptName} ${scriptVersion}`);
        private static readonly jsonFile = new File(ValuesContainer.directory, `values.json`);
        private static readonly containers = ["C0", "C1", "C2", "C3"];
        private defaultValues = <{ [key: string]: unknown }>{};
        private settingsObject = <{ [key: string]: _AdaptedValue<unknown, unknown> | null }>{};
        private containerSetting = this.getContainerSetting();

        public init(settingsObject: { [key: string]: _AdaptedValue<unknown, unknown> | null }) {
            for (let setting in settingsObject) {
                this.defaultValues[setting] = settingsObject[setting]!.get();
            }
            this.settingsObject = settingsObject;
            this.settingsObject.container = this.containerSetting;
        }

        private getContainerSetting() {
            return new _AdaptedValue<string, JavaString>(new (Java.extend(ListValue, {
                onChanged: (oldValue: string, newValue: string) => {
                    if (oldValue !== newValue) {
                        this.writeContainer(oldValue, this.readSettings());
                        this.writeSettings(this.readContainer(newValue));
                    }
                }
            }))("Container", ValuesContainer.containers, ValuesContainer.containers[0]));
        }

        public getOverrideObject(object: any) {
            if (object == null) {
                return {
                    onChanged: this.onSettingChanged
                };
            } if (typeof object.onChanged === "function") {
                object.onChanged = (oldValue: number, newValue: number) => {
                    object.onChanged(oldValue, newValue);
                    this.onSettingChanged(oldValue, newValue);
                }
            }
            return <object>object;
        }

        private onSettingChanged(oldValue: unknown, newValue: unknown) {
            if (oldValue !== newValue) {
                this.writeContainer((<_AdaptedValue<string, JavaString>>this.settingsObject!.container).get(), this.readSettings());
            }
        }

        private static check() {
            if (!this.directory.exists() || !this.directory.isDirectory()) {
                this.directory.mkdirs();
            } if (!this.jsonFile.exists() || !this.jsonFile.isFile()) {
                this.jsonFile.createNewFile();
            }
        }

        private readSettings() {
            const object = <{ [key: string]: unknown }>{};
            for (let key in this.settingsObject) {
                if (key === "container") {
                    continue;
                }
                object[key] = this.settingsObject[key]!.get();
            }
            return object;
        }
        
        private writeSettings(object: { [key: string]: unknown }) {
            for (let next = false;;) {
                for (let key in object) {
                    if (key === "container") {
                        continue;
                    }
                    const setting = this.settingsObject[key]?.getValue();
                    if (setting == null) {
                        continue;
                    }
                    const value = <any>object[key];
                    try {
                        if (next) {
                            if (setting instanceof BoolValue) {
                                setting.set(<JavaBoolean>JavaBoolean.valueOf(value));
                            } else if (setting instanceof FloatValue) {
                                setting.set(<JavaFloat>JavaFloat.valueOf(value));
                            } else if (setting instanceof IntegerValue) {
                                setting.set(<JavaInteger>JavaInteger.valueOf(value));
                            } else if (setting instanceof ListValue || setting instanceof TextValue) {
                                setting.set(<JavaString>JavaString.valueOf(value));
                            }
                        } else {
                            if (setting instanceof BoolValue) {
                                setting.changeValue(<JavaBoolean>JavaBoolean.valueOf(value));
                            } else if (setting instanceof FloatValue) {
                                setting.changeValue(<JavaFloat>JavaFloat.valueOf(value));
                            } else if (setting instanceof IntegerValue) {
                                setting.changeValue(<JavaInteger>JavaInteger.valueOf(value));
                            } else if (setting instanceof ListValue || setting instanceof TextValue) {
                                setting.changeValue(<JavaString>JavaString.valueOf(value));
                            }
                        }
                    } catch (err) {}
                } if (next) {
                    break;
                }
                next = true;
            }
        }

        private readContainer(container: string) {
            const jsonObject = ValuesContainer.readJSONObject();
            return <{ [key: string]: unknown }>jsonObject[container] ?? this.defaultValues;
        }

        private writeContainer(container: string, object: { [key: string]: unknown }) {
            const jsonObject = ValuesContainer.readJSONObject();
            jsonObject[container] = object;
            ValuesContainer.writeJSONObject(jsonObject);
        }

        private static readJSONObject(jsonFile: File = this.jsonFile) {
            this.check();
            try {
                return <{ [key: string]: unknown }>JSON.parse(<any>new JavaString(Files.readAllBytes(Paths.get(jsonFile.toURI())), StandardCharsets.UTF_8));
            } catch (err) {
                return {};
            }
        }

        private static writeJSONObject(object: { [key: string]: unknown }, jsonFile: File = this.jsonFile) {
            this.check();
            try {
                Files.write(Paths.get(jsonFile.toURI()), new JavaString(JSON.stringify(this.sortObjectKey(object), null, 4)).getBytes(StandardCharsets.UTF_8), <any>StandardOpenOption.CREATE,  <any>StandardOpenOption.WRITE,  <any>StandardOpenOption.TRUNCATE_EXISTING);
            } catch (err) {}

        }

        private static sortObjectKey(object: { [key: string]: unknown }) {
            const newObject = <{ [key: string]: unknown }>{};
            for (let key of Object.keys(object).sort()) {
                newObject[key] = object[key];
            }
            return newObject;
        }

        public static ConfigCommand = class ConfigCommand {

            private readonly prefix = `§8[§9${scriptName}Config§8] §7`;

            public constructor(public readonly valuesContainer: ValuesContainer) {}
    
            public getName() {
                return `${scriptName}Config`.toLowerCase();
            }
        
            public getAliases() {
                return [];
            }
        
            public execute(args: string[]) {
                try {
                    if (args.length > 1) {
                        const operator = args[1].toLowerCase();
                        if (operator === "load" || operator === "save") {
                            ValuesContainer.check();
                            if (args.length > 2) {
                                const file = new File(ValuesContainer.directory, args[2]);
                                if (operator === "save") {
                                    this.valuesContainer.writeContainer(this.valuesContainer.containerSetting.get(), this.valuesContainer.readSettings());
                                    ValuesContainer.writeJSONObject(ValuesContainer.readJSONObject(), file);
                                    chat.print(`${this.prefix}save file '${file.getName()}'.`);
                                } else if (operator === "load" && file.exists() && file.isFile()) {
                                    const jsonObject = ValuesContainer.readJSONObject(file);
                                    ValuesContainer.writeJSONObject(jsonObject, file);
                                    const settingsObject = jsonObject[this.valuesContainer.containerSetting.get()];
                                    if (settingsObject != null) {
                                        this.valuesContainer.writeSettings(<any>settingsObject);
                                    }
                                    chat.print(`${this.prefix}load file '${file.getName()}'.`);
                                } else {
                                    chat.print(`${this.prefix}file '${file.getName()}' does not exist!`);
                                }
                            } else {
                                chat.print(`${this.prefix}§3Syntax: §7.${this.getName()} ${operator} <${Java.from(ValuesContainer.directory.list())?.join("/") ?? "[Empty Directory]"}>`);
                            }
                            return;
                        }
                    }
                    chat.print(`${this.prefix}§3Syntax: §7.${this.getName()} <load/save> <file>`);
                } catch (err) {
                    chat.print(`${this.prefix}Error: ${err}`);
                }
            }
        
            public tabComplete(args: string[]) {
                if (args.length === 2) {
                    ValuesContainer.check();
                    return <string[]>Java.from(ValuesContainer.directory.list()) ?? [];
                } if (args.length === 1) {
                    return ["load", "save"];
                }
                return [];
            }
    
        }

    }

    private static NanoTimer = class NanoTimer {

        private time = -1;
    
        public zero() {
            this.time = 0;
        }
    
        public reset() {
            this.time = System.nanoTime();
        }
    
        public hasTimePassed(nano: number) {
            return this.time + nano < System.nanoTime();
        }
    
        public hasTimeLeft(nano: number) {
            return (this.time + nano) - System.nanoTime();
        }
    
    }

}

class mumyScript {

    private static registeredModulesField = Script.class.getDeclaredField("registeredModules")!;
    private static registeredCommandsField = Script.class.getDeclaredField("registeredCommands")!;

    public static registerModules(scriptModules: { getName(): JVM.java$.lang$.String | string | null | undefined, getDescription(): JVM.java$.lang$.String | string | null | undefined, getCategory(): JVM.java$.lang$.String | string | null | undefined }[]) {
        const modules = [];
        for (let scriptModule of scriptModules) {
            modules.push(mumyScript.registerModule(scriptModule));
        }
        return modules;
    }

    public static registerModule(scriptModule: { getName(): JVM.java$.lang$.String | string | null | undefined, getDescription(): JVM.java$.lang$.String | string | null | undefined, getCategory(): JVM.java$.lang$.String | string | null | undefined }) {
        const moduleConfig = {
            name: scriptModule.getName(),
            description: scriptModule.getDescription(),
            category: scriptModule.getCategory()
        };
        if (typeof (<any>scriptModule).addValues === "function") {
            const valueAdapter = new _ValueAdapter();
            (<any>scriptModule).addValues(valueAdapter);
            (<any>moduleConfig).settings = valueAdapter.getAdaptedValues();
        } if (typeof (<any>scriptModule).getTag === "function") {
            const updateThread = new Thread(() => {
                for (;;) {
                    (<any>moduleConfig).tag = (<any>scriptModule).getTag();
                    Thread.sleep(500);
                }
            });
            updateThread.setDaemon(true);
            updateThread.setPriority(Thread.MIN_PRIORITY);
            updateThread.start();
        }
        const module = new ScriptModule(moduleConfig);
        LiquidBounce.moduleManager!.registerModule(module);
        (<ArrayList<Module>>mumyScript.registeredModulesField.get(script)).add(module);
        registerEvent("update", "onUpdate");
        registerEvent("enable", "onEnable");
        registerEvent("disable", "onDisable");
        registerEvent("packet", "onPacket");
        registerEvent("motion", "onMotion");
        registerEvent("render2D", "onRender2D");
        registerEvent("render3D", "onRender3D");
        registerEvent("jump", "onJump");
        registerEvent("attack", "onAttack");
        registerEvent("key", "onKey");
        registerEvent("move", "onMove");
        registerEvent("step", "onStep");
        registerEvent("stepConfirm", "onStepConfirm");
        registerEvent("world", "onWorld");
        registerEvent("session", "onSession");
        registerEvent("clickBlock", "onClickBlock");
        registerEvent("strafe", "onStrafe");
        registerEvent("slowDown", "onSlowDown");
        return <Module>module;

        function registerEvent(eventName: string, legacyName: string) {
            if ((<any>scriptModule)[legacyName] != null) {
                module.on(eventName, (event: any) => (<any>scriptModule)[legacyName](event));
            }
        }

    }

    public static unregisterModules(modules: (Module | _AdaptedModule)[]) {
        for (let module of modules) {
            mumyScript.unregisterModule(module);
        }
    }

    public static unregisterModule(module: Module | _AdaptedModule, autoDisable: boolean = true) {
        const object = module instanceof _AdaptedModule ? module._getRaw()! : module;
        if (autoDisable) {
            object.setState(false);
        }
        LiquidBounce.moduleManager!.unregisterModule(object);
        (<ArrayList<Module>>mumyScript.registeredModulesField.get(script)).remove(object);
    }

    public static registerCommands(scriptCommands: { getName(): JVM.java$.lang$.String | string | null | undefined, getAliases(): (JVM.java$.lang$.String | string)[] | null | undefined, execute(args: (JVM.java$.lang$.String | string)[] | null | undefined): void }[]) {
        const commands = [];
        for (let scriptCommand of scriptCommands) {
            commands.push(mumyScript.registerCommand(scriptCommand));
        }
        return commands;
    }

    public static registerCommand(scriptCommand: { getName(): JVM.java$.lang$.String | string | null | undefined, getAliases(): (JVM.java$.lang$.String | string)[] | null | undefined, execute(args: (JVM.java$.lang$.String | string)[] | null | undefined): void }) {
        const commandObject = {
            name: scriptCommand.getName(),
            aliases: scriptCommand.getAliases(),
            execute: (args: string[]) => scriptCommand.execute(args)
        };
        if (typeof (<any>scriptCommand).tabComplete === "function") {
            (<any>commandObject).tabComplete = (<any>scriptCommand).tabComplete;
        } if (typeof (<any>scriptCommand).chat === "function") {
            (<any>commandObject).chat = (<any>scriptCommand).chat;
        } if (typeof (<any>scriptCommand).chatSyntax === "function") {
            (<any>commandObject).chatSyntax = (<any>scriptCommand).chatSyntax;
        } if (typeof (<any>scriptCommand).chatSyntaxError === "function") {
            (<any>commandObject).chatSyntaxError = (<any>scriptCommand).chatSyntaxError;
        } if (typeof (<any>scriptCommand).playEdit === "function") {
            (<any>commandObject).playEdit = (<any>scriptCommand).playEdit;
        }
        const command = <Command>new (Java.extend(Command, commandObject))(scriptCommand.getName(), scriptCommand.getAliases());
        LiquidBounce.commandManager!.registerCommand(command);
        (<ArrayList<Command>>mumyScript.registeredCommandsField.get(script)).add(command);
        return command;
    }

    public static unregisterCommands(commands: Command[]) {
        for (let command of commands) {
            mumyScript.unregisterCommand(command);
        }
    }

    public static unregisterCommand(command: Command) {
        LiquidBounce.commandManager!.unregisterCommand(command);
        (<ArrayList<Command>>mumyScript.registeredCommandsField.get(script)).remove(command);
    }

    private static readonly $static$ = (() => {
        mumyScript.registeredModulesField.setAccessible(true);
        mumyScript.registeredCommandsField.setAccessible(true);
    })();

}

let modules: Module[];
let commands: Command[];

function onLoad() {}

function onEnable() {
    const mumyHackAuraInstance = new mumyHackAura();
    modules = mumyScript.registerModules([mumyHackAuraInstance]);
    commands = mumyScript.registerCommands([new mumyHackAura.ValuesContainer.ConfigCommand(mumyHackAuraInstance.valuesContainer)]);
}

function onDisable() {
    mumyScript.unregisterModules(modules);
    mumyScript.unregisterCommands(commands);
}


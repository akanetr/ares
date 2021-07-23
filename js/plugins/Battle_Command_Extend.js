//=============================================================================
// Battle_Command_Extend.js
//=============================================================================

/*:
 * @plugindesc パーティーコマンドの非表示やアクターコマンドを編集できます。
 * @author 村人C
 *
 * @help
 *
 * 使い方
 * プラグインコマンド：
 * Battle_Command_Extend 変更する箇所 フラグ
 *
 * 変更する箇所のパラメータ
 * Party   Attack   Skill   Guard    Item
 * Auto    Repeat   Escape
 *
 * フラグ
 * 有効： on
 * 無効： off
 *
 * 例： Battle_Command_Extend Skill on
 * スキルを非表示にします。
 * 
 * プラグインパラメータ：
 * 有効： on
 * 無効： off
 *
 * コマンドの並び順
 * 先頭のものほど上に表示されます。
 * 攻撃：  attack   スキル： skill   防御： guard    アイテム： item
 * 逃げる： escape   オート： auto    リピート： repeat
 *
 * オート
 * １ターンのみ個別に自動戦闘にします。
 *
 * リピート
 * 前のターンと同じ行動を取ります。
 *
 * Command_Flag
 * コマンドウインドウを自動でサイズ調整します。
 *
 * PT_Flag
 * パーティーコマンド非表示
 * on の場合、「逃げる」をアクターコマンドに追加します。
 *
 * Attack_Flag
 * 「攻撃」を非表示
 *
 * Skill_Flag
 * 「スキル」を非表示
 *
 * Guard_Flag
 * 「防御」を非表示
 *
 * Item_Flag
 * 「アイテム」を非表示
 *
 * Auto_Flag
 * 「オート」を非表示
 *
 * Repeat_Flag
 * 「リピート」を非表示
 *
 * Escape_Flag
 * 「逃げる」を非表示
 *
 *
 * 仕様
 * プラグインコマンドの大文字、小文字を間違えると正しく動作しません。
 * 「スキル」が非表示の場合に「オート」を選ぶと「通常攻撃」が選択されます。
 * パーティーコマンド時の「オート」は全アクターに適用されます。
 * 戦闘開始時に「リピート」を選択した場合、全アクターの行動が通常攻撃になります。
 * 「リピート」の判定はターン開始時です。ターン開始後、使用不可になった場合は行動しません。
 * ターン開始時に前のターンと同じ行動がコスト不足等で実行できない場合は通常攻撃になります。
 *
 * readmeやスタッフロールの明記、使用報告は任意
 *
 *
 * @param Auto
 * @desc 「オート」
 * デフォルト: オート
 * @default オート
 *
 * @param Repeat
 * @desc 「リピート」
 * デフォルト: リピート
 * @default リピート
 *
 * @param Command
 * @desc コマンドの並び
 * デフォルト: attack skill guard item auto repeat escape
 * @default attack skill guard item auto repeat escape
 *
 * @param Command_Flag
 * @desc コマンドのサイズを自動変更
 * デフォルト: on
 * @default on
 *
 * @param PT_Flag
 * @desc パーティーコマンド非表示
 * デフォルト: on
 * @default on
 *
 * @param Attack_Flag
 * @desc 「攻撃」を非表示
 * デフォルト: off
 * @default off
 *
 * @param Skill_Flag
 * @desc 「スキル」を非表示
 * デフォルト: off
 * @default off
 *
 * @param Guard_Flag
 * @desc 「防御」を非表示
 * デフォルト: off
 * @default off
 *
 * @param Item_Flag
 * @desc 「アイテム」を非表示
 * デフォルト: off
 * @default off
 *
 * @param Auto_Flag
 * @desc 「オート」を非表示
 * デフォルト: off
 * @default off
 *
 * @param Repeat_Flag
 * @desc 「リピート」を非表示
 * デフォルト: off
 * @default off
 *
 * @param Escape_Flag
 * @desc 「逃げる」を非表示
 * デフォルト: off
 * @default off
 *
 */

var Battle_Command_Extend  = Battle_Command_Extend || {};
Battle_Command_Extend.Flag = []; // 格納用に配列の作成
Battle_Command_Extend.Parameters = PluginManager.parameters('Battle_Command_Extend');
// 初期設定
Battle_Command_Extend.Command  = Battle_Command_Extend.Parameters["Command"] || "attack skill guard item escape";
Battle_Command_Extend.Flag[0]  = Battle_Command_Extend.Parameters["PT_Flag"] || "on";
Battle_Command_Extend.Flag[1]  = Battle_Command_Extend.Parameters["Attack_Flag"]  || "off";
Battle_Command_Extend.Flag[2]  = Battle_Command_Extend.Parameters["Skill_Flag"]   || "off";
Battle_Command_Extend.Flag[3]  = Battle_Command_Extend.Parameters["Guard_Flag"]   || "off";
Battle_Command_Extend.Flag[4]  = Battle_Command_Extend.Parameters["Item_Flag"]    || "off";
Battle_Command_Extend.Flag[5]  = Battle_Command_Extend.Parameters["Command_Flag"] || "on";
Battle_Command_Extend.Flag[6]  = Battle_Command_Extend.Parameters["Auto_Flag"]    || "off";
Battle_Command_Extend.Flag[7]  = Battle_Command_Extend.Parameters["Repeat_Flag"]  || "off";
Battle_Command_Extend.Flag[8]  = Battle_Command_Extend.Parameters["Auto"]    || "オート";
Battle_Command_Extend.Flag[9]  = Battle_Command_Extend.Parameters["Repeat"]  || "リピート";
Battle_Command_Extend.Flag[10] = Battle_Command_Extend.Parameters["Escape_Flag"]  || "off";

(function() {
	// プラグインコマンド
	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        switch(command) {
			case 'Battle_Command_Extend':
				var id
				switch(args[0]) {
					case 'Party':
						id = 0;
						break;
					case 'Attack':
						id = 1;
						break;
					case 'Skill':
						id = 2;
						break;
					case 'Guard':
						id = 3;
						break;
					case 'Item':
						id = 4;
						break;
					case 'Auto':
						id = 6;
						break;
					case 'Repeat':
						id = 7;
						break;
					case 'Escape':
						id = 10;
						break;
				}
				$gameSystem._battle_command_flag[id] = args[1];
				break;
				
        }
    };
	// 「リピート」の一時保存
	var _Game_Temp_initialize_Battle_Command_Extend = Game_Temp.prototype.initialize;
	Game_Temp.prototype.initialize = function() {
		_Game_Temp_initialize_Battle_Command_Extend.call(this);
		this._repeat_action = [];
	};
	// 「リピート」の初期化
	Game_Temp.prototype.clear_repeat_action = function() {
		this._repeat_action = [];
	};
	// 設定保存用
	var _Game_System_initialize_Battle_Command_Extend = Game_System.prototype.initialize;
	Game_System.prototype.initialize = function() {
		_Game_System_initialize_Battle_Command_Extend.call(this);
		this._battle_command_flag = []; // 初期化
		this._battle_command_flag[0]  = Battle_Command_Extend.Flag[0]; // PT
		this._battle_command_flag[1]  = Battle_Command_Extend.Flag[1]; // 攻撃
		this._battle_command_flag[2]  = Battle_Command_Extend.Flag[2]; // スキル
		this._battle_command_flag[3]  = Battle_Command_Extend.Flag[3]; // 防御
		this._battle_command_flag[4]  = Battle_Command_Extend.Flag[4]; // アイテム
		this._battle_command_flag[6]  = Battle_Command_Extend.Flag[6]; // オート
		this._battle_command_flag[7]  = Battle_Command_Extend.Flag[7]; // リピート
		this._battle_command_flag[10] = Battle_Command_Extend.Flag[10]; // 逃げる
	};
	// 戦闘開始
	var BattleManager_startBattle_Battle_Command_Extend = BattleManager.startBattle;
	BattleManager.startBattle = function() {
		$gameTemp.clear_repeat_action();
		BattleManager_startBattle_Battle_Command_Extend.call(this);
	};
	// ターン開始
	var BattleManager_startTurn_Battle_Command_Extend = BattleManager.startTurn;
	BattleManager.startTurn = function() {
		BattleManager.repeatSave();
		BattleManager_startTurn_Battle_Command_Extend.call(this);
	};
	// リピート行動の作成
	BattleManager.repeatActor = function() {
		for(var i = 0; i < $gameParty.size(); i++) {
			var actor = $gameParty.members()[i];
			var action = new Game_Action(actor);
			if (actor.canInput()) { // 行動可能な場合
				actor.makeActions(); // 現在の行動を削除と行動回数の適用
				if ($gameTemp._repeat_action[i] === undefined) { // 一時保存がなければ
					$gameTemp._repeat_action[i] = [];
					for (var n = 0; n < actor.numActions(); n++) { // 行動回数
						$gameTemp._repeat_action[i][n] = action;
						$gameTemp._repeat_action[i][n].setSkill(actor.attackSkillId()); // 通常攻撃
						$gameTemp._repeat_action[i][n].setTarget(-1); // ターゲットは初期値
					}
				}
				for (var n = 0; n < actor.numActions(); n++) { // 行動回数
					var ac = $gameTemp._repeat_action[i][n];
					actor.setAction(n, ac);
				}
			}
		}
	};
	// リピート行動の保存
	BattleManager.repeatSave = function() {
		for(var i = 0; i < $gameParty.size(); i++) {
			var actor = $gameParty.members()[i];
			if (actor.canInput()) { // 行動可能な場合
				$gameTemp._repeat_action[i] = []; // 保存準備
				for (var n = 0; n < actor.numActions(); n++) { // 行動回数
					if (actor.action(n).isValid()) { // 使用可能？
						$gameTemp._repeat_action[i][n] = actor.action(n); // 保存
					} else { // 使用不可
						actor.action(n).setSkill(actor.attackSkillId())// 通常攻撃に変更
						$gameTemp._repeat_action[i][n] = actor.action(n);
					}
				}
			}
		}
	};
	// 自動戦闘用の行動候補リストを作成
	var _Game_Actor_makeActionList_Battle_Command_Extend = Game_Actor.prototype.makeActionList;
	Game_Actor.prototype.makeActionList = function() {
		if ($gameSystem._battle_command_flag[2] === "on") { // スキルが非表示ならスキルを使用しない
			var list = [];
			var action = new Game_Action(this);
			action.setAttack(); // 通常攻撃
			list.push(action);
			return list;
		} else {
			return _Game_Actor_makeActionList_Battle_Command_Extend.call(this);
		}
	};
	// SV アクターコマンド時「逃げる」動作改善
	var _Sprite_Actor_updateTargetPosition_Battle_Command_Extend = Sprite_Actor.prototype.updateTargetPosition;
	Sprite_Actor.prototype.updateTargetPosition = function() {
		if ($gameSystem._battle_command_flag[0] === "on") {
			if (this._actor.canMove() && BattleManager.isEscaped()) {
				this.retreat();
			} else if (this._actor.isInputting() || this._actor.isActing()) {
				this.stepForward();
			} else if (!this.inHomePosition()) {
				this.stepBack();
			}
		} else {
			return _Sprite_Actor_updateTargetPosition_Battle_Command_Extend.call(this);
		}
	};
	// 表示行数の取得
	var _Window_ActorCommand_numVisibleRows_Battle_Command_Extend = Window_ActorCommand.prototype.numVisibleRows;
	Window_ActorCommand.prototype.numVisibleRows = function() {
		if (Battle_Command_Extend.Flag[5] === "on") {
			var num = this._list ? this._list.length : 4;
			return num;
		} else {
		return _Window_ActorCommand_numVisibleRows_Battle_Command_Extend.call(this);
		}
	};
	// コマンドリストのリフレッシュ
	var _Window_ActorCommand_refresh_Battle_Command_Extend = Window_ActorCommand.prototype.refresh;
	Window_ActorCommand.prototype.refresh = function() {
		if (Battle_Command_Extend.Flag[5] === "on") {
			var wh = this.fittingHeight(this.numVisibleRows());
			var wy = Math.min(Graphics.boxHeight - wh, this.fittingHeight(this.numVisibleRows()));
			this.move(this.x, Graphics.boxHeight - wh, this.windowWidth(), wh);
		}
		_Window_ActorCommand_refresh_Battle_Command_Extend.call(this);
	};
	// コマンドの削除
	Window_ActorCommand.prototype.delCommandList = function(flag)　{
		if(flag === true || $gameSystem._battle_command_flag[1] === "on") { // 攻撃
			this._list = this._list.filter(function(obj) {
				return obj.symbol !== 'attack';
			}.bind(this));
		}
		if(flag === true || $gameSystem._battle_command_flag[2] === "on") { // スキル
			this._list = this._list.filter(function(obj) {
				return obj.symbol !== 'skill';
			}.bind(this));
		}
		if(flag === true || $gameSystem._battle_command_flag[3] === "on") { // 防御
			this._list = this._list.filter(function(obj) {
				return obj.symbol !== 'guard';
			}.bind(this));
		}
		if(flag === true || $gameSystem._battle_command_flag[4] === "on") { // アイテム
			this._list = this._list.filter(function(obj) {
				return obj.symbol !== 'item';
			}.bind(this));
		}
		if(flag === true || $gameSystem._battle_command_flag[10] === "on") { // 逃げる
			this._list = this._list.filter(function(obj) {
				return obj.symbol !== 'escape';
			}.bind(this));
		}
	};
	// コマンドリストの作成
	var _Window_ActorCommand_makeCommandList_Battle_Command_Extend = Window_ActorCommand.prototype.makeCommandList;
	Window_ActorCommand.prototype.makeCommandList = function() {
		_Window_ActorCommand_makeCommandList_Battle_Command_Extend.call(this); // 元処理
		this.delCommandList(true); // コマンド削除
		if (this._actor) {
			var symbol = Battle_Command_Extend.Command.split(' ');
			for(var n = 0; n < symbol.length; n++) {
				 switch(symbol[n]) {
					case 'attack': // 攻撃
						this.addAttackCommand();
						break;
					case 'skill': // スキル
						this.addSkillCommands();;
						break;
					case 'guard': // 防御
						this.addGuardCommand();;
						break;
					case 'item': // アイテム
						this.addItemCommand();;
						break;
					case 'escape': // 逃げる
						if ($gameSystem._battle_command_flag[0] === "on" && $gameSystem._battle_command_flag[10] === "off") {
							this.addCommand(TextManager.escape, 'escape', BattleManager.canEscape());
						}
						break;
					case 'auto': // オート
						if ($gameSystem._battle_command_flag[0] === "on" && $gameSystem._battle_command_flag[6] === "off") {
							this.addCommand(Battle_Command_Extend.Flag[8],  'auto');
						}
						break;
					case 'repeat': // リピート
						if ($gameSystem._battle_command_flag[0] === "on" && $gameSystem._battle_command_flag[7] === "off") {
							this.addCommand(Battle_Command_Extend.Flag[9],  'repeat');
						}
						break;
				 }
			}
			this.delCommandList();
		}
	};
	// コマンドの削除
	Window_PartyCommand.prototype.delCommandList = function(flag)　{
		if(flag === true || $gameSystem._battle_command_flag[10] === "on") { // 逃げる
			this._list = this._list.filter(function(obj) {
				return obj.symbol !== 'escape';
			}.bind(this));
		}
	};
	// コマンドリストの作成
	var _Window_PartyCommand_makeCommandList_Battle_Command_Extend = Window_PartyCommand.prototype.makeCommandList;
	Window_PartyCommand.prototype.makeCommandList = function() {
		_Window_PartyCommand_makeCommandList_Battle_Command_Extend.call(this);
		this.delCommandList(true);
		if ($gameSystem._battle_command_flag[0] === "off" && $gameSystem._battle_command_flag[6] === "off") {
			this.addCommand(Battle_Command_Extend.Flag[8],  'auto');
		}
		if ($gameSystem._battle_command_flag[0] === "off" && $gameSystem._battle_command_flag[7] === "off") {
			this.addCommand(Battle_Command_Extend.Flag[9],  'repeat');
		}
		if ($gameSystem._battle_command_flag[0] === "off" && $gameSystem._battle_command_flag[10] === "off") {
			this.addCommand(TextManager.escape, 'escape', BattleManager.canEscape());
		}
		this.delCommandList();
	};
	// パーティコマンド選択の開始
	var _Scene_Battle_changeInputWindow_Battle_Command_Extend = Scene_Battle.prototype.changeInputWindow;
	Scene_Battle.prototype.changeInputWindow = function() {
		if ($gameSystem._battle_command_flag[0] === "on") {
			if (BattleManager.isInputting()) {
				if (BattleManager.actor()) {
					this.startActorCommandSelection();
				} else {
					this._partyCommandWindow.deactivate;
					this.commandFight();
				}
			} else {
				this.endCommandSelection();
			}
		} else {
			return _Scene_Battle_changeInputWindow_Battle_Command_Extend.call(this);
		}
	};
	// パーティーコマンドウィンドウの作成
	var _Scene_Battle_createPartyCommandWindow_Battle_Command_Extend = Scene_Battle.prototype.createPartyCommandWindow;
	Scene_Battle.prototype.createPartyCommandWindow = function() {
		_Scene_Battle_createPartyCommandWindow_Battle_Command_Extend.call(this);
		if ($gameSystem._battle_command_flag[0] === "off" && $gameSystem._battle_command_flag[6] === "off") { // オート
			this._partyCommandWindow.setHandler('auto', this.commandAuto.bind(this));
		}
		if ($gameSystem._battle_command_flag[0] === "off" && $gameSystem._battle_command_flag[7] === "off") { // リピート
			this._partyCommandWindow.setHandler('repeat', this.commandRepeat.bind(this));
		}
	};
	// アクターコマンドウィンドウの作成
	var _Scene_Battle_createActorCommandWindow_Battle_Command_Extend = Scene_Battle.prototype.createActorCommandWindow;
	Scene_Battle.prototype.createActorCommandWindow = function() {
		_Scene_Battle_createActorCommandWindow_Battle_Command_Extend.call(this);
		if ($gameSystem._battle_command_flag[0] === "on" && $gameSystem._battle_command_flag[6] === "off") { // オート
			this._actorCommandWindow.setHandler('auto', this.commandAuto.bind(this));
		}
		if ($gameSystem._battle_command_flag[0] === "on" && $gameSystem._battle_command_flag[7] === "off") { // リピート
			this._actorCommandWindow.setHandler('repeat', this.commandRepeat.bind(this));
		}
		if ($gameSystem._battle_command_flag[0] === "on") { // 逃げる
			this._actorCommandWindow.setHandler('escape', this.commandEscape.bind(this));
		}
	};
	// コマンド［オート］
	Scene_Battle.prototype.commandAuto = function() {
		if ($gameSystem._battle_command_flag[0] === "on") { // アクターコマンドから
			BattleManager.actor().makeAutoBattleActions(); // オート
			this.selectNextCommand();
		} else { // パーティーコマンドから
			for(var i = 0; i < $gameParty.size(); i++) {
				var actor = $gameParty.members()[i];
				if (actor.canInput()) { // 行動可能な場合
					actor.makeAutoBattleActions(); // オート
				}
			}
			this.endCommandSelection(); // コマンド終了
			BattleManager.startTurn(); // ターン開始
		}
	}
	// コマンド［リピート］
	Scene_Battle.prototype.commandRepeat = function() {
		BattleManager.repeatActor(); // 行動の作成
		this.endCommandSelection(); // コマンド終了
		BattleManager.startTurn(); // ターン開始
	}
})();
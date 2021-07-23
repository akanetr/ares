//=============================================================================
// RefineBattleActionForcing.js (Ver1.1)
//=============================================================================
// 2017/07/12 Ver1.0 First Release
// 2017/07/17 Ver1.1 Add option 'Reduce Actoion Times'

/*:
 * @plugindesc Don't reset subject's action after action forcing
 * @author Sasuke KANNAZUKI
 *
 * @help
 * This plugin does not provide plugin commands.
 *
 * @param Reduce Actoion Times
 * @desc (1=yes, 0=no) if you choose 1(=yes), actions after force movings are not executed.
 * defaluit 0
 *
 
 * [Summary]
 * At default system, when event command 'Battle Action Forcing' executed,
 * it resets all the subject's surplus actions.
 * This pluin solves the problem.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @plugindesc 「戦闘行動の強制」後、残りの行動がキャンセルされるのを防ぎます。
 * @author 神無月サスケ
 *
 * @param Reduce Actoion Times
 * @desc 戦闘の強制行動の後の行動を、回数分キャンセルするか(1=する, 0=しない)
 * defaluit 0
 *
 * @help
 * このプラグインには、プラグインコマンドはありません。
 *
 * ■概要
 * イベントコマンド「戦闘行動の強制」を行うと、仮にそのアクターが予定していた
 * 行動があっても、すべてキャンセルされます。
 * このプラグインは、その問題を解決します。
 * 
 * ■仕様
 * オプション「Reduce Actoion Times」を 0 にすると、「戦闘行動の強制」は
 * 行動回数に含めず、行動可能な回数だけ行動を行います。
 * 同オプションを 1 にすると、その回数目の行動が「戦闘行動の強制」に
 * 置き換わります。例えば、「ヒール、攻撃、サンダー」の順番に入力した場合で、
 * 最初に 2 回「戦闘行動の強制」を行った場合、最初のふたつはキャンセルされ、
 * 「サンダー」のみが実行されます。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(function() {
  //
  // process parameters
  //
  var parameters = PluginManager.parameters('RefineBattleActionForcing');
  var reduceActionTimes = !!Number(parameters['Reduce Actoion Times'] || 0);

  //
  // main routine
  //
  var _Game_Battler_initMembers = Game_Battler.prototype.initMembers;
  Game_Battler.prototype.initMembers = function() {
    _Game_Battler_initMembers.call(this);
    this.numActionAtForceing = null;
  };

  Game_Battler.prototype.isActionForcing = function () {
    if ($gameParty.inBattle()) {
      if (this.numActionAtForceing) {
        if (this.numActionAtForceing !== this.numActions()) {
          this.numActionAtForceing = null;
          return false;
        }
        return true;
      }
    }
    return false;
  };

  var _Game_Battler_clearActions = Game_Battler.prototype.clearActions;
  Game_Battler.prototype.clearActions = function() {
    if (!this.isActionForcing()) {
      _Game_Battler_clearActions.call(this);
    }
  };

  var _Game_Battler_forceAction = Game_Battler.prototype.forceAction;
  Game_Battler.prototype.forceAction = function(skillId, targetIndex) {
    this.numActionAtForceing = this.numActions();
    _Game_Battler_forceAction.call(this, skillId, targetIndex);
    // if it need to recuce action times for force moving number
    if (reduceActionTimes) {
      if(this._actions.length > 1) {
        this._actions.splice(this.action(targetIndex + 1), 1);
      }
    }
    // move last action(=force action) to top
    var action = this._actions.pop();
    this._actions.unshift(action);
  };


  BattleManager.forceAction = function(battler) {
    this._actionForcedBattler = battler;
    //var index = this._actionBattlers.indexOf(battler);
    //if (index >= 0) {
    //  this._actionBattlers.splice(index, 1);
    //}
  };
})();

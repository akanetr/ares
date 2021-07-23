//
//  BugFix_SkillType ver1.01
//
// author yana
//

var Imported = Imported || {};
Imported['BugFix_SkillType'] = 1.01;

/*:
 * @plugindesc ver1.01/同じスキルタイプを複数追加したとき、スキル欄にダブって並んでしまうバグを修正。
 * @author Yana
 * 
 * 
 * @help------------------------------------------------------
 *  プラグインコマンドはありません。
 * ------------------------------------------------------
 * ------------------------------------------------------
 * 利用規約：特になし。素材利用は自己責任でお願いします。
 * ------------------------------------------------------
 * 更新履歴:
 * ver1.01:
 * 内容を別の処理に変更して、戦闘中も効果が出るように修正。
 * ver1.00:
 * 公開
 */

(function(){
	
  var _BF_GBBase_addedSkillTypes = Game_BattlerBase.prototype.addedSkillTypes;
  Game_BattlerBase.prototype.addedSkillTypes = function() {
  	var types = _BF_GBBase_addedSkillTypes.call(this);
  	var result = [];
  	for (var i=0;i<types.length;i++){
  		if (!result.contains(types[i])){
  			result.push(types[i]);
  		}
  	}
  	return result;
  };
}());

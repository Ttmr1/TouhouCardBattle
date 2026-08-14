/* =========================================================
   card.js
   キャラクター・エネルギー・アイテムのカードデータ定義
   （このファイルはデータのみを持ち、ゲームロジックは東方カードバトル.html側にあります）
========================================================= */
//通常のダメージと比べ無属性は1.25倍ダメージが高い特徴あり。

/* ---- キャラクターカード ----
   type      : 種族属性（人間/妖怪/鬼/幽霊/妖精）
   weakness  : 弱点の配列。種族属性・わざ属性のどちらも入りうる（0〜2個、無い場合もある）
   moves     : わざの配列（1〜4個）。各わざは
               name    : わざ名
               element : わざの属性（無/木/火/水/氷/岩/闇/光）
               cost    : 消費する霊力エネルギー（0〜2）
               dmg     : 固定ダメージ量
               effects : 追加効果の配列（省略可・複数可）。type ごとに意味が異なる：
                 bonusVsType     { targetType, amount }  相手のtypeがtargetTypeなら追加amountダメージ
                 benchBonusVsType{ targetType, amount }  相手ベンチのtypeがtargetTypeの全員にamountダメージ
                 benchDamage     { amount }              相手ベンチ全員にamountダメージ（type問わず）
                 selfStatus      { status }               自分に状態異常（主に'regen'）を付与
                 inflictStatus   { status, turns, amount } 相手に状態異常を付与（'burn'|'freeze'|'random'）
                 recoil          { amount }               自分にamountダメージ（反動）
                 shield          { amount, turns }         自分に「結界」状態を付与（被ダメージ-amount、turnsターン）
                 addElement      { element }               このわざにもう1つ属性を追加する（弱点判定に加算）
                 randomElement   { pool }                  使用時に属性をpoolからランダムに1つ選ぶ
                 ignoreWeakness  {}                        弱点による追加ダメージ（+10/+20）を無視する
                 bonusIfStatus   { statusType, amount }     相手が指定状態異常なら追加amountダメージ
                 multiHitRandom  { hits, dmgPerHit }         相手のメイン・ベンチからランダムにhits回攻撃（弱点無視、mainのdmgは使わない）
                 healBenchAll    { amount }                 自分のベンチ全員をamountずつ回復
                 weaknessMatchElement {}                    相手の弱点にある属性の中からランダムに1つを、このわざの属性として使う（無ければ無属性）
                 drawCard        { amount }                 自分が山札からamount枚引く
                 drawOnKO        { amount }                 このわざで相手を倒したら山札からamount枚引く
                 selfDamageOnKO  { amount }                 このわざで相手を倒したら自分にamountダメージ
                 selfSwapAfter   {}                          攻撃後、自分のベンチの先頭とメインが自動で入れ替わる
                 forcedSwapThenStatus { status }             攻撃後、相手のメインとベンチを強制入れ替え（相手が選択）し、新メインに状態異常を付与
               targetBench : true にすると、このわざは相手のメインではなくベンチの指定キャラを攻撃する（使用時に対象選択）
------------------------------------------------------------ */
const CHAR_DB = [
  {
    id:'reimu', name:'博麗霊夢', type:'人間', hp:146, weakness:[],
    passive:{ type:'statusImmune' },
    moves:[
      { name:'封魔陣',   element:'無', cost:0, dmg:25,  effects:[{ type:'bonusVsType', targetType:'妖怪', amount:10 }] },
      { name:'二重結界', element:'無', cost:1, dmg:56, effects:[{ type:'selfStatus', status:'regen' }] },
      { name:'夢想封印', element:'光', cost:2, dmg:68, effects:[{ type:'benchBonusVsType', targetType:'妖怪', amount:10 }] },
    ],
  },
  {
    id:'marisa', name:'霧雨魔理沙', type:'人間', hp:154, weakness:[],
    passive:{ type:'selfHealPerTurn', amount:5 },
    moves:[
      { name:'ミルキーウェイ',        element:'星', cost:0, dmg:21 },
      { name:'スターライトタイフーン', element:'光', cost:1, dmg:40 },
      { name:'マスタースパーク',      element:'光', cost:2, dmg:80, effects:[{ type:'recoil', amount:10 }] },
    ],
  },
  {
    id:'rumia', name:'ルーミア', type:'妖怪', hp:190, weakness:['光'],
    moves:[
      { name:'ムーンライトレイ',   element:'闇', cost:0, dmg:17 },
      { name:'ナイトバード',       element:'闇', cost:1, dmg:44, effects:[{ type:'drawCard', amount:1 }] },
      { name:'ディマーケイション', element:'闇', cost:2, dmg:74, effects:[{ type:'bonusIfWeakness', targetWeakness:'闇', amount:10 }, { type:'bonusIfWeakness', targetWeakness:'妖怪', amount:5 }] },
    ],
  },
  {
    id:'fairy', name:'大妖精', type:'妖精', hp:182, weakness:['人間','闇'],
    moves:[
      { name:'妖精の悪戯',       element:'光', cost:0, dmg:22 },
      { name:'フェアリーストーム', element:'木', cost:1, dmg:42, effects:[{ type:'selfStatus', status:'regen' }, { type:'healBench', amount:35 }] },
    ],
  },
  {
    id:'cirno', name:'チルノ', type:'妖精', hp:207, weakness:['火'],
    passive:{ type:'statusImmuneType', statusType:'freeze' },
    moves:[
      { name:'アイシクルフォール',   element:'氷', cost:0, dmg:17,  effects:[{ type:'inflictStatus', status:'freeze' }] },
      { name:'ヘイルストーム',       element:'氷', cost:1, dmg:42, effects:[{ type:'inflictStatus', status:'freeze' }] },
      { name:'パーフェクトフリーズ', element:'氷', cost:2, dmg:72 },
    ],
  },
  {
    id:'meirin', name:'紅美鈴', type:'妖怪', hp:199, weakness:['神','魔法使い'],
    moves:[
      { name:'セラギネラ９', element:'岩', cost:0, dmg:23 },
      { name:'彩虹の風鈴',   element:'火', cost:1, dmg:47 },
      { name:'彩光乱舞',     element:'火', cost:2, dmg:71, effects:[{ type:'inflictStatus', status:'random' }] },
    ],
  },
  {
    id:'koakuma', name:'小悪魔', type:'その他', hp:182, weakness:['魔法使い','火'],
    passive:{ type:'atkBonusIfAllyPresent', allyId:'patchouli', amount:5 },
    moves:[
      { name:'魔術', element:'無', cost:0, dmg:21,  effects:[{ type:'randomElement', pool:['火','水','木'] }] },
      { name:'結界', element:'無', cost:1, dmg:49, effects:[{ type:'shield', amount:30 }] },
    ],
  },
  {
    id:'patchouli', name:'パチュリー・ノーレッジ', type:'魔法使い', hp:187, weakness:['鬼','星'],
    moves:[
      { name:'アグニシャイン',       element:'火', cost:0, dmg:10, effects:[{ type:'inflictStatus', status:'burn' }] },
      { name:'プリンセスウンディネ', element:'水', cost:0, dmg:20 },
      { name:'フォレストブレイズ',   element:'火', cost:1, dmg:43, effects:[{ type:'addElement', element:'木' }] },
      { name:'ラーヴァクロムレク',   element:'火', cost:2, dmg:68, effects:[{ type:'addElement', element:'岩' }] },
    ],
  },
  {
    id:'sakuya', name:'十六夜咲夜', type:'人間', hp:210, weakness:['鬼'],
    moves:[
      { name:'操りドール',             element:'無', cost:0, dmg:25,  effects:[{ type:'inflictStatus', status:'random' }] },
      { name:'ジャック・ザ・ルドビレ', element:'無', cost:1, dmg:59, effects:[{ type:'drawCard', amount:1 }] },
      { name:'殺人ドール',             element:'無', cost:2, dmg:73, effects:[{ type:'drawOnKO', amount:3 }] },
    ],
  },
  {
    id:'remilia', name:'レミリア・スカーレット', type:'鬼', hp:197, weakness:['神','闇'],
    passive:{ type:'hpBonusIfAllyPresent', allyId:'flandre', amount:20 },
    moves:[
      { name:'スターオブダビデ', element:'闇', cost:0, dmg:21 },
      { name:'レッドマジック',   element:'火', cost:1, dmg:39, effects:[{ type:'inflictStatus', status:'burn' }] },
      { name:'紅色の幻想郷',     element:'火', cost:2, dmg:71, effects:[{ type:'inflictStatus', status:'burn' }] },
    ],
  },
  {
    id:'flandre', name:'フランドール・スカーレット', type:'鬼', hp:185, weakness:['人間','星'],
    passive:{ type:'hpBonusIfAllyPresent', allyId:'remilia', amount:20 },
    moves:[
      { name:'カゴメカゴメ',       element:'光', cost:0, dmg:16 },
      { name:'レーヴァテイン',     element:'火', cost:1, dmg:42 },
      { name:'恋の迷路',           element:'闇', cost:1, dmg:44, effects:[{ type:'discardRandomHandCard' }] },
      { name:'スターボウブレイク', element:'闇', cost:2, dmg:60, effects:[{ type:'benchDamage', amount:10 }] },
    ],
  },
  {
    id:'alice', name:'アリス・マーガトロイド', type:'魔法使い', hp:191, weakness:['幽霊','光'],
    moves:[
      { name:'マリオネットパラル',       element:'無', cost:0, dmg:22,  effects:[{ type:'drawCard', amount:1 }] },
      { name:'乙女文楽',                 element:'無', cost:1, dmg:52, effects:[{ type:'preventRetreat', turns:2 }] },
      { name:'博愛の仏蘭西人形',         element:'無', cost:2, dmg:0,  effects:[{ type:'multiHitRandom', hits:5, dmgPerHit:14, scalePerStage:1 }] },
    ],
  },
  {
    id:'youmu', name:'魂魄妖夢', type:'その他', hp:205, weakness:['妖怪','岩'],
    moves:[
      { name:'業風閃影陣', element:'闇', cost:0, dmg:20, effects:[{ type:'selfStatus', status:'regen' }] },
      { name:'大悟顕晦',   element:'無', cost:1, dmg:55 },
      { name:'三魂七魄',   element:'無', cost:2, dmg:79 },
    ],
  },
  {
    id:'yuyuko', name:'西行寺幽々子', type:'幽霊', hp:196, weakness:['仙人','火'],
    moves:[
      { name:'ゴーストバタフライ',   element:'光', cost:0, dmg:21 },
      { name:'完全なる墨染の桜',     element:'木', cost:1, dmg:40 },
      { name:'反魂蝶',               element:'光', cost:2, dmg:62, effects:[{ type:'benchDamage', amount:15 }] },
    ],
  },
  {
    id:'yukari', name:'八雲紫', type:'妖怪', hp:195, weakness:['光','幽霊'],
    passive:{ type:'chanceDrawIfMain', chance:1/2 },
    moves:[
      { name:'二重黒死蝶',   element:'無', cost:0, dmg:24 },
      { name:'生と死の境界', element:'闇', cost:1, dmg:38, effects:[{ type:'selfStatus', status:'shield', turns:2 }] },
      { name:'永夜四重結界', element:'光', cost:2, dmg:62, effects:[{ type:'inflictStatus', status:'freeze', turns:2 }] },
    ],
  },
  {
    id:'reisen', name:'鈴仙・優曇華院・イナバ', type:'月人', hp:185, weakness:['光','人間'],
    moves:[
      { name:'幻波「赤眼催眠」',       element:'闇', cost:0, dmg:18, effects:[{ type:'inflictStatus', status:'freeze', turns:1 }] },
      { name:'マインドエクスプロージョン', element:'闇', cost:1, dmg:38, effects:[{ type:'discardRandomHandCard' }] },
      { name:'ルナティックレッドアイズ',   element:'光', cost:2, dmg:69, effects:[{ type:'revealHandCards', count:2 }] },
    ],
  },
  {
    id:'eirin', name:'八意永琳', type:'月人', hp:178, weakness:['水','星'],
    moves:[
      { name:'壺中の天地',           element:'星', cost:0, dmg:20,  effects:[{ type:'drawCard', amount:1 }] },
      { name:'神代の記憶',           element:'岩', cost:1, dmg:45, effects:[{ type:'selfStatus', status:'regen' }] },
      { name:'生命遊戯-ライフゲーム-', element:'無', cost:1, dmg:56, effects:[{ type:'weaknessMatchElement' }] },
      { name:'アポロ13号',           element:'星', cost:2, dmg:43, effects:[{ type:'benchDamage', amount:25 }] },
    ],
  },
  {
    id:'kaguya', name:'蓬莱山輝夜', type:'月人', hp:187, weakness:['月人','木'],
    moves:[
      { name:'ブディストダイアモンド',        element:'星', cost:0, dmg:19 },
      { name:'サラマンダーシールド',          element:'星', cost:1, dmg:45, effects:[{ type:'selfSwapAfter' }] },
      { name:'燕の子安貝-永命線-',            element:'光', cost:1, dmg:30, effects:[{ type:'healSelf', amount:30 }] },
      { name:'蓬莱の樹海',                    element:'木', cost:2, dmg:68, effects:[{ type:'bonusVsType', targetType:'月人', amount:35 }] },
    ],
  },
  {
    id:'mokou', name:'藤原妹紅', type:'人間', hp:180, weakness:['水','幽霊'],
    passive:{ type:'selfHealPerTurn', amount:5 },
    moves:[
      { name:'火符「アグニレイディアンス」', element:'火', cost:0, dmg:20 },
      { name:'フェニックスの尾',             element:'火', cost:1, dmg:45, effects:[{ type:'selfStatus', status:'regen' }] },
      { name:'蓬莱「凱風快晴」',             element:'火', cost:2, dmg:66, effects:[{ type:'inflictStatus', status:'burn' }] },
    ],
  },
  {
    id:'suika', name:'伊吹萃香', type:'鬼', hp:206, weakness:['人間','氷'],
    moves:[
      { name:'雲集霧散',            element:'星', cost:0, dmg:17,  effects:[{ type:'drawCard', amount:1 }] },
      { name:'ミッシングパワー',    element:'岩', cost:1, dmg:45 },
      { name:'超高密度燐禍術',      element:'星', cost:2, dmg:69, effects:[{ type:'inflictStatus', status:'burn' }] },
    ],
  },
  {
    id:'aya', name:'射命丸文', type:'妖怪', hp:190, weakness:['岩','氷'],
    moves:[
      { name:'風符「風神一扇」', element:'無', cost:0, dmg:25, effects:[{ type:'benchDamage', amount:10 }] },
      { name:'疾風「風神少女」', element:'木', cost:1, dmg:43, effects:[{ type:'drawCard', amount:1 }] },
      { name:'幻想風靡',         element:'木', cost:2, dmg:65, effects:[{ type:'benchDamage', amount:10 }] },
    ],
  },
  {
    id:'yuuka', name:'風見幽香', type:'妖怪', hp:210, weakness:['火','氷'],
    moves:[
      { name:'花符「幻想郷の開花」',       element:'木', cost:0, dmg:20, effects:[{ type:'bonusIfStatus', statusType:'shield', amount:50 }] },
      { name:'マスタースパーク・フラワー', element:'木', cost:1, dmg:46 },
      { name:'花鳥風月、嘯風弄月',         element:'木', cost:2, dmg:66, effects:[{ type:'bonusIfSelfFullHp', amount:30 }] },
    ],
  },
  {
    id:'komachi', name:'小野塚小町', type:'神', hp:189, weakness:['その他'],
    passive:{ type:'finisherLowHp', threshold:10, amount:10 },
    moves:[
      { name:'宵越しの銭',       element:'無', cost:0, dmg:7, effects:[{ type:'drawCard', amount:2 }] },
      { name:'ヒガンルトゥール', element:'氷', cost:1, dmg:18, effects:[{ type:'bonusIfOpponentHpAtLeast', threshold:100, amount:36 }] },
    ],
  },
  {
    id:'eiki', name:'四季映姫・ヤマザナドゥ', type:'その他', hp:250, weakness:['その他'],
    passive:{ type:'selfDamagePerTurn', amount:10 },
    moves:[
      { name:'彷徨える大罪',       element:'無', cost:0, dmg:18, effects:[{ type:'drawCard', amount:1 }] },
      { name:'ラストジャッジメント', element:'無', cost:1, dmg:30, effects:[{ type:'bonusIfOpponentHigherHp', amount:30 }] },
      { name:'タン・オブ・ウルフ',   element:'無', cost:1, dmg:50, effects:[{ type:'selfBenchDamage', amount:10 }] },
      { name:'十王裁判',           element:'無', cost:2, dmg:40, effects:[{ type:'bonusIfOpponentHigherHp', amount:45 }] },
    ],
  },
  {
    id:'hina', name:'鍵山雛', type:'神', hp:192, weakness:['その他','月人'],
    moves:[
      { name:'バットフォーチュン',           element:'無', cost:0, dmg:5, effects:[{ type:'inflictStatus', status:'burn' }, { type:'inflictStatus', status:'freeze' }] },
      { name:'厄神様のバイオリズム',         element:'闇', cost:1, dmg:31, effects:[{ type:'drawCardsEqualToKnockouts' }] },
      { name:'ブロークンアミュレット',       element:'無', cost:2, dmg:5, effects:[{ type:'benchDamage', amount:35 }, { type:'selfStatus', status:'freeze', turns:1 }] },
    ],
  },
  {
    id:'nitori', name:'河城にとり', type:'妖怪', hp:182, weakness:['その他','魔法使い'],
    moves:[
      { name:'オプティカルカモフラージュ', element:'無', cost:0, dmg:15,  effects:[{ type:'weaknessMatchElement' }] },
      { name:'光り輝く水底のトラウマ',     element:'水', cost:1, dmg:42, effects:[{ type:'inflictStatus', status:'freeze' }] },
      { name:'河童のポロロッカ',           element:'水', cost:2, dmg:70, effects:[{ type:'addElement', element:'木' }] },
    ],
  },
  {
    id:'sanae', name:'東風谷早苗', type:'人間', hp:196, weakness:['神','木'],
    moves:[
      { name:'グレイソーマタージ',   element:'木', cost:0, dmg:17,  effects:[{ type:'drawCard', amount:1 }] },
      { name:'一子相伝の弾幕',       element:'木', cost:1, dmg:43, effects:[{ type:'addElement', element:'氷' }] },
      { name:'客星の明るい夜',       element:'光', cost:1, dmg:39, effects:[{ type:'selfStatus', status:'shield' }] },
      { name:'海が割れる日',         element:'水', cost:2, dmg:40, effects:[{ type:'fixedMultiHitMain', hits:2 }] },
    ],
  },
  {
    id:'suwako', name:'洩矢諏訪子', type:'神', hp:188, weakness:['神','仙人'],
    moves:[
      { name:'二礼二拍手一礼',         element:'無', cost:0, dmg:20,  effects:[{ type:'drawCard', amount:1 }] },
      { name:'手長足長さま',           element:'木', cost:1, dmg:0, targetBench:true, effects:[{ type:'flatBonusDamage', amount:45 }] },
      { name:'ケロちゃん風雨に負けず', element:'水', cost:1, dmg:45 },
      { name:'ミシャグジさま',         element:'木', cost:2, dmg:67, effects:[{ type:'addElement', element:'岩' }, { type:'forcedSwapThenStatus', status:'burn' }] },
    ],
  },
  {
    id:'tenshi', name:'比那名居天子', type:'仙人', hp:205, weakness:['岩','水'],
    passive:{ type:'statusImmuneType', statusType:'burn' },
    moves:[
      { name:'天符「天道是非の剣」', element:'岩', cost:0, dmg:22 },
      { name:'地符「不譲土壌の剣」', element:'岩', cost:1, dmg:41, effects:[{ type:'selfStatus', status:'shield', turns:2 }] },
      { name:'全人類の緋想天',       element:'光', cost:2, dmg:83, effects:[{ type:'ignoreWeakness' }] },
    ],
  },
  {
    id:'yuugi', name:'星熊勇儀', type:'鬼', hp:179, weakness:['幽霊','岩'],
    moves:[
      { name:'怪力乱神',   element:'岩', cost:0, dmg:19 },
      { name:'地獄の苦輪', element:'岩', cost:1, dmg:62, effects:[{ type:'ignoreWeakness' }, { type:'recoil', amount:15 }] },
      { name:'三歩必殺',   element:'岩', cost:2, dmg:95, effects:[{ type:'ignoreWeakness' }, { type:'recoil', amount:40 }] },
    ],
  },
  {
    id:'murasa', name:'村紗水蜜', type:'幽霊', hp:196, weakness:['木','光'],
    moves:[
      { name:'沈没アンカー',   element:'水', cost:0, dmg:13, effects:[{ type:'returnHandToDeck' }] },
      { name:'道連れアンカー', element:'水', cost:1, dmg:42, effects:[{ type:'selfStatus', status:'curse', amount:40, turns:1 }] },
      { name:'幽霊船の港',     element:'水', cost:2, dmg:65, effects:[{ type:'addElement', element:'闇' }, { type:'bonusIfFullHp', amount:35 }] },
    ],
  },
  {
    id:'seiga', name:'霍青娥', type:'仙人', hp:160, weakness:['鬼','星'],
    moves:[
      { name:'ヤンシャオグイ',   element:'氷', cost:0, dmg:18, effects:[{ type:'drawCard', amount:1 }] },
      { name:'グーフンイエグイ', element:'水', cost:1, dmg:10, effects:[{ type:'benchGiveEnergy', amount:1, count:2 }] },
      { name:'ゾウフォルゥモォ', element:'氷', cost:1, dmg:30, effects:[{ type:'benchGiveRetreatEnergy', amount:1, count:1 }] },
    ],
  },
  {
    id:'tojiko', name:'蘇我屠自古', type:'幽霊', hp:155, weakness:['その他','魔法使い'],
    passive:{ type:'damageReductionFraction', fraction:0.75 },
    moves:[
      { name:'ガゴウジサイクロン', element:'光', cost:0, dmg:21 },
      { name:'ガゴウジトルネード', element:'星', cost:1, dmg:30, effects:[{ type:'benchGiveEnergy', amount:1, count:1, forceRandom:true }] },
      { name:'入鹿の雷',           element:'光', cost:2, dmg:30, effects:[{ type:'benchGiveEnergy', amount:4, count:1, forceRandom:true }] },
    ],
  },
  {
    id:'kokoro', name:'秦こころ', type:'神', hp:203, weakness:['妖怪','氷'],
    moves:[
      { name:'モンキーポゼッション',   element:'無', cost:0, dmg:5,  effects:[{ type:'selfStatus', status:'shield' }, { type:'healBenchAll', amount:15 }] },
      { name:'憂き世は憂きしの小車',   element:'光', cost:1, dmg:45 },
      { name:'怒れる忌狼の面',         element:'木', cost:1, dmg:42, effects:[{ type:'inflictStatus', status:'random' }] },
      { name:'仮面喪心舞_暗黒能楽',    element:'闇', cost:2, dmg:68, effects:[{ type:'addElement', element:'光' }] },
    ],
  },
  {
    id:'wakasagihime', name:'わかさぎ姫', type:'その他', hp:165, weakness:['木'],
    moves:[
      { name:'テイルフィンスラップ', element:'水', cost:0, dmg:5, effects:[{ type:'selfGiveEnergy', amount:1 }, { type:'selfGiveRetreatEnergy', amount:1 }] },
      { name:'スケールウェイブ',     element:'水', cost:1, dmg:20, effects:[{ type:'benchDamage', amount:15 }] },
      { name:'逆鱗の荒波',           element:'水', cost:1, dmg:30, effects:[{ type:'addElement', element:'氷' }, { type:'inflictStatus', status:'freeze' }] },
      { name:'逆鱗の大荒波',         element:'水', cost:2, dmg:40, effects:[{ type:'benchDamage', amount:10 }, { type:'preventRetreat', turns:2 }] },
    ],
  },
  {
    id:'seija', name:'鬼人正邪', type:'鬼', hp:200, weakness:['神','鬼'],
    moves:[
      { name:'有頂天変',       element:'闇', cost:0, dmg:20 },
      { name:'天邪鬼の逆恨み', element:'岩', cost:1, dmg:44, effects:[{ type:'bonusIfWeakness', targetWeakness:'鬼', amount:20 }] },
      { name:'弱者の反逆',     element:'闇', cost:2, dmg:72, effects:[{ type:'reverseWeakness', turns:2 }] },
    ],
  },
  {
    id:'raiko', name:'堀川雷鼓', type:'鬼', hp:215, weakness:['水','幽霊'],
    moves:[
      { name:'暴れ独楽',           element:'無', cost:0, dmg:26 },
      { name:'弾む太鼓の達人',     element:'岩', cost:1, dmg:0,  effects:[{ type:'multiHitRandom', hits:2, dmgPerHit:22, scalePerStage:2 }] },
      { name:'なぜか許される暴力', element:'岩', cost:2, dmg:83, effects:[{ type:'ignoreWeakness' }, { type:'recoil', amount:20 }] },
    ],
  },
  {
    id:'kasen', name:'茨城華扇', type:'仙人', hp:200, weakness:['月人','闇'],
    passive:{ type:'chanceBonusDamageFraction', chance:1/3, fraction:0.25 },
    moves:[
      { name:'鷹による夢想封印ハンティング',   element:'光', cost:0, dmg:19, effects:[{ type:'bonusVsType', targetType:'妖怪', amount:10 }] },
      { name:'務光と葉っぱの弾幕変化',         element:'木', cost:1, dmg:28, effects:[{ type:'addElement', element:'火' }, { type:'addElement', element:'水' }] },
      { name:'ドラゴンズ飛鳥井キック',         element:'無', cost:2, dmg:78 },
    ],
  },
  {
    id:'sumireko', name:'宇佐見菫子', type:'人間', hp:208, weakness:['闇'],
    passive:{ type:'chanceAttachEnergyIfMain', chance:1/3 },
    moves:[
      { name:'サイコプロージョン',           element:'水', cost:0, dmg:14, effects:[{ type:'revealHandCards', count:2 }] },
      { name:'現し世のオカルティシャン',     element:'無', cost:1, dmg:55 },
      { name:'深秘のエソテリックセブン',     element:'氷', cost:2, dmg:66, effects:[{ type:'discardRandomHandCard', amount:2 }] },
    ],
  },
  {
    id:'sagume', name:'稀神サグメ', type:'月人', hp:204, weakness:['人間','火'],
    moves:[
      { name:'鳥合の逆呪',           element:'無', cost:1, dmg:52, effects:[{ type:'reverseWeakness', turns:2 }] },
      { name:'神々の弾冠',           element:'木', cost:1, dmg:43, effects:[{ type:'becomeTypeIfWeak', targetSpecies:'神' }] },
      { name:'神々の光り輝く弾冠',   element:'光', cost:2, dmg:67, effects:[{ type:'becomeTypeIfWeak', targetSpecies:'神' }, { type:'benchBonusVsWeakness', targetWeakness:'神', amount:30 }] },
    ],
  },
  {
    id:'clownpiece', name:'クラウンピース', type:'妖精', hp:200, weakness:['水'],
    moves:[
      { name:'ヘルエクリプス',       element:'岩', cost:0, dmg:21,  effects:[{ type:'addElement', element:'火' }] },
      { name:'グレイズインフェルノ', element:'火', cost:1, dmg:46, effects:[{ type:'bonusIfStatus', statusType:'shield', amount:40 }] },
      { name:'フェイクアポロ',       element:'星', cost:2, dmg:0,  effects:[{ type:'multiHitRandom', hits:3, dmgPerHit:24, scalePerStage:3 }] },
    ],
  },
  {
    id:'hecatia', name:'ヘカーティア・ラピスラズリ', type:'神', hp:178, weakness:['妖怪','仙人'],
    moves:[
      { name:'アポロ反射鏡',           element:'星', cost:0, dmg:20, effects:[{ type:'addElement', element:'氷' }] },
      { name:'地獄に降る雨',           element:'水', cost:1, dmg:20, effects:[{ type:'benchDamage', amount:10 }, { type:'inflictStatus', status:'burn' }] },
      { name:'地獄のノンイデアル弾幕', element:'火', cost:2, dmg:62, effects:[{ type:'inflictStatus', status:'burn' }] },
      { name:'ルナティックインパクト', element:'星', cost:2, dmg:70, effects:[{ type:'drawCard', amount:1 }] },
    ],
  },
  {
    id:'narumi', name:'矢田寺成美', type:'魔法使い', hp:193, weakness:['月人','鬼'],
    moves:[
      { name:'インスタントボーディ', element:'岩', cost:0, dmg:21, effects:[{ type:'addElement', element:'氷' }] },
      { name:'バレットゴーレム',     element:'岩', cost:1, dmg:33, effects:[{ type:'halfDamageNext' }] },
      { name:'即席菩提',             element:'星', cost:1, dmg:42 },
      { name:'業火救済',             element:'星', cost:2, dmg:63, effects:[{ type:'inflictStatus', status:'burn' }] },
    ],
  },
  {
    id:'okina', name:'摩多羅隠岐奈', type:'神', hp:200, weakness:['闇','岩'],
    moves:[
      { name:'秘儀「背面の暗黒能楽」', element:'闇', cost:0, dmg:20, targetBench:true, effects:[{ type:'preventRetreat', turns:2 }] },
      { name:'秘神「神秘の後光」',     element:'光', cost:1, dmg:45, effects:[{ type:'healBench', amount:25 }] },
      { name:'秘儀「リバース・オブ・オーナー」', element:'氷', cost:2, dmg:68, effects:[{ type:'selfStatus', status:'regen', turns:2 }] },
    ],
  },
  {
    id:'eika', name:'戎瓔花', type:'幽霊', hp:210, weakness:['仙人','木'],
    moves:[
      { name:'ストーンウッズ',                 element:'岩', cost:0, dmg:18 },
      { name:'ストーンコニファー',             element:'岩', cost:1, dmg:0, targetBench:true, effects:[{ type:'flatBonusDamage', amount:42 }] },
      { name:'アダルトチルドレンズリンボ',     element:'水', cost:2, dmg:65, effects:[{ type:'secondaryBenchDamageRandom', amount:20 }] },
    ],
  },


];

/* ※ 以下の統計はCHAR_DBを変更した際に必ず再集計して更新すること（キャラ追加・種族/弱点変更・わざ属性変更のたび） */
/* ---- キャラクターのtypeと属性の数（全45体） ----
   6...人間   6...妖怪   6...鬼   6...神   4...その他   4...幽霊   4...月人   3...妖精   3...魔法使い   3...仙人
------------------------------------------------------------ */

/* ---- 弱点の数（全キャラのweaknessに出てくる回数） ----
   5...光   5...人間   5...闇   5...火   5...神   5...鬼   5...幽霊   5...岩   5...水   5...木   5...その他
   4...魔法使い   4...星   4...仙人   4...月人   4...氷   3...妖怪
------------------------------------------------------------ */

/* ---- わざの属性の数（全わざのelementの内訳・合計143） ----
   29...無   18...光   16...岩   16...水   15...闇   15...木   13...星   13...火   8...氷
------------------------------------------------------------ */

/* ---- 状態異常一覧 ----
   burn (やけど)  : ターン開始時に固定ダメージ（既定5）。指定ターン継続。
   freeze(凍結)   : そのキャラの攻撃力が75%になる（ターン開始時に残ターンを消費、既定2ターン）。
   regen (再生)   : ターン開始時に固定回復（既定7）。指定ターン継続。自分に付与する用。
   shield(結界)   : 被ダメージを固定値軽減する（既定10）。指定ターン継続。
   random         : 付与時に burn / freeze のどちらかをランダムで選んで適用する。
------------------------------------------------------------ */

/* ---- 持ち物カード ---- */
const ITEM_DB = [
  { id:'omamori',      name:'御守りの札',       desc:'最大HP+40', effect:{ hp:40 } },
  { id:'tekkou',       name:'力の護符',         desc:'攻撃+10',    effect:{ atk:10 } },
  { id:'kekkai_fuda',  name:'弱点無効の護符',   desc:'弱点によるダメージ倍加を無効化する', effect:{ negateWeakness:true } },
  { id:'taihi_kekkai', name:'退避の結界',       desc:'ベンチにいる間はダメージを受けない', effect:{ benchInvulnerable:true } },
  { id:'unzan',        name:'雲山',             desc:'ダメージを受けるたびに相手に8反撃ダメージ（複数回攻撃なら回数分反撃する）', effect:{ counterDamage:8 } },
];

/* ---- 特殊カード ----
   1ターンに1枚まで使用可能。対象が必要なものはメイン・ベンチにドラッグして使う。
------------------------------------------------------------ */
const SPECIAL_DB = [
  { id:'sp_draw4',      name:'秘伝の書',       desc:'山札からカードを4枚引く',                         kind:'special', effectType:'drawCards',  amount:4 },
  { id:'sp_redrawhand', name:'手札再構成',     desc:'手札を山札に戻してから、元の手札枚数と同じ枚数を引く', kind:'special', effectType:'redrawHand', amount:0 },
  { id:'sp_healmain30', name:'高級霊薬',       desc:'メインキャラのHPを45回復',                        kind:'special', effectType:'healMain',   amount:45 },
  { id:'sp_healany20',  name:'回復の護符',     desc:'味方1体のHPを30回復（メイン・ベンチにドラッグ）', kind:'special', effectType:'healAny',    amount:30 },
  { id:'sp_forcedswap', name:'幻惑の術',       desc:'相手のメインとベンチのキャラを入れ替える（入れ替え先は相手が選ぶ）', kind:'special', effectType:'forcedSwap', amount:0 },
  { id:'sp_energyplus3',name:'霊力奔流',       desc:'味方1体にエネルギーを2個追加（霊力エネルギーカードの使用枚数には含まない・ドラッグで対象指定）', kind:'special', effectType:'energyPlus', amount:2 },
  { id:'sp_energyminus1',name:'封印の呪符',    desc:'相手キャラのエネルギーを1個減らす（相手にドラッグ、0のままなら変化なし）', kind:'special', effectType:'energyMinus', amount:1 },
  { id:'sp_teamshield', name:'境界の守り',     desc:'自分のキャラ全員（メイン・ベンチ）の被ダメージを次の相手ターンまで-10する', kind:'special', effectType:'teamShield', amount:10 },
  { id:'sp_gensokyoguide', name:'幻想郷の導き', desc:'山札からランダムにキャラクターカードを3枚見て、1枚を選んで手札に加える（残りは山札に戻す）', kind:'special', effectType:'chooseFromTwo', amount:0 },
  { id:'sp_gap',         name:'スキマ',        desc:'相手のメインと、既にダメージを受けている相手ベンチのキャラを入れ替える（入れ替え先はこのカードの使用者が選ぶ）', kind:'special', effectType:'gapSwap', amount:0 },
  { id:'sp_nuke_bench',  name:'一網打尽',      desc:'相手のベンチ全員に20ダメージ', kind:'special', effectType:'nukeBench', amount:20 },
  { id:'sp_kamikakushi', name:'神隠し',        desc:'自分のベンチのキャラ（HPが半分以上のキャラのみ）を1体、山札へ戻す（normal段階のキャラならeasyとnormalの2枚を戻す）', kind:'special', effectType:'kamikakushi', amount:0 },
  { id:'sp_migawari',    name:'身代わり札',    desc:'次に自分のメインが受けるダメージを半分にする', kind:'special', effectType:'halfDamageNext', amount:0 },
];

/* ---- サポートカード ----
   1ターンに何枚でも使用可能。対象が必要なものは自分のメイン・ベンチにドラッグして使う。
------------------------------------------------------------ */
const SUPPORT_DB = [
  { id:'su_cure',    name:'浄化の札',   desc:'自分のキャラ1体の状態異常を無効化（メイン・ベンチにドラッグ）', kind:'support', effectType:'cureStatus', amount:0 },
  { id:'su_draw2',   name:'見習いの本', desc:'山札から2枚引く',                     kind:'support', effectType:'drawCards',       amount:2 },
  { id:'su_heal10',  name:'常備薬',     desc:'メインキャラのHPを18回復',            kind:'support', effectType:'healMain',        amount:18 },
  { id:'su_search',  name:'仲間の気配', desc:'山札からランダムなキャラクターを引く', kind:'support', effectType:'searchRandomChar', amount:0 },
  { id:'su_search_easy', name:'イージーの気配', desc:'easyのキャラクターの中からランダムで1枚山札から引く', kind:'support', effectType:'searchRandomEasy', amount:0 },
  { id:'su_newspaper', name:'文々。新聞', desc:'相手の手札からランダムに2枚を確認する（相手がそのカードを使うまでずっと見える）', kind:'support', effectType:'revealHandCards', amount:2 },
  { id:'su_scout',     name:'偵察の札',   desc:'山札の上から3枚を見て、1枚を手札に加える（残り2枚は山札に戻してシャッフル）', kind:'support', effectType:'scoutTop3', amount:0 },
  { id:'su_omamori',   name:'お守り札',   desc:'自分のメインの弱点を1ターンだけ無効化する', kind:'support', effectType:'negateWeaknessSelf', amount:0 },
];


const TYPE_COLOR = {
  '人間':'var(--t-human)',
  '妖怪':'var(--t-youkai)',
  '鬼':'var(--t-oni)',
  '幽霊':'var(--t-ghost)',
  '妖精':'var(--t-fairy)',
  '神':'var(--t-kami)',
  '月人':'var(--t-lunarian)',
  '魔法使い':'var(--t-mage)',
  '仙人':'var(--t-sennin)',
  'その他':'var(--t-other)',
};
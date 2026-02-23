import { cardNote } from "../js/cardNote"; // 匯入剛才修正的 78 張繁中對照表

const majorNames = ["the_fool", "the_magician", "the_high_priestess", "the_empress", "the_emperor", "the_hierophant", "the_lovers", "the_chariot", "strength", "the_hermit", "wheel_of_fortune", "justice", "the_hanged_man", "death", "temperance", "the_devil", "the_tower", "the_star", "the_moon", "the_sun", "judgement", "the_world"];
const suits = ["wands", "cups", "swords", "pentacles"];
const ranks = ["01_ace", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11_page", "12_knight", "13_queen", "14_king"];

// 自動生成合併中文名稱的 78 張牌陣列
export const ALL_78_CARDS = [
  // 大牌部分
  ...majorNames.map((name, i) => {
    const zhInfo = cardNote.find(note => note.id === i);
    return {
      id: i,
      name: name,
      name_zh: zhInfo ? zhInfo.name : "未知",
      img: `/cards/major_${i.toString().padStart(2, '0')}_${name}.jpg`
    };
  }),
  // 小牌部分
  ...suits.flatMap((suit) => 
    ranks.map((rank, i) => {
      const cardId = 22 + (suits.indexOf(suit) * 14) + i;
      const zhInfo = cardNote.find(note => note.id === cardId);
      return {
        id: cardId,
        name: `${suit}_${rank}`,
        name_zh: zhInfo ? zhInfo.name : "未知",
        img: `/cards/${suit}_${rank}.jpg`
      };
    })
  )
];
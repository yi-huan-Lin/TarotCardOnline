

import { useState, useMemo, useCallback } from 'react';
import { ALL_78_CARDS } from '../constants/cards';

const useCardShuffle = () => {
  // 使用 gameId 作為觸發洗牌的關鍵，每次重洗就更新它
  const [gameId, setGameId] = useState(Date.now());

  // 提供一個外部可以觸發重新洗牌的函式
  const shuffleCards = useCallback(() => {
    setGameId(Date.now());
  }, []);

  const tarotCards = useMemo(() => {
    // 1. 淺拷貝一份原始牌組，避免直接修改常量
    let shuffled = [...ALL_78_CARDS];

    // 2. Fisher-Yates 洗牌演算法 (最公平、最打亂的方式)
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
   
    // 3. 封裝結構，並隨機賦予 isReversed (正逆位)
    return shuffled.map(card => ({
      card: card, // 包含原本的 id, name, name_zh, img
      isReversed: Math.random() > 0.5, // 50% 機率逆位
    }));
  }, [gameId]);

  return { tarotCards, shuffleCards, gameId };
};

export  {useCardShuffle} ;


import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


const CardDeck = ({ gameId, cards, onPickCard, selectedCards = [] }) => {

  console.log('selectedCards', selectedCards)

  const [hasExpanded, setHasExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. 過濾掉已抽出的牌
  const availableCards = useMemo(() => {
    return cards.filter((allCard) => {
      return !selectedCards.some((selected) => selected.cardId === allCard.card.id);
    });
  }, [selectedCards]);

  // 2. 【核心優化】限制渲染數量
  // 如果牌數過多，我們只取最後面的 35 張來顯示（最上面的牌）
  // 這樣使用者點擊到的永遠是「最上面」的那幾張，且視覺厚度依然足夠
  const MAX_DISPLAY = isMobile ? 35 : 55;
  const displayCards = useMemo(() => {
    return availableCards.slice(-MAX_DISPLAY);
  }, [availableCards, MAX_DISPLAY]);

  return (
    <div
      className="deck-container"
      onMouseEnter={() => setHasExpanded(true)}
      onTouchStart={() => setHasExpanded(true)}
      style={{      
        width: '100%',        
        alignItems: 'flex-end',
        display: 'flex',
        justifyContent: 'center',
        bottom: 0,
        padding:10,       
        perspective: '1000px',
        zIndex: 10,           // 確保在背景之上
      }}
    >
      <AnimatePresence>
        {displayCards.map((card, index) => {
          const total = displayCards.length;
          const ratio = (index - total / 2);

          // 1. 旋轉與 X 軸保持原樣
          const rotate = hasExpanded ? ratio * (isMobile ? 2.5 : 1.8) : ratio * 0.1;
          const x = hasExpanded ? ratio * (isMobile ? 6 : 12) : 0;

          // 2. 關鍵修正：y 座標的邏輯
          // 我們設定一個 baseHeight，這是牌堆「收納時」露出來的高度
          const baseHeight = isMobile ? 40 : 70;

          // arcY 只有在展開時才計算弧度，收起時為 0
          const arcY = hasExpanded
            ? Math.pow(Math.abs(ratio), 2) * (isMobile ? 0.15 : 0.1)
            : 0;

          // 下沉補償：確保展開後整體位置不會太高
          const offsetDown = hasExpanded ? (isMobile ? 80 : 120) : 0;

          // 最終 y：收起時位於 baseHeight，展開時計算弧度並加上下沉量
          const y = baseHeight + arcY + offsetDown;

          return (
            <motion.div
              key={card.card.id}
              animate={{
                rotate,
                x,
                y,
                opacity: 1 // 確保載入時透明度正常
              }}
              initial={{ opacity: 0, y: 200 }} // 第一次載入時從最下方升起

              exit={{ y: -300, opacity: 0, scale: 0.5 }}
              onClick={() => onPickCard(card.card.img, card.card.id, card.card.name_zh)}
              whileHover={!isMobile ? {
                y: y - 50,
                scale: 1.15,
                zIndex: 100,
                transition: { duration: 0.2 }
              } : {}}
              // 4. 優化動畫設定：降低 Stiffness 減少重繪頻率
              transition={{
                type: 'spring',
                stiffness: 90,
                damping: 20,
                mass: 1
              }}
              style={{
                position: 'absolute',
                width: isMobile ? '36px' : '48px',
                height: isMobile ? '57px' : '96px',
                originY: isMobile ? '160%' : '220%',
                backgroundImage: 'url("/cards/TarDefault.jpg")',
                backgroundSize: 'cover',
                borderRadius: '6px',
                cursor: 'pointer',
                zIndex: index,
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                // 5. 強制開啟 GPU 加速
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export { CardDeck };
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


const CardDeck = ({ gameId, cards, onPickCard, selectedCards = [] }) => {

  console.log('selectedCards', selectedCards)

  const [hasExpanded, setHasExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hoveredId, setHoveredId] = useState(null);
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
        position: 'relative', // 關鍵
        width: '100%',
        height: isMobile ? '200px' : '350px', // 給予足夠的容器空間
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end', // 所有卡片初始都貼在底部
        overflow: 'visible', // 允許卡片向上彈出容器
        bottom: isMobile ? '20px' : '40px', // 讓容器底部留白
      }}
    >
      <AnimatePresence>
        {displayCards.map((card, index) => {
          const total = displayCards.length;
          const ratio = (index - total / 2);
          const isTarget = hoveredId === card.card.id;
          const isSomeoneElseHovered = hoveredId !== null && !isTarget;
          // 1. 基礎高度 (負值 = 向上提)
          const baseUp = hasExpanded ? (isMobile ? -120 : -160) : (isMobile ? -30 : -40);

          // 2. 修正後的弧度偏移：將計算結果乘上 -1 (負負得正的邏輯，這裡要確保它是負的)
          // 我們希望中間高 (ratio=0 時偏移小)，兩側低 (ratio大時偏移大，也就是 y 值變大，變回正數)
          // 所以 arc 應該要是正值，用來抵消掉負的 baseUp

          const arcOffset = hasExpanded
            ? Math.pow(Math.abs(ratio), 2) * (isMobile ? 0.2 : 0.15) // 這是正數
            : 0;

          // 最終 Y：基礎負值 + 正值偏移 = 兩側會往下掉，形成彩虹狀
          const y = baseUp + arcOffset;

          // 3. 旋轉與 X 維持
          const rotate = hasExpanded ? ratio * (isMobile ? 2.5 : 2.0) : ratio * 0.1;
          const x = hasExpanded ? ratio * (isMobile ? 6 : 12) : 0;

          return (
            <motion.div
              key={card.card.id}
              onMouseEnter={() => setHoveredId(card.card.id)}
              onMouseLeave={() => setHoveredId(null)}
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
                y: y - 10,
                scale: 1.1,
                zIndex: 10,
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
                pointerEvents: isSomeoneElseHovered ? 'none' : 'auto',
                zIndex: isTarget ? 100 : index, // 被選中的牌 zIndex 噴高
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
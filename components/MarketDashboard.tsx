import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change: number; // Percentage
  history: number[]; // For chart
}

const MAX_HISTORY = 50;

export const MarketDashboard: React.FC = () => {
  const [btc, setBtc] = useState<MarketItem>({ symbol: 'BTC', name: 'Bitcoin', price: 0, change: 0, history: [] });
  const [sp500, setSp500] = useState<MarketItem>({ symbol: 'SPX', name: 'S&P 500', price: 4120.50, change: 0.05, history: Array(MAX_HISTORY).fill(4120) });
  const [hsi, setHsi] = useState<MarketItem>({ symbol: 'HSI', name: 'Hang Seng', price: 17800.00, change: -0.2, history: Array(MAX_HISTORY).fill(17800) });

  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});

  // 1. Binance WebSocket for BTC
  useEffect(() => {
    let ws: WebSocket | null = null;
    
    const connect = () => {
        ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
        
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          const price = parseFloat(data.p);
          
          setBtc(prev => {
            const newHistory = [...prev.history, price].slice(-MAX_HISTORY);
            // Simulate 24h change deviation for visual purpose since stream doesn't give 24h open
            // We assume the first point we gathered is the reference for "session change"
            const startPrice = prev.history.length > 0 ? prev.history[0] : price; 
            const change = startPrice !== 0 ? ((price - startPrice) / startPrice) * 100 : 0;
            
            return {
              ...prev,
              price,
              change,
              history: newHistory
            };
          });
        };

        ws.onclose = () => {
            // Reconnect logic could go here
        };
    }

    connect();
    return () => ws?.close();
  }, []);

  // 2. Monte Carlo Simulation for Indices (Random Walk)
  useEffect(() => {
    const interval = setInterval(() => {
        // SPX Simulation
        setSp500(prev => {
            const volatility = 0.8; 
            const move = (Math.random() - 0.5) * volatility;
            let newPrice = prev.price + move;
            // Prevent going below 0 (unlikely)
            newPrice = Math.max(0, newPrice);
            
            const newHistory = [...prev.history, newPrice].slice(-MAX_HISTORY);
            const startPrice = prev.history.length > 0 ? prev.history[0] : newPrice;
            const change = ((newPrice - startPrice) / startPrice) * 100;

            return { ...prev, price: newPrice, change, history: newHistory };
        });

        // HSI Simulation
        setHsi(prev => {
            const volatility = 5.0; 
            const move = (Math.random() - 0.5) * volatility;
            let newPrice = prev.price + move;
            newPrice = Math.max(0, newPrice);

            const newHistory = [...prev.history, newPrice].slice(-MAX_HISTORY);
            const startPrice = prev.history.length > 0 ? prev.history[0] : newPrice;
            const change = ((newPrice - startPrice) / startPrice) * 100;

            return { ...prev, price: newPrice, change, history: newHistory };
        });

    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  // 3. Draw Charts
  useEffect(() => {
    [btc, sp500, hsi].forEach(item => {
        const canvas = canvasRefs.current[item.symbol];
        if (!canvas || item.history.length < 2) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        // Normalize
        const min = Math.min(...item.history);
        const max = Math.max(...item.history);
        const range = max - min || 1; // Avoid divide by zero

        ctx.beginPath();
        item.history.forEach((val, i) => {
            const x = (i / (MAX_HISTORY - 1)) * width;
            // Add some padding to top/bottom so graph doesn't touch edges perfectly
            const normalizedVal = (val - min) / range;
            const y = height - (normalizedVal * (height * 0.8) + height * 0.1); 
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });

        // Stroke
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = item.change >= 0 ? '#10b981' : '#f43f5e'; // Emerald-500 or Rose-500
        ctx.stroke();

        // Gradient Fill
        const lastX = width;
        const lastY = height;
        const firstX = 0;
        
        ctx.lineTo(lastX, lastY);
        ctx.lineTo(firstX, lastY);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, item.change >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = gradient;
        ctx.fill();
    });
  }, [btc, sp500, hsi]);

  const renderCard = (item: MarketItem) => (
    <div key={item.symbol} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group hover:border-yellow-600/30 transition-colors">
       <div className="flex justify-between items-start z-10 relative">
           <div>
               <div className="flex items-center space-x-2">
                   <span className="text-slate-400 text-xs font-bold font-mono tracking-wider">{item.symbol}</span>
                   {item.symbol === 'BTC' && <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]" />}
               </div>
               <div className="text-white font-bold text-lg mt-1 tabular-nums font-mono">
                  {item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
               </div>
           </div>
           <div className={`text-xs font-bold px-2 py-1 rounded flex items-center border ${item.change >= 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
               {item.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
               {Math.abs(item.change).toFixed(2)}%
           </div>
       </div>
       
       {/* Chart Canvas */}
       <div className="h-12 w-full mt-4 opacity-50 group-hover:opacity-100 transition-opacity relative z-0">
           <canvas 
             ref={el => { canvasRefs.current[item.symbol] = el; }}
             width={300} // Higher res logic pixels
             height={100}
             className="w-full h-full block"
           />
       </div>
    </div>
  );

  return (
    <div className="mb-8 animate-fade-in">
        <div className="flex items-center space-x-2 mb-4 px-1">
             <Activity className="w-4 h-4 text-yellow-500" />
             <h3 className="text-xs font-bold text-yellow-500/70 uppercase tracking-widest">Global Markets Pulse</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderCard(btc)}
            {renderCard(sp500)}
            {renderCard(hsi)}
        </div>
    </div>
  );
};

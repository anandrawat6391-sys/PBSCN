import React from 'react';
import {
  buildUpiPaymentUri,
  generateDeterministicQrMatrix,
} from '../utils/pbscnRules';

interface BharatQrWidgetProps {
  upiId: string;
  payeeName: string;
  amount: number;
  transactionNote: string;
  size?: number;
}

export const BharatQrWidget: React.FC<BharatQrWidgetProps> = ({
  upiId,
  payeeName,
  amount,
  transactionNote,
  size = 156,
}) => {
  const upiUri = buildUpiPaymentUri({
    upiId,
    payeeName,
    amount,
    transactionNote,
  });
  const matrix = generateDeterministicQrMatrix(upiUri);
  const gridCount = matrix.length;

  return (
    <div className="flex flex-col items-center">
      <div
        className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs inline-block"
        role="img"
        aria-label={`BharatQR UPI code for ${payeeName} (${upiId}) pre-filled with ₹${amount}`}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${gridCount} ${gridCount}`}
          shapeRendering="crispEdges"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width={gridCount} height={gridCount} fill="#FFFFFF" />
          {matrix.map((row, rIdx) =>
            row.map((cell, cIdx) =>
              cell ? (
                <rect
                  key={`${rIdx}-${cIdx}`}
                  x={cIdx}
                  y={rIdx}
                  width={1}
                  height={1}
                  fill="#0F172A"
                />
              ) : null
            )
          )}
          {/* Center BharatQR / UPI Emblem */}
          <rect x="8.5" y="8.5" width="4" height="4" rx="0.6" fill="#1E3A8A" />
          <circle cx="10.5" cy="10.5" r="1.2" fill="#F59E0B" />
        </svg>
      </div>
      <div className="mt-2 text-center">
        <p className="text-xs text-slate-700 font-mono-tabular">
          UPI ID: <span className="text-[#1E3A8A] font-semibold">{upiId}</span> · <span className="font-bold text-amber-700">₹{amount}</span>
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[240px]" title={upiUri}>
          GPay · PhonePe · Paytm · BHIM से सीधा ट्रांसफर
        </p>
      </div>
    </div>
  );
};

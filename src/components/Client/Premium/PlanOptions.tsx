import React from 'react'
import { Check } from 'lucide-react'

interface Plan {
  code: 'ONE_MONTH' | 'SIX_MONTHS' | 'ONE_YEAR';
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  save: number;
  popular?: boolean;
}

interface PlanOptionsProps {
  plans: Plan[];
  selectedPlan: 'ONE_MONTH' | 'SIX_MONTHS' | 'ONE_YEAR';
  onSelectPlan: (planCode: 'ONE_MONTH' | 'SIX_MONTHS' | 'ONE_YEAR') => void;
  formatPrice: (value: number) => string;
}

export const PlanOptions: React.FC<PlanOptionsProps> = ({
  plans,
  selectedPlan,
  onSelectPlan,
  formatPrice,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((p) => {
        const isSelected = selectedPlan === p.code
        return (
          <div 
            key={p.code}
            onClick={() => onSelectPlan(p.code)}
            className={`relative glass rounded-2xl p-6 flex flex-col justify-between cursor-pointer border transition-all duration-300 hover:scale-[1.02] ${
              isSelected 
                ? 'border-primary/50 ring-2 ring-primary/20 shadow-[0_10px_30px_rgba(var(--primary),0.05)]' 
                : 'border-border/50 hover:border-border'
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-[10px] font-black bg-primary text-primary-foreground tracking-wider uppercase shadow-md">
                PHỔ BIẾN NHẤT
              </span>
            )}
            {p.save > 0 && (
              <span className="absolute top-4 left-4 px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Tiết kiệm {p.save}%
              </span>
            )}

            <div className="pt-4">
              <h3 className="font-extrabold text-lg text-foreground mb-1">{p.name}</h3>
              <p className="text-xs text-muted-foreground min-h-[48px] line-clamp-3 leading-relaxed mb-4">{p.description}</p>
              
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-3xl font-black text-foreground">{formatPrice(p.price)}</span>
              </div>
              {p.save > 0 && (
                <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/60 block">
                  {formatPrice(p.originalPrice)}
                </span>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-border/30">
              <div className="w-full flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Chọn gói này</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
};

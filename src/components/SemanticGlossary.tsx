"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  ShieldAlert, 
  Plus, 
  Trash2, 
  HelpCircle,
  Hash,
  Scale
} from 'lucide-react';

interface SemanticRule {
  name: string;
  formula: string;
}

interface SemanticGlossaryProps {
  rules: SemanticRule[];
  onAddRule: (rule: SemanticRule) => void;
  onRemoveRule: (index: number) => void;
}

export function SemanticGlossary({ rules, onAddRule, onRemoveRule }: SemanticGlossaryProps) {
  const [ruleName, setRuleName] = useState('');
  const [ruleFormula, setRuleFormula] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim() || !ruleFormula.trim()) {
      toast.error('Please enter both rule name and formula!');
      return;
    }

    // Check if duplicate name
    if (rules.some(r => r.name.toLowerCase() === ruleName.trim().toLowerCase())) {
      toast.error('A rule with this name already exists!');
      return;
    }

    onAddRule({
      name: ruleName.trim(),
      formula: ruleFormula.trim()
    });

    toast.success(`Successfully added semantic rule "${ruleName}"!`);
    setRuleName('');
    setRuleFormula('');
  };

  const defaultTemplates = [
    { name: 'ROI', formula: '(Revenue - Ad Spend) / Ad Spend' },
    { name: 'ARPU', formula: 'Total MRR / Total Active Customers' },
    { name: 'Gross Margin', formula: '(Sales - Cost of Goods) / Sales' }
  ];

  const handleApplyTemplate = (tpl: SemanticRule) => {
    if (rules.some(r => r.name.toLowerCase() === tpl.name.toLowerCase())) {
      toast.info(`"${tpl.name}" rule is already active.`);
      return;
    }
    onAddRule(tpl);
    toast.success(`Applied glossary rule "${tpl.name}"!`);
  };

  return (
    <Card className="border border-primary/10 rounded-2xl shadow-sm bg-card/45 backdrop-blur-md overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Scale className="h-24 w-24" />
      </div>

      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ShieldAlert className="h-4.5 w-4.5 text-primary" />
            AI Semantic glossary / Rule Book
          </CardTitle>
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-0 font-bold">
            0 Hallucinations
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Establish deterministic formulas for the AI Chat Agent. Stop metrics calculation errors instantly.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Glossary rule creation form */}
        <form onSubmit={handleAdd} className="flex gap-2 items-center flex-wrap">
          <div className="flex-1 min-w-[120px]">
            <Input
              placeholder="e.g. ROI, Gross Margin"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              className="text-xs h-9 rounded-xl pl-3 pr-3"
            />
          </div>
          <div className="flex-[2] min-w-[200px]">
            <Input
              placeholder="Formula: (Sales - Cost) / Sales"
              value={ruleFormula}
              onChange={(e) => setRuleFormula(e.target.value)}
              className="text-xs h-9 rounded-xl pl-3 pr-3"
            />
          </div>
          <Button type="submit" size="sm" className="h-9 rounded-xl font-bold px-3 shadow-md flex items-center gap-1">
            <Plus className="h-3.5 w-3.5" />
            Add Rule
          </Button>
        </form>

        {/* Recommended templates */}
        {rules.length === 0 && (
          <div className="space-y-1.5 pt-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5 text-primary/75" />
              Recommended Quick Templates
            </h4>
            <div className="flex flex-wrap gap-2">
              {defaultTemplates.map((tpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className="px-2.5 py-1 text-[10px] font-semibold border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors flex items-center gap-1 text-foreground/80 hover:text-primary"
                >
                  <Hash className="h-3 w-3" />
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Rules List */}
        {rules.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Active Glossary Rules ({rules.length})</h4>
            <div className="max-h-[140px] overflow-y-auto space-y-2 pr-1">
              {rules.map((rule, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-border/40 bg-muted/15 hover:bg-muted/30 transition-all group"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-foreground/90 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 bg-primary rounded-full" />
                      {rule.name}
                    </span>
                    <p className="font-mono text-[9px] text-muted-foreground mt-0.5 pl-3">{rule.formula}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveRule(i)}
                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

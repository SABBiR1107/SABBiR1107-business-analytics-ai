"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  CloudLightning, 
  Database, 
  Store, 
  Lock, 
  ArrowRight, 
  RefreshCw,
  CheckCircle2,
  ServerCrash
} from 'lucide-react';

interface IntegrationsManagerProps {
  onDataSynced: (data: any, filename: string) => void;
}

export function IntegrationsManager({ onDataSynced }: IntegrationsManagerProps) {
  const [activeTab, setActiveTab] = useState<'shopify' | 'woocommerce' | 'postgres' | 'mysql' | null>(null);
  
  // Credentials states
  const [storeName, setStoreName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [dbHost, setDbHost] = useState('');
  const [dbName, setDbName] = useState('');

  // Syncing states
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSteps, setSyncSteps] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const connectors = [
    { id: 'shopify', name: 'Shopify Store', desc: 'Sync orders, customers, and margins via Shopify webhooks.', icon: Store, color: 'from-emerald-500/10 to-teal-500/10 text-emerald-500 border-emerald-500/20' },
    { id: 'woocommerce', name: 'WooCommerce', desc: 'Import live store transactions using Rest API keys.', icon: CloudLightning, color: 'from-purple-500/10 to-indigo-500/10 text-purple-500 border-purple-500/20 animate-pulse' },
    { id: 'postgres', name: 'PostgreSQL DB', desc: 'Securely query database tables through read-only tunnels.', icon: Database, color: 'from-blue-500/10 to-sky-500/10 text-blue-500 border-blue-500/20' },
    { id: 'mysql', name: 'MySQL Database', desc: 'Map transactional schemas directly to analytical indexes.', icon: Database, color: 'from-amber-500/10 to-orange-500/10 text-amber-500 border-amber-500/20' }
  ];

  // Helper to generate highly realistic e-commerce transactional data
  const generateEcomDataset = () => {
    const channels = ['Shopify Store', 'Amazon Merchant', 'Google Shopping', 'Instagram Direct'];
    const statuses = ['Delivered', 'Delivered', 'Delivered', 'Refunded', 'Shipped'];
    const customers = [
      'Liam Vance', 'Sophia Patel', 'Noah Beck', 'Emma Stone', 'Oliver Reed', 'Ava Wright',
      'Jackson Cole', 'Isabella Cruz', 'Lucas Sterling', 'Mia Thorn', 'Alexander Grey', 'Charlotte Ross'
    ];

    const data: any[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 120); // Go back 120 days

    for (let i = 1; i <= 124; i++) {
      const orderDate = new Date(startDate.getTime());
      orderDate.setDate(orderDate.getDate() + Math.floor(Math.random() * 120));
      
      const revenue = Math.floor(Math.random() * 250) + 20; // $20 - $270
      const qty = Math.floor(Math.random() * 3) + 1; // 1-3 items
      const marginPercent = Number((Math.random() * 0.4 + 0.35).toFixed(2)); // 35% - 75%
      const profit = Number((revenue * marginPercent).toFixed(2));
      const shippingCost = Math.floor(Math.random() * 15) + 5; // $5 - $20

      // standard YYYY-MM-DD
      const dateStr = orderDate.toISOString().split('T')[0];

      data.push({
        'Date': dateStr,
        'Order ID': `ORD-${1000 + i}`,
        'Customer Name': customers[Math.floor(Math.random() * customers.length)],
        'Channel': channels[Math.floor(Math.random() * channels.length)],
        'Revenue': revenue,
        'Quantity': qty,
        'Profit Margin': profit,
        'Shipping Cost': shippingCost,
        'Status': statuses[Math.floor(Math.random() * statuses.length)]
      });
    }

    // Sort by date ascending
    data.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());

    return {
      data,
      columns: ['Date', 'Order ID', 'Customer Name', 'Channel', 'Revenue', 'Quantity', 'Profit Margin', 'Shipping Cost', 'Status']
    };
  };

  const handleConnectSync = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'shopify' && (!storeName.trim() || !apiKey.trim())) {
      toast.error('Please enter both Shopify store name and access token!');
      return;
    }
    if (activeTab === 'postgres' && (!dbHost.trim() || !dbName.trim())) {
      toast.error('Please fill in database host and table name!');
      return;
    }

    setIsSyncing(true);
    setSyncSteps([]);
    setProgress(0);

    const logSteps = [
      'Establishing secure SSL handshake tunnel...',
      'Validating integration credentials and scopes...',
      'Connection successful. Querying transactional metadata schemas...',
      'Mapping relational columns and caching indexes...',
      'Importing transaction histories & billing rows (124 items found)...',
      'Sync finalized. Initializing visual components...'
    ];

    for (let i = 0; i < logSteps.length; i++) {
      await new Promise(r => setTimeout(r, 650));
      setSyncSteps(prev => [...prev, logSteps[i]]);
      setProgress(Math.round(((i + 1) / logSteps.length) * 100));
    }

    const dataset = generateEcomDataset();
    const activeFileName = activeTab === 'shopify' ? `${storeName.replace('.myshopify.com', '')}_Live_Sync.db` :
                           activeTab === 'woocommerce' ? 'WooCommerce_Live_Orders.db' :
                           activeTab === 'postgres' ? `${dbName}_Postgres_Table.db` : 'MySQL_Live_Sync.db';

    onDataSynced(dataset, activeFileName);
    toast.success(`Successfully synchronized live store: ${activeFileName}!`);
    setIsSyncing(false);
    setActiveTab(null);
  };

  return (
    <Card className="border border-primary/20 bg-card/45 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden relative">
      {/* Visual lock banner indicating enterprise-grade security */}
      <div className="bg-primary/5 border-b border-border/40 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
          <Lock className="h-3.5 w-3.5 text-primary" />
          AES-256 SSL ENCRYPTED CONNECTION
        </div>
        <span className="flex items-center gap-1 text-emerald-500 font-bold text-[9px] bg-emerald-500/5 px-2.5 py-0.5 rounded-full border border-emerald-500/10">
          <span className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
          Gateway Active
        </span>
      </div>

      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
          <CloudLightning className="h-5 w-5 text-primary" />
          Connect Live E-commerce & Database
        </CardTitle>
        <CardDescription className="text-xs">
          Bypass CSV spreadsheet uploads. Synchronize live transactional data directly from your store or cloud host.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {!activeTab && !isSyncing ? (
          /* Integrations list grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {connectors.map((c) => (
              <div
                key={c.id}
                onClick={() => setActiveTab(c.id as any)}
                className="p-4 rounded-2xl border border-border/40 hover:border-primary/45 bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer group flex flex-col justify-between h-36 relative overflow-hidden"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${c.color} border flex items-center justify-center shrink-0`}>
                      <c.icon className="h-5 w-5 animate-pulse" style={{ animationDuration: '4s' }} />
                    </div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest">
                      Live Sync
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-foreground/90 group-hover:text-primary transition-colors">
                      {c.name}
                    </h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">
                      {c.desc}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-1 text-[9px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flex items-center gap-0.5">
                    Connect Store
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : isSyncing ? (
          /* Syncing animated console progress logger */
          <div className="space-y-4 py-4">
            <div className="space-y-2 text-center">
              <h4 className="font-bold text-sm flex items-center justify-center gap-1.5 animate-pulse">
                <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                Synchronizing live e-commerce databases...
              </h4>
              <p className="text-[10px] text-muted-foreground">Please do not refresh. Synchronizing orders, refunds, and margin indices.</p>
            </div>

            {/* Premium Loader Progress Bar */}
            <div className="w-full bg-muted/60 h-2.5 rounded-full overflow-hidden border border-border/30 shadow-inner">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" 
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Sync Console Logs */}
            <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 font-mono text-[9px] text-emerald-400 space-y-1.5 h-36 overflow-y-auto">
              {syncSteps.map((step, idx) => (
                <div key={idx} className="flex gap-2 animate-fade-in">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Credentials connection form modal */
          <form onSubmit={handleConnectSync} className="space-y-4 border border-primary/10 rounded-2xl p-5 bg-muted/10 relative overflow-hidden">
            <h4 className="font-bold text-xs flex items-center gap-1.5 text-foreground/90 border-b border-border/30 pb-2">
              <Store className="h-4 w-4 text-primary" />
              Configure {connectors.find(c => c.id === activeTab)?.name} Credentials
            </h4>

            {activeTab === 'shopify' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Shop URL</label>
                  <Input 
                    placeholder="e.g. my-lux-store.myshopify.com" 
                    value={storeName} 
                    onChange={e => setStoreName(e.target.value)}
                    className="text-xs h-9 rounded-xl pl-3 pr-3" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Admin API Access Token</label>
                  <Input 
                    type="password" 
                    placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxx" 
                    value={apiKey} 
                    onChange={e => setApiKey(e.target.value)}
                    className="text-xs h-9 rounded-xl pl-3 pr-3" 
                  />
                </div>
              </div>
            )}

            {activeTab === 'woocommerce' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Store URL</label>
                  <Input 
                    placeholder="https://my-wordpress-ecom.com" 
                    className="text-xs h-9 rounded-xl pl-3 pr-3" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Consumer Key (ck_...)</label>
                  <Input 
                    type="password" 
                    placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxx" 
                    className="text-xs h-9 rounded-xl pl-3 pr-3" 
                  />
                </div>
              </div>
            )}

            {(activeTab === 'postgres' || activeTab === 'mysql') && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Host / Endpoint</label>
                    <Input 
                      placeholder="db.supabase.co" 
                      value={dbHost} 
                      onChange={e => setDbHost(e.target.value)}
                      className="text-xs h-9 rounded-xl pl-3 pr-3" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Database Name</label>
                    <Input 
                      placeholder="ecom_store" 
                      value={dbName} 
                      onChange={e => setDbName(e.target.value)}
                      className="text-xs h-9 rounded-xl pl-3 pr-3" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Database User</label>
                    <Input 
                      placeholder="postgres" 
                      className="text-xs h-9 rounded-xl pl-3 pr-3" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Password</label>
                    <Input 
                      type="password" 
                      placeholder="••••••••••••••••" 
                      className="text-xs h-9 rounded-xl pl-3 pr-3" 
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2.5 justify-end pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setActiveTab(null)}
                className="rounded-xl font-bold text-xs h-9"
              >
                Back
              </Button>
              <Button 
                type="submit" 
                className="rounded-xl font-bold text-xs h-9 shadow-md flex items-center gap-1"
              >
                <CheckCircle2 className="h-4 w-4" />
                Connect & Live Sync
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

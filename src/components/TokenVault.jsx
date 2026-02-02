import { Key, CheckCircle2, Lock } from 'lucide-react';

export default function TokenVault({ token, onTokenChange }) {
  return (
    <div className="mb-6 p-6 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm uppercase tracking-widest text-blue-400 flex items-center gap-3 font-bold">
          <Key size={18} /> Hugging Face Token
        </label>
        {token && (
          <span className="text-xs text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
            Active
          </span>
        )}
      </div>

      <input
        type="password"
        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-5 py-4 text-lg focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="hf_..."
        value={token}
        onChange={(e) => onTokenChange(e.target.value)}
      />
      <p className="text-xs text-slate-500 mt-3 flex items-center gap-2 italic">
        <Lock size={12} /> Stored locally in your browser.
      </p>
    </div>
  );
}
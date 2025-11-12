
import React from 'react';
import { Professional, Client } from '../types';

interface SidebarProps {
  professionals: Professional[];
  clients: Client[];
  selectedProfessionals: string[];
  selectedClients: string[];
  onToggleProfessional: (id: string) => void;
  onToggleClient: (id: string) => void;
  onClearProfessionals: () => void;
  onSelectAllProfessionals: () => void;
  onClearClients: () => void;
  onSelectAllClients: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  professionals,
  clients,
  selectedProfessionals,
  selectedClients,
  onToggleProfessional,
  onToggleClient,
  onClearProfessionals,
  onSelectAllProfessionals,
  onClearClients,
  onSelectAllClients
}) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col gap-6 overflow-y-auto">
      <h2 className="text-lg font-bold text-slate-800">Filters</h2>

      {/* Professionals Filter */}
      <div>
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-slate-700">Professionals</h3>
            <div className="text-xs">
                <button onClick={onSelectAllProfessionals} className="text-sky-600 hover:underline">All</button> | <button onClick={onClearProfessionals} className="text-sky-600 hover:underline">None</button>
            </div>
        </div>
        <div className="space-y-2">
          {professionals.map(p => (
            <label key={p.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedProfessionals.includes(p.id)}
                onChange={() => onToggleProfessional(p.id)}
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-sm text-slate-600">{p.staff_name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clients Filter */}
      <div>
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-slate-700">Clients</h3>
            <div className="text-xs">
                <button onClick={onSelectAllClients} className="text-sky-600 hover:underline">All</button> | <button onClick={onClearClients} className="text-sky-600 hover:underline">None</button>
            </div>
        </div>
        <div className="space-y-2">
          {clients.map(c => (
            <label key={c.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedClients.includes(c.id)}
                onChange={() => onToggleClient(c.id)}
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-sm text-slate-600">{c.client_name}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

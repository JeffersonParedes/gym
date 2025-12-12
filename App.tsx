import React, { useState, useEffect } from 'react';
import { View, Member, Payment, Attendance } from './types';
import * as DataService from './services/dataService';

// Icons
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  ClipboardCheck, 
  Dumbbell, 
  Menu,
  X
} from 'lucide-react';

// Components
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import AttendanceComp from './components/Attendance';
import Routines from './components/Routines';

// Finance component inline for brevity in file count limit, usually separate
const Finance: React.FC<{ payments: Payment[], members: Member[], onAddPayment: (p: Payment) => void }> = ({ payments, members, onAddPayment }) => {
  const [amount, setAmount] = useState('');
  const [memberId, setMemberId] = useState('');
  
  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    
    // In a real app, you would select concept, method, etc.
    const newPayment = DataService.addPayment({
      memberId: member.id,
      memberName: `${member.firstName} ${member.lastName}`,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
      method: 'Efectivo',
      concept: 'Mensualidad'
    });
    
    // Also update member status if needed (mock logic)
    if (member.status !== 'Activo') {
       DataService.updateMember({...member, status: 'Activo' as any });
    }

    onAddPayment(newPayment);
    setAmount('');
    setMemberId('');
    alert('Pago registrado correctamente');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Finanzas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Form */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h3 className="text-lg font-semibold mb-4">Registrar Pago</h3>
            <form onSubmit={handlePay} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700">Socio</label>
                  <select required className="w-full border p-2 rounded-lg" value={memberId} onChange={e => setMemberId(e.target.value)}>
                    <option value="">Seleccionar...</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>)}
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700">Monto (S/)</label>
                  <input required type="number" className="w-full border p-2 rounded-lg" value={amount} onChange={e => setAmount(e.target.value)} />
               </div>
               <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Registrar Ingreso</button>
            </form>
         </div>
         
         {/* List */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Últimos Pagos</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {payments.slice().reverse().map(p => (
                <div key={p.id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                   <div>
                      <p className="font-medium">{p.memberName}</p>
                      <p className="text-xs text-gray-500">{new Date(p.date).toLocaleDateString()}</p>
                   </div>
                   <div className="font-bold text-green-600">
                     + S/ {p.amount.toFixed(2)}
                   </div>
                </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // App State
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  // Load Initial Data
  const refreshData = () => {
    setMembers(DataService.getMembers());
    setPayments(DataService.getPayments());
    setAttendance(DataService.getAttendance());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        currentView === view
          ? 'bg-indigo-600 text-white shadow-md'
          : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-[#F3F4F6]">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-10">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-indigo-700">
             <Dumbbell size={32} />
             <h1 className="text-xl font-bold tracking-tight">CLUB CROSS-X</h1>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <NavItem view={View.MEMBERS} icon={Users} label="Socios" />
          <NavItem view={View.ATTENDANCE} icon={ClipboardCheck} label="Asistencia" />
          <NavItem view={View.FINANCE} icon={Wallet} label="Finanzas" />
          <NavItem view={View.ROUTINES} icon={Dumbbell} label="Rutinas IA" />
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="bg-indigo-50 p-4 rounded-xl">
             <p className="text-xs text-indigo-600 font-semibold mb-1">Membresía Pro</p>
             <p className="text-xs text-gray-500">Firebase Mode: Simulated</p>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed w-full bg-white z-20 border-b border-gray-200 p-4 flex justify-between items-center">
         <div className="flex items-center gap-2 text-indigo-700">
             <Dumbbell size={24} />
             <h1 className="text-lg font-bold">CLUB CROSS-X</h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-10 pt-20 px-4 space-y-2 md:hidden">
          <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <NavItem view={View.MEMBERS} icon={Users} label="Socios" />
          <NavItem view={View.ATTENDANCE} icon={ClipboardCheck} label="Asistencia" />
          <NavItem view={View.FINANCE} icon={Wallet} label="Finanzas" />
          <NavItem view={View.ROUTINES} icon={Dumbbell} label="Rutinas IA" />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {currentView === View.DASHBOARD && (
            <Dashboard members={members} payments={payments} attendance={attendance} />
          )}
          {currentView === View.MEMBERS && (
            <Members members={members} onDataChange={refreshData} />
          )}
          {currentView === View.ATTENDANCE && (
            <AttendanceComp members={members} attendanceHistory={attendance} onDataChange={refreshData} />
          )}
          {currentView === View.FINANCE && (
            <Finance 
              payments={payments} 
              members={members} 
              onAddPayment={(p) => { setPayments([...payments, p]); refreshData(); }} 
            />
          )}
          {currentView === View.ROUTINES && (
            <Routines members={members} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
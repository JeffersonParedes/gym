import React, { useMemo } from 'react';
import { Member, Payment, Attendance, MembershipStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  members: Member[];
  payments: Payment[];
  attendance: Attendance[];
}

const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

const Dashboard: React.FC<DashboardProps> = ({ members, payments, attendance }) => {
  
  const stats = useMemo(() => {
    const activeMembers = members.filter(m => m.status === MembershipStatus.ACTIVE).length;
    const expiredMembers = members.filter(m => m.status === MembershipStatus.EXPIRED).length;
    
    // Calculate Monthly Revenue (simple sum of all payments)
    const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);
    
    // Check-ins today
    const today = new Date().toDateString();
    const todayCheckIns = attendance.filter(a => new Date(a.checkInTime).toDateString() === today).length;

    return { activeMembers, expiredMembers, totalRevenue, todayCheckIns };
  }, [members, payments, attendance]);

  const membershipStatusData = [
    { name: 'Activos', value: stats.activeMembers },
    { name: 'Vencidos', value: stats.expiredMembers },
    { name: 'Pendientes', value: members.length - stats.activeMembers - stats.expiredMembers },
  ];

  // Mock revenue data for chart
  const revenueData = [
    { name: 'Lun', ingresos: 120 },
    { name: 'Mar', ingresos: 200 },
    { name: 'Mie', ingresos: 150 },
    { name: 'Jue', ingresos: 300 },
    { name: 'Vie', ingresos: 250 },
    { name: 'Sab', ingresos: 400 },
    { name: 'Dom', ingresos: 100 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Panel Administrativo</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Socios Activos</p>
          <p className="text-3xl font-bold text-green-600">{stats.activeMembers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Membresías Vencidas</p>
          <p className="text-3xl font-bold text-red-500">{stats.expiredMembers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Ingresos Totales</p>
          <p className="text-3xl font-bold text-blue-600">S/ {stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Asistencias Hoy</p>
          <p className="text-3xl font-bold text-indigo-600">{stats.todayCheckIns}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Income Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Ingresos Semanales (Simulado)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="ingresos" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Membership Status Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Estado de Membresías</h3>
          <div className="h-64 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={membershipStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {membershipStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {membershipStatusData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                <span className="text-sm text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
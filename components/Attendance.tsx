import React, { useState } from 'react';
import { Member, Attendance, MembershipStatus } from '../types';
import { recordAttendance } from '../services/dataService';

interface AttendanceProps {
  members: Member[];
  attendanceHistory: Attendance[];
  onDataChange: () => void;
}

const AttendanceComp: React.FC<AttendanceProps> = ({ members, attendanceHistory, onDataChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [checkInStatus, setCheckInStatus] = useState<{msg: string, type: 'success' | 'error' | ''}>({msg: '', type: ''});

  const handleCheckIn = (member: Member) => {
    // 1. Validate Membership
    if (member.status !== MembershipStatus.ACTIVE) {
      setCheckInStatus({
        msg: `Error: La membresía de ${member.firstName} está ${member.status}.`,
        type: 'error'
      });
      return;
    }

    // 2. Validate Expired Date (Double Check)
    if (new Date(member.membershipEndDate) < new Date()) {
      setCheckInStatus({
        msg: `Error: La membresía venció el ${new Date(member.membershipEndDate).toLocaleDateString()}.`,
        type: 'error'
      });
      return;
    }

    // 3. Record
    recordAttendance(member.id, `${member.firstName} ${member.lastName}`);
    onDataChange();
    setCheckInStatus({
      msg: `¡Bienvenido, ${member.firstName}! Asistencia registrada.`,
      type: 'success'
    });

    // Clear message after 3 seconds
    setTimeout(() => setCheckInStatus({msg: '', type: ''}), 3000);
    setSearchTerm('');
  };

  const filteredMembers = members.filter(m => 
    m.dni.includes(searchTerm) || 
    m.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Control de Asistencia</h2>

      {/* Input Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buscar Socio por DNI o Nombre para marcar ingreso:
        </label>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Escribe DNI o Nombre..."
            className="flex-1 border rounded-lg p-3 text-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Message */}
        {checkInStatus.msg && (
          <div className={`mt-4 p-4 rounded-lg text-center font-bold ${
            checkInStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {checkInStatus.msg}
          </div>
        )}

        {/* Results Dropdown / List */}
        {searchTerm.length > 0 && (
          <div className="mt-4 border rounded-lg divide-y divide-gray-100">
            {filteredMembers.map(member => (
              <div key={member.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <p className="font-bold text-gray-800">{member.firstName} {member.lastName}</p>
                  <p className="text-sm text-gray-500">DNI: {member.dni} • Estado: 
                    <span className={member.status === MembershipStatus.ACTIVE ? 'text-green-600 font-bold ml-1' : 'text-red-500 font-bold ml-1'}>
                      {member.status}
                    </span>
                  </p>
                </div>
                <button 
                  onClick={() => handleCheckIn(member)}
                  disabled={member.status !== MembershipStatus.ACTIVE}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    member.status === MembershipStatus.ACTIVE 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Marcar Entrada
                </button>
              </div>
            ))}
            {filteredMembers.length === 0 && (
              <div className="p-4 text-center text-gray-500">No se encontraron socios.</div>
            )}
          </div>
        )}
      </div>

      {/* History Log */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 font-semibold text-gray-700">
          Registro de Hoy
        </div>
        <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
          {attendanceHistory
            .slice()
            .sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime())
            .map(record => (
            <div key={record.id} className="p-4 flex justify-between items-center">
              <span className="font-medium text-gray-800">{record.memberName}</span>
              <span className="text-gray-500 text-sm">
                {new Date(record.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          ))}
          {attendanceHistory.length === 0 && (
            <div className="p-8 text-center text-gray-500">Aún no hay ingresos registrados hoy.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceComp;
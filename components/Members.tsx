import React, { useState } from 'react';
import { Member, MembershipType, MembershipStatus } from '../types';
import { addMember, updateMember, deleteMember } from '../services/dataService';

interface MembersProps {
  members: Member[];
  onDataChange: () => void;
}

const Members: React.FC<MembersProps> = ({ members, onDataChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
    phone: '',
    medicalConditions: '',
    membershipType: MembershipType.MONTHLY,
  });

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      dni: '',
      email: '',
      phone: '',
      medicalConditions: '',
      membershipType: MembershipType.MONTHLY,
    });
    setEditingMember(null);
  };

  const handleOpenModal = (member?: Member) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        firstName: member.firstName,
        lastName: member.lastName,
        dni: member.dni,
        email: member.email,
        phone: member.phone,
        medicalConditions: member.medicalConditions || '',
        membershipType: member.membershipType,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const calculateDates = (type: MembershipType) => {
    const start = new Date();
    const end = new Date();
    
    switch (type) {
      case MembershipType.MONTHLY:
        end.setMonth(start.getMonth() + 1);
        break;
      case MembershipType.QUARTERLY:
        end.setMonth(start.getMonth() + 3);
        break;
      case MembershipType.ANNUAL:
        end.setFullYear(start.getFullYear() + 1);
        break;
      case MembershipType.VISIT:
        end.setDate(start.getDate() + 1);
        break;
    }
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMember) {
      // Update
      const updated: Member = {
        ...editingMember,
        ...formData,
      };
      updateMember(updated);
    } else {
      // Create
      const { startDate, endDate } = calculateDates(formData.membershipType);
      addMember({
        ...formData,
        joinDate: new Date().toISOString(),
        membershipStartDate: startDate,
        membershipEndDate: endDate,
        status: MembershipStatus.ACTIVE
      });
    }
    
    onDataChange();
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este socio?')) {
      deleteMember(id);
      onDataChange();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Socios</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <span>+ Nuevo Socio</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Nombre</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">DNI</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Membresía</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Vencimiento</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Estado</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-900">{member.firstName} {member.lastName}</div>
                      <div className="text-sm text-gray-400">{member.email}</div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{member.dni}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                      {member.membershipType}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    {new Date(member.membershipEndDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      member.status === MembershipStatus.ACTIVE 
                        ? 'bg-green-100 text-green-700' 
                        : member.status === MembershipStatus.EXPIRED 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleOpenModal(member)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        Editar
                      </button>
                      <button 
                         onClick={() => handleDelete(member.id)}
                         className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No hay socios registrados. Añade uno nuevo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {editingMember ? 'Editar Socio' : 'Registrar Nuevo Socio'}
            </h3>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
                <input required type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                <input required type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
                   value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                <input required type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
                   value={formData.dni} onChange={(e) => setFormData({...formData, dni: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input required type="tel" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
                   value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input required type="email" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
                   value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Condiciones Médicas / Lesiones</label>
                <textarea className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" rows={2}
                   value={formData.medicalConditions} onChange={(e) => setFormData({...formData, medicalConditions: e.target.value})}
                />
              </div>
              
              {!editingMember && (
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Membresía Inicial</label>
                    <select className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.membershipType} 
                      onChange={(e) => setFormData({...formData, membershipType: e.target.value as MembershipType})}
                    >
                      {Object.values(MembershipType).map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                 </div>
              )}

              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
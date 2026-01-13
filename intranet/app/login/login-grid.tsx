"use client";

import { useState } from "react";
import { loginAction } from "@/lib/auth-actions";
import { Shield, School, GraduationCap, User, BookOpen } from "lucide-react";

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
};

interface LoginGridProps {
    users: User[];
}

export function LoginGrid({ users }: LoginGridProps) {
    const [hoveredRole, setHoveredRole] = useState<string | null>(null);

    // Group users by role inside the client component to avoid serialization issues with Icons
    const rolesConfig = [
        { id: 'admin', label: 'Admin', color: 'bg-red-500', icon: Shield },
        { id: 'staff', label: 'Verwaltung', color: 'bg-purple-500', icon: School },
        { id: 'teacher', label: 'Lehrer', color: 'bg-green-700', icon: BookOpen },
        { id: 'student', label: 'Schüler', color: 'bg-blue-500', icon: GraduationCap },
    ];

    const roles = rolesConfig.map(config => ({
        ...config,
        users: users.filter(u => u.role === config.id)
    }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role) => (
                <div 
                    key={role.id}
                    className="relative group h-[500px]"
                    onMouseEnter={() => setHoveredRole(role.id)}
                    onMouseLeave={() => setHoveredRole(null)}
                >
                    <div 
                        className={`
                            absolute inset-0 rounded-2xl transition-all duration-500 ease-in-out border-2
                            ${hoveredRole === role.id 
                                ? `border-transparent shadow-[0_0_30px_rgba(0,0,0,0.2)] scale-105 z-10` 
                                : `border-${role.color.replace('bg-', '')}/30 bg-white/50 scale-100 z-0`
                            }
                            ${hoveredRole && hoveredRole !== role.id ? 'opacity-40 grayscale blur-sm scale-95' : 'opacity-100'}
                        `}
                        style={{
                            boxShadow: hoveredRole === role.id ? `0 0 40px ${getColorHex(role.id)}40` : 'none',
                            borderColor: hoveredRole === role.id ? 'transparent' : undefined
                        }}
                    >
                         {/* Animated Background Fill */}
                        <div className={`absolute inset-0 rounded-2xl overflow-hidden`}>
                             <div className={`absolute inset-0 transition-transform duration-700 ease-out origin-bottom 
                                ${hoveredRole === role.id ? 'translate-y-0' : 'translate-y-full'}
                                ${role.color}
                             `}>
                                {/* Pattern Overlay */}
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                             </div>
                        </div>

                         {/* Content */}
                        <div className="relative h-full flex flex-col p-6 z-20">
                            <div className={`
                                flex items-center gap-3 text-lg font-bold uppercase tracking-wider mb-8 transition-colors duration-300
                                ${hoveredRole === role.id ? 'text-white' : 'text-gray-700'}
                            `}>
                                <role.icon className={`h-6 w-6 ${hoveredRole === role.id ? 'text-white' : role.color.replace('bg-', 'text-')}`} />
                                {role.label}
                            </div>

                            <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar">
                                {role.users.map((user) => (
                                    <form key={user.id} action={loginAction.bind(null, user.id)}>
                                        <button className={`
                                            w-full p-3 rounded-xl flex items-center gap-4 transition-all duration-300 group/btn text-left
                                            ${hoveredRole === role.id 
                                                ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/10' 
                                                : 'bg-white hover:bg-gray-50 text-gray-800 shadow-sm border border-gray-100'
                                            }
                                        `}>
                                            <div className={`
                                                h-10 w-10 rounded-full flex items-center justify-center font-bold shadow-sm transition-transform group-hover/btn:scale-110
                                                ${hoveredRole === role.id 
                                                    ? 'bg-white text-' + role.color.replace('bg-', '') 
                                                    : role.color + ' text-white'
                                                }
                                            `}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold truncate">{user.name}</div>
                                                <div className={`text-xs truncate ${hoveredRole === role.id ? 'text-white/70' : 'text-gray-400'}`}>
                                                    {user.email}
                                                </div>
                                            </div>
                                        </button>
                                    </form>
                                ))}
                                {role.users.length === 0 && (
                                    <div className={`text-center py-10 italic ${hoveredRole === role.id ? 'text-white/50' : 'text-gray-400'}`}>
                                        Keine Benutzer
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function getColorHex(roleId: string) {
    switch(roleId) {
        case 'admin': return '#ef4444'; // red-500
        case 'staff': return '#a855f7'; // purple-500
        case 'teacher': return '#15803d'; // green-700
        case 'student': return '#3b82f6'; // blue-500
        default: return '#000000';
    }
}

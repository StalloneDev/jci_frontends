import { useAuth } from '@/lib/auth';
import { useState } from 'react';
import {
  UsersIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  ChevronRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const stats = [
  { 
    name: 'Membres Actifs', 
    value: '42', 
    icon: UsersIcon,
    change: '+12%',
    period: 'vs. mois dernier',
    color: 'blue'
  },
  { 
    name: 'Formations', 
    value: '8', 
    icon: AcademicCapIcon,
    change: '+5%',
    period: 'vs. mois dernier',
    color: 'indigo'
  },
  { 
    name: 'Commissions', 
    value: '5', 
    icon: ClipboardDocumentListIcon,
    change: null,
    period: null,
    color: 'purple'
  },
  { 
    name: 'Réunions', 
    value: '12', 
    icon: CalendarIcon,
    change: '+3%',
    period: 'vs. mois dernier',
    color: 'pink'
  },
];

const recentActivities = [
  {
    type: 'Formation',
    title: 'Formation Leadership',
    subtitle: 'Formation sur le leadership',
    date: '14 janv. 2025, 14:59',
    location: 'Salle A',
    capacity: '5/20',
  },
  {
    type: 'Formation',
    title: 'Workshop Communication',
    subtitle: 'Techniques de présentation',
    date: '15 janv. 2025, 10:00',
    location: 'Salle B',
    capacity: '8/15',
  },
  {
    type: 'Formation',
    title: 'Gestion de Projet',
    subtitle: 'Méthodologies agiles',
    date: '16 janv. 2025, 14:00',
    location: 'Salle C',
    capacity: '12/20',
  }
];

const colorVariants = {
  blue: 'bg-blue-50 text-blue-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  purple: 'bg-purple-50 text-purple-600',
  pink: 'bg-pink-50 text-pink-600'
};

export default function Dashboard() {
  const { user } = useAuth();
  const [expandedSection, setExpandedSection] = useState<'activities' | 'trainings' | null>(null);

  const toggleSection = (section: 'activities' | 'trainings') => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="py-8 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
            <p className="text-gray-500 mt-1">Bienvenue, {user?.firstName} 👋</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
              Cette semaine ▾
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Télécharger le rapport
            </button>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {stats.map((stat) => (
            <div 
              key={stat.name} 
              className="group bg-white overflow-hidden rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200"
            >
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-lg ${colorVariants[stat.color]} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors duration-300">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  {stat.change && (
                    <p className="text-sm flex items-center">
                      <span className="text-green-600 font-medium">{stat.change}</span>
                      <span className="text-gray-500 ml-1">{stat.period}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activities & Upcoming Trainings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
          {/* Recent Activities */}
          {(!expandedSection || expandedSection === 'activities') && (
            <div className={`bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 ${expandedSection === 'activities' ? 'lg:col-span-2' : ''}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Activités Récentes</h2>
                <button 
                  onClick={() => toggleSection('activities')}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200 group"
                >
                  {expandedSection === 'activities' ? (
                    <>
                      <ArrowLeftIcon className="w-4 h-4 mr-1" />
                      Retour
                    </>
                  ) : (
                    <>
                      Voir tout
                      <ChevronRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </div>
              <div className="space-y-6">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start group">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                        <AcademicCapIcon className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.subtitle}</p>
                        </div>
                        <span className="text-sm text-gray-500">{activity.date}</span>
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <span>{activity.location}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="font-medium text-blue-600">{activity.capacity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Trainings */}
          {(!expandedSection || expandedSection === 'trainings') && (
            <div className={`bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 ${expandedSection === 'trainings' ? 'lg:col-span-2' : ''}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Formations à Venir</h2>
                <button 
                  onClick={() => toggleSection('trainings')}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200 group"
                >
                  {expandedSection === 'trainings' ? (
                    <>
                      <ArrowLeftIcon className="w-4 h-4 mr-1" />
                      Retour
                    </>
                  ) : (
                    <>
                      Voir tout
                      <ChevronRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </div>
              <div className="space-y-6">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="p-4 rounded-lg bg-gray-50 group hover:bg-gray-100 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{activity.title}</p>
                      <span className="text-sm text-gray-500">{activity.date}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{activity.subtitle}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{activity.location}</span>
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-medium">{activity.capacity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-sm text-gray-500"> KJS - 2025 JCI Plateforme. Tous droits réservés.</span>
          <nav className="flex items-center space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Aide</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Confidentialité</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Conditions</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

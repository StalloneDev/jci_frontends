import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardBody } from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import { Switch } from '@headlessui/react';
import { classNames } from '@/utils/classNames';

export default function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false,
    language: 'fr',
  });

  return (
    <div>
      <PageHeader title="Paramètres" />

      <div className="space-y-6">
        <Card>
          <CardBody>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Notifications
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Gérez vos préférences de notifications.
                </p>

                <div className="mt-10 space-y-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium leading-6 text-gray-900">
                        Notifications par email
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        Recevez des notifications par email pour les activités importantes.
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(value) =>
                        setSettings((prev) => ({ ...prev, emailNotifications: value }))
                      }
                      className={classNames(
                        settings.emailNotifications ? 'bg-primary-600' : 'bg-gray-200',
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2'
                      )}
                    >
                      <span
                        className={classNames(
                          settings.emailNotifications ? 'translate-x-5' : 'translate-x-0',
                          'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                        )}
                      />
                    </Switch>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium leading-6 text-gray-900">
                        Notifications SMS
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        Recevez des notifications SMS pour les événements urgents.
                      </p>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onChange={(value) =>
                        setSettings((prev) => ({ ...prev, smsNotifications: value }))
                      }
                      className={classNames(
                        settings.smsNotifications ? 'bg-primary-600' : 'bg-gray-200',
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2'
                      )}
                    >
                      <span
                        className={classNames(
                          settings.smsNotifications ? 'translate-x-5' : 'translate-x-0',
                          'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                        )}
                      />
                    </Switch>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Apparence
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Personnalisez l'apparence de l'application.
                </p>

                <div className="mt-10 space-y-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium leading-6 text-gray-900">
                        Mode sombre
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        Activez le mode sombre pour une meilleure visibilité la nuit.
                      </p>
                    </div>
                    <Switch
                      checked={settings.darkMode}
                      onChange={(value) =>
                        setSettings((prev) => ({ ...prev, darkMode: value }))
                      }
                      className={classNames(
                        settings.darkMode ? 'bg-primary-600' : 'bg-gray-200',
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2'
                      )}
                    >
                      <span
                        className={classNames(
                          settings.darkMode ? 'translate-x-5' : 'translate-x-0',
                          'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                        )}
                      />
                    </Switch>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Langue
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Choisissez la langue de l'interface.
                </p>

                <div className="mt-6">
                  <select
                    id="language"
                    name="language"
                    value={settings.language}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, language: e.target.value }))
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Button variant="white">Annuler</Button>
              <Button>Enregistrer</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

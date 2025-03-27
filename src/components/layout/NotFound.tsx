import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-full flex-col bg-white pt-16 pb-12">
      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-6 lg:px-8">
        <div className="flex flex-shrink-0 justify-center">
          <a href="/" className="inline-flex">
            <span className="sr-only">JCI</span>
            <img
              className="h-12 w-auto"
              src="/logo.svg"
              alt="JCI Logo"
            />
          </a>
        </div>
        <div className="py-16">
          <div className="text-center">
            <p className="text-base font-semibold text-primary">404</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Page non trouvée
            </h1>
            <p className="mt-2 text-base text-gray-500">
              Désolé, nous n'avons pas trouvé la page que vous recherchez.
            </p>
            <div className="mt-6">
              <Button onClick={() => navigate('/')}>
                Retourner à l'accueil
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

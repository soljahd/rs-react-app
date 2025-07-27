import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function AppLayout() {
  return (
    <div className="app mx-auto flex min-h-screen max-w-5xl min-w-3xl flex-col justify-start gap-8 p-4">
      <Header />
      <main className="flex flex-1">
        <Outlet />
      </main>
    </div>
  );
}

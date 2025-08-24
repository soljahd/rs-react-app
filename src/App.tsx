import { useEffect, useState } from 'react';
import Button from './components/Button';
import ControlledForm from './components/ControlledForm';
import DataTile from './components/DataTile';
import Modal from './components/Modal';
import UncontrolledForm from './components/UncontrolledForm';
import { useFormStore } from './store/formStore';

function App() {
  const [isModalOpen, setModalIsOpen] = useState<null | 'controlled' | 'uncontrolled'>(null);
  const { controlledForms, uncontrolledForms, hydrateCountries } = useFormStore();

  useEffect(() => {
    hydrateCountries();
  }, [hydrateCountries]);

  return (
    <div className="flex min-h-screen flex-col items-center gap-5 p-8">
      <h1 className="text-3xl font-bold">React Forms</h1>

      <div className="flex gap-4">
        <Button
          onClick={() => {
            setModalIsOpen('uncontrolled');
          }}
        >
          Open Uncontrolled Form
        </Button>
        <Button
          onClick={() => {
            setModalIsOpen('controlled');
          }}
        >
          Open Controlled Form
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <div>
          <h2 className="mb-2 text-xl font-semibold">Uncontrolled Form</h2>
          <div className="grid gap-3">
            {uncontrolledForms.map((d, i) => (
              <DataTile key={i} data={d} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-2 text-xl font-semibold">Controlled Form</h2>
          <div className="grid gap-3">
            {controlledForms.map((d, i) => (
              <DataTile key={i} data={d} />
            ))}
          </div>
        </div>
      </section>

      <Modal
        isOpen={!!isModalOpen}
        onClose={() => {
          setModalIsOpen(null);
        }}
        title={isModalOpen === 'controlled' ? 'Controlled Form' : 'Uncontrolled Form'}
      >
        {isModalOpen === 'controlled' ? (
          <ControlledForm
            onClose={() => {
              setModalIsOpen(null);
            }}
          />
        ) : (
          <UncontrolledForm
            onClose={() => {
              setModalIsOpen(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

export default App;

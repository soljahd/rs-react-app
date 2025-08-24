import { useState } from 'react';
import Button from './components/Button';
import ControlledForm from './components/ControlledForm';
import Modal from './components/Modal';
import UncontrolledForm from './components/UncontrolledForm';

function App() {
  const [isModalOpen, setModalIsOpen] = useState<null | 'controlled' | 'uncontrolled'>(null);
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

import { useState, useRef } from 'react';
import Autocomplete from './Autocomplete';
import Button from './Button';
import Input from './Input';
import PasswordStrength from './PasswordStrength';
import Select from './Select';
import { formSchema } from '../schemas/formSchema';
import { useFormStore } from '../store/formStore';
import { validateImage, fileToBase64 } from '../utils/image';

function UncontrolledForm({ onClose }: { onClose: () => void }) {
  const { addUncontrolledForm, countries } = useFormStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<string | undefined>();

  const refs = {
    name: useRef<HTMLInputElement>(null),
    age: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
    confirmPassword: useRef<HTMLInputElement>(null),
    gender: useRef<HTMLSelectElement>(null),
    country: useRef<HTMLInputElement>(null),
    terms: useRef<HTMLInputElement>(null),
    image: useRef<HTMLInputElement>(null),
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const msg = validateImage(file);
    if (msg) {
      setErrors((prev) => ({ ...prev, image: msg }));
      e.target.value = '';
      setPreview(undefined);
      return;
    }

    setErrors((prev) => ({ ...prev, image: '' }));
    const b64 = await fileToBase64(file);
    setPreview(b64);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      name: refs.name.current?.value,
      age: refs.age.current?.value,
      email: refs.email.current?.value,
      password: refs.password.current?.value,
      confirmPassword: refs.confirmPassword.current?.value,
      gender: refs.gender.current?.value as 'male' | 'female',
      country: refs.country.current?.value,
      terms: refs.terms.current?.checked,
      image: preview ? preview : '',
    };

    const result = formSchema.safeParse(data);

    if (!result.success) {
      const map: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (!map[key]) map[key] = issue.message;
      });
      setErrors(map);
      return;
    }

    addUncontrolledForm(result.data);
    onClose();
  };

  return (
    <form className="flex max-h-200 flex-col gap-4 overflow-y-scroll p-4" onSubmit={onSubmit}>
      <Input
        id="name"
        label="Name"
        ref={refs.name}
        error={errors.name}
        onChange={() => {
          setErrors((s) => ({ ...s, name: '' }));
        }}
      />
      <Input
        id="age"
        label="Age"
        type="number"
        ref={refs.age}
        error={errors.age}
        onChange={() => {
          setErrors((s) => ({ ...s, age: '' }));
        }}
      />
      <Input
        id="email"
        label="Email"
        type="email"
        ref={refs.email}
        error={errors.email}
        onChange={() => {
          setErrors((s) => ({ ...s, email: '' }));
        }}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="password"
          label="Password"
          type="password"
          ref={refs.password}
          error={errors.password}
          onChange={() => {
            setErrors((s) => ({ ...s, password: '' }));
          }}
        />
        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          ref={refs.confirmPassword}
          error={errors.confirmPassword}
          onChange={() => {
            setErrors((s) => ({ ...s, confirmPassword: '' }));
          }}
        />
      </div>

      <PasswordStrength password={refs.password.current?.value || ''} />

      <Select
        id="gender"
        label="Gender"
        ref={refs.gender}
        error={errors.gender}
        options={[
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ]}
      />

      <Autocomplete
        id="country"
        label="Country"
        options={countries}
        ref={refs.country}
        value={refs.country.current?.value || ''}
        onChange={(val) => {
          if (refs.country.current) refs.country.current.value = val;
          setErrors((s) => ({ ...s, country: '' }));
        }}
        error={errors.country}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="image" className="block text-sm font-medium">
          Picture (PNG/JPEG, ≤2MB)
        </label>
        <input
          id="image"
          type="file"
          ref={refs.image}
          accept="image/png,image/jpeg"
          onChange={(event) => void handleImageChange(event)}
          className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
        />
        {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
        {preview && <img src={preview} alt="Preview" className="h-24 w-24 rounded-xl border object-cover" />}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="terms"
          type="checkbox"
          ref={refs.terms}
          onChange={() => {
            setErrors((s) => ({ ...s, terms: '' }));
          }}
        />
        <label htmlFor="terms">I accept Terms & Conditions</label>
      </div>
      <div className="h-5">{errors.terms && <p className="text-sm text-red-600">{errors.terms}</p>}</div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}

export default UncontrolledForm;

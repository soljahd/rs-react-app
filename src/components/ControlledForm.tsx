import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Autocomplete from './Autocomplete';
import Button from './Button';
import Input from './Input';
import PasswordStrength from './PasswordStrength';
import Select from './Select';
import { formSchema } from '../schemas/formSchema';
import { countries } from '../utils/countries';
import { validateImage, fileToBase64 } from '../utils/image';
import type { FormSchema } from '../schemas/formSchema';
import type { ChangeEvent } from 'react';

function ControlledForm({ onClose }: { onClose: () => void }) {
  const [preview, setPreview] = useState<string | undefined>();
  const [imageError, setImageError] = useState<string | null>(null);

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: FormSchema) => {
    console.log(data);
    onClose();
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const msg = validateImage(file);
    if (msg) {
      setImageError(msg);
      e.target.value = '';
      return;
    } else {
      setImageError(null);
      const b64 = await fileToBase64(file);
      setPreview(b64);
      setValue('image', b64, { shouldValidate: true, shouldDirty: true });
    }
  };

  const password = watch('password') || '';

  return (
    <form
      className="flex max-h-200 flex-col gap-4 overflow-y-scroll p-4"
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
    >
      <Input id="name" label="Name" {...register('name')} error={errors.name?.message} />
      <Input id="age" label="Age" {...register('age')} error={errors.age?.message} />
      <Input id="email" label="Email" {...register('email')} error={errors.email?.message} />

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="password"
          label="Password"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />
        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />
      </div>

      <PasswordStrength password={password} />

      <Select
        id="gender"
        label="Gender"
        options={[
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ]}
        {...register('gender')}
        error={errors.gender?.message}
      />

      <Autocomplete
        id="country"
        label="Country"
        options={countries}
        value={watch('country') || ''}
        onChange={(val) => {
          setValue('country', val, { shouldValidate: true });
        }}
        error={errors.country?.message}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="image" className="block text-sm font-medium">
          Picture (PNG/JPEG, ≤2MB)
        </label>
        <input
          id="image"
          type="file"
          accept="image/png,image/jpeg"
          onChange={(event) => void handleImageChange(event)}
          className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
        />
        {imageError && (
          <div className="h-5">
            <p className="text-sm text-red-600">{imageError}</p>
          </div>
        )}
        <div className="h-5" />
        {preview && <img src={preview} alt="Preview" className="h-24 w-24 rounded-xl border object-cover" />}
      </div>

      <div className="flex items-center gap-2">
        <input id="terms" type="checkbox" {...register('terms')} />
        <label htmlFor="terms">I accept Terms & Conditions</label>
      </div>
      <div className="h-5">{errors.terms && <p className="text-sm text-red-600">{errors.terms.message}</p>}</div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isValid}>
          Submit
        </Button>
      </div>
    </form>
  );
}

export default ControlledForm;
